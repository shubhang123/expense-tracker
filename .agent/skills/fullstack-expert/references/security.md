# Security: OWASP & Production Hardening

## Authentication & Authorization

### JWT Best Practices
```typescript
// Short-lived access tokens + rotating refresh tokens
const ACCESS_TOKEN_TTL = '15m'  // never longer
const REFRESH_TOKEN_TTL = '7d'

// Rotation on use (sliding window)
async function refreshTokens(refreshToken: string) {
  const payload = await verifyToken(refreshToken, env.REFRESH_SECRET)
  const storedToken = await tokenStore.get(payload.jti)
  
  if (!storedToken || storedToken.isRevoked) {
    // Possible token theft — revoke all user tokens
    await tokenStore.revokeAll(payload.userId)
    throw new UnauthorizedException('Token reuse detected')
  }

  await tokenStore.revoke(payload.jti) // Revoke old token
  return issueTokenPair(payload.userId) // Issue new pair
}

// Always validate all claims
function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: 'myapp',
    audience: 'myapp-client',
  })
}
```

### Password Handling
```typescript
import { hash, verify } from '@node-rs/argon2' // prefer over bcrypt

// Hash on create/update
const passwordHash = await hash(password, {
  memoryCost: 65536,   // 64MB
  timeCost: 3,
  parallelism: 4,
})

// Verify on login — constant-time comparison built in
const isValid = await verify(storedHash, candidatePassword)

// ⚠️ NEVER: store plain text, log passwords, use MD5/SHA1, use bcrypt rounds < 10
```

### RBAC Authorization Guard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles?.length) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user) return false

    return requiredRoles.some(role => user.roles.includes(role))
  }
}
```

---

## Input Validation & Injection Prevention

```typescript
// NEVER interpolate user input into queries
// ❌
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`)

// ✅ Always parameterized
const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
// Or via ORM
const user = await db.select().from(users).where(eq(users.email, email))

// Sanitize HTML output — use a whitelist parser
import DOMPurify from 'isomorphic-dompurify'
const safeHtml = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href'],
})

// File upload validation
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function validateUpload(file: Express.Multer.File) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) throw new BadRequestException('Invalid file type')
  if (file.size > MAX_FILE_SIZE) throw new BadRequestException('File too large')
  // Verify magic bytes match claimed MIME type
  const magic = file.buffer.slice(0, 4)
  if (!isValidImageMagicBytes(magic, file.mimetype)) throw new BadRequestException('File content mismatch')
}
```

---

## HTTP Security Headers

```typescript
// Express / NestJS — use helmet
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-{NONCE}'"], // Generate nonce per request
      styleSrc: ["'self'", "'unsafe-inline'"],  // Tighten if possible
      imgSrc: ["'self'", 'data:', 'https://cdn.myapp.com'],
      connectSrc: ["'self'", 'https://api.myapp.com'],
      frameAncestors: ["'none'"],               // Prevent clickjacking
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))

// CORS — explicit allowlist, never wildcard in production
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

// Global limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  store: new RedisStore({ client: redis }),
  handler: (req, res) => res.status(429).json({ error: { code: 'RATE_LIMITED' } }),
}))

// Stricter on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes per IP
  skipSuccessfulRequests: false,
  store: new RedisStore({ client: redis, prefix: 'rl:auth:' }),
})

app.post('/auth/login', authLimiter, authController.login)
app.post('/auth/forgot-password', authLimiter, authController.forgotPassword)
```

---

## Secrets Management

```typescript
// ✅ Always: environment variables, secrets manager
const config = {
  databaseUrl: env.DATABASE_URL,          // From process.env
  jwtSecret: await secretsManager.get('jwt-secret'), // AWS Secrets Manager
}

// ✅ Validate all secrets present at startup
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
})
export const env = EnvSchema.parse(process.env) // Crashes loudly if missing

// ❌ NEVER
const config = {
  jwtSecret: 'my-secret-key',            // Hardcoded
  apiKey: process.env.API_KEY || 'dev',  // Falls back to insecure default
}

// .gitignore — must include
// .env
// .env.local
// .env.*.local
// *.pem
// *.key
```

---

## OWASP Top 10 Checklist

| Risk | Mitigation |
|------|-----------|
| A01 Broken Access Control | RBAC guards on every route, test authz in every test |
| A02 Cryptographic Failures | HTTPS only, TLS 1.2+, argon2 for passwords, no MD5/SHA1 |
| A03 Injection | Parameterized queries always, Zod/class-validator for all input |
| A04 Insecure Design | Threat model new features, defense-in-depth |
| A05 Security Misconfiguration | Helmet, strict CORS, env var validation at startup |
| A06 Vulnerable Components | `npm audit` in CI, Dependabot/Renovate enabled |
| A07 Auth Failures | Short-lived JWTs, refresh token rotation, rate limiting |
| A08 Software Integrity | Lock files committed, signed commits, SBOM |
| A09 Logging Failures | Structured logs, never log passwords/tokens, log auth events |
| A10 SSRF | Allowlist outbound URLs, never proxy user-controlled URLs |

---

## Sensitive Data Handling

```typescript
// Never log sensitive fields
logger.info({
  userId: user.id,
  email: user.email,
  // ❌ password: user.password,
  // ❌ token: session.token,
  // ❌ cardNumber: payment.cardNumber,
})

// Mask in responses
function serializeUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    // password excluded automatically (not in DTO)
  }
}

// Encrypt PII at rest
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(env.ENCRYPTION_KEY, 'hex'), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}
```