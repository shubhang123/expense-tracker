# DevOps: Docker / CI-CD / Infrastructure

## Docker

### Production Dockerfile (Node.js)
```dockerfile
# Multi-stage build — keep final image lean and secure
FROM node:20-alpine AS base
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
# Separate dev deps for build
RUN cp -r node_modules prod_node_modules
RUN npm ci

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
ENV NODE_ENV=production

# Security: run as non-root
USER nextjs

COPY --from=deps --chown=nextjs:nodejs /app/prod_node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

### Docker Compose (Development)
```yaml
# docker-compose.yml
version: '3.9'
services:
  api:
    build: { context: ., dockerfile: Dockerfile.dev }
    volumes:
      - .:/app
      - /app/node_modules  # Don't mount host node_modules
    ports: ['3000:3000']
    environment:
      DATABASE_URL: postgresql://app:secret@db:5432/appdb
      REDIS_URL: redis://cache:6379
    depends_on:
      db: { condition: service_healthy }
      cache: { condition: service_started }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U app -d appdb']
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  postgres_data:
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Type Check & Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check

  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run test:ci
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with: { fail_ci_if_error: true }

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          ignore-unfixed: true
          severity: HIGH,CRITICAL

  deploy:
    name: Deploy
    needs: [quality, test, security]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Build & push image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - name: Deploy to production
        run: |
          # Rolling deploy — zero downtime
          kubectl set image deployment/api api=ghcr.io/${{ github.repository }}:${{ github.sha }}
          kubectl rollout status deployment/api --timeout=5m
```

---

## Database Migrations

```typescript
// Always: version-controlled, reversible, tested migrations
// Use Drizzle Kit or Flyway

// drizzle/migrations/0001_add_orders_table.sql
-- Migration: 0001_add_orders_table
-- Created: 2024-03-07

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Rollback (always write the reverse)
-- DROP TABLE orders;
```

```typescript
// Run migrations before app start (never in parallel processes)
async function runMigrations() {
  logger.info('Running database migrations...')
  await migrate(db, { migrationsFolder: './drizzle/migrations' })
  logger.info('Migrations complete')
}

// In startup
await runMigrations()
await app.listen(env.PORT)
```

---

## Health Checks

```typescript
// /health — for load balancer (fast, no DB)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// /health/ready — for k8s readiness probe (checks dependencies)
app.get('/health/ready', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`)
    await redis.ping()
    res.json({ status: 'ready', db: 'ok', cache: 'ok' })
  } catch (error) {
    res.status(503).json({ status: 'not_ready', error: getErrorMessage(error) })
  }
})
```

---

## Environment Configuration

```
# .env.example (committed to repo — no real secrets)
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://app:secret@localhost:5432/appdb
DATABASE_POOL_MAX=10

# Auth
JWT_SECRET=change-me-to-at-least-32-character-secret
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Redis
REDIS_URL=redis://localhost:6379

# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...

# Observability
LOG_LEVEL=info
SENTRY_DSN=https://...
```

```typescript
// Validate at startup — fail fast with clear error messages
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  REDIS_URL: z.string().url(),
})

const result = EnvSchema.safeParse(process.env)
if (!result.success) {
  console.error('Invalid environment configuration:')
  console.error(result.error.flatten().fieldErrors)
  process.exit(1)
}
export const env = result.data
```

---

## Observability

```typescript
// Structured logging with request correlation
import pino from 'pino'
import { AsyncLocalStorage } from 'async_hooks'

const requestContext = new AsyncLocalStorage<{ requestId: string }>()

export const logger = pino({
  mixin: () => requestContext.getStore() ?? {},
})

// Middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID()
  requestContext.run({ requestId }, next)
  res.setHeader('x-request-id', requestId)
})

// Metrics (Prometheus-compatible)
import { Counter, Histogram, register } from 'prom-client'

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5],
})

// /metrics endpoint for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})
```