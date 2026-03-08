# Backend: Node.js / NestJS / Python / PostgreSQL

## NestJS Architecture

### Module Structure
```typescript
// Organize by feature (vertical slices), not by layer type
src/
├── modules/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── users.spec.ts
│   └── orders/
├── shared/
│   ├── filters/          # Exception filters
│   ├── guards/           # Auth guards
│   ├── interceptors/     # Logging, transform
│   ├── decorators/       # Custom decorators
│   └── pipes/            # Validation pipes
└── infrastructure/
    ├── database/
    └── cache/
```

### Controller Pattern
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll(@Query() query: ListUsersDto): Promise<PagedResponse<UserDto>> {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    const result = await this.usersService.findOne(id)
    if (!result) throw new NotFoundException(`User ${id} not found`)
    if (result.id !== user.id && user.role !== 'admin') throw new ForbiddenException()
    return result
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ): Promise<UserDto> {
    return this.usersService.update(id, dto, user)
  }
}
```

### DTOs with class-validator
```typescript
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt limit
  password: string

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER
}
```

---

## PostgreSQL Patterns

### Schema Design
```sql
-- Always: UUIDs, timestamps, soft deletes, proper constraints
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ -- soft delete
);

CREATE TABLE orders (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status      TEXT NOT NULL DEFAULT 'pending',
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index every FK and common filter column
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Compound index for common query patterns
CREATE INDEX idx_orders_user_status ON orders(user_id, status) WHERE deleted_at IS NULL;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Query Patterns
```typescript
// Drizzle ORM — type-safe, zero magic
import { db } from './db'
import { users, orders } from './schema'
import { eq, and, isNull, desc, sql } from 'drizzle-orm'

// ✅ Parameterized — never interpolate user input
const user = await db.select()
  .from(users)
  .where(and(eq(users.email, email), isNull(users.deletedAt)))
  .limit(1)

// Joins with proper typing
const userOrders = await db.select({
  orderId: orders.id,
  status: orders.status,
  total: orders.totalCents,
  userEmail: users.email,
})
.from(orders)
.innerJoin(users, eq(orders.userId, users.id))
.where(eq(orders.userId, userId))
.orderBy(desc(orders.createdAt))
.limit(20)

// Pagination with cursor
const nextPage = await db.select()
  .from(orders)
  .where(and(
    eq(orders.userId, userId),
    cursor ? sql`${orders.createdAt} < ${cursor}` : undefined,
  ))
  .orderBy(desc(orders.createdAt))
  .limit(pageSize + 1) // fetch one extra to check hasMore

// Transactions
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`balance - ${amount}` }).where(eq(accounts.id, fromId))
  await tx.update(accounts).set({ balance: sql`balance + ${amount}` }).where(eq(accounts.id, toId))
  await tx.insert(transfers).values({ fromId, toId, amount, occurredAt: new Date() })
})
```

### N+1 Prevention
```typescript
// ❌ N+1: fetches 1 + N queries
const orders = await getOrders()
for (const order of orders) {
  order.user = await getUserById(order.userId) // N queries!
}

// ✅ Join or batch
const ordersWithUsers = await db.select().from(orders).innerJoin(users, eq(orders.userId, users.id))

// ✅ DataLoader for GraphQL
const userLoader = new DataLoader(async (ids: readonly string[]) => {
  const users = await db.select().from(usersTable).where(inArray(usersTable.id, [...ids]))
  return ids.map(id => users.find(u => u.id === id) ?? null)
})
```

### Connection Pool Configuration
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,              // Max connections (match pgBouncer pool size)
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // SSL in production
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
})

// Monitor pool health
pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected pool error')
})
```

---

## Python Backend (FastAPI)

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    logger.info("database.connected")
    yield
    await db.disconnect()
    logger.info("database.disconnected")

app = FastAPI(lifespan=lifespan, docs_url=None if settings.is_production else "/docs")

# Models with Pydantic v2
from pydantic import BaseModel, EmailStr, Field, field_validator
from uuid import UUID
from datetime import datetime

class CreateUserRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)

    @field_validator('email')
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower().strip()

class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}

# Repository pattern
class UserRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def find_by_email(self, email: str) -> User | None:
        result = await self._db.execute(
            select(User).where(User.email == email, User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

# Router
router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: CreateUserRequest,
    user_service: UserService = Depends(get_user_service),
):
    result = await user_service.create(body)
    if not result.ok:
        raise HTTPException(status_code=422, detail=result.error)
    return result.value
```

---

## Async Job Queue (BullMQ)

```typescript
// jobs/email.job.ts
import { Queue, Worker, Job } from 'bullmq'

const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 86400 }, // keep 24h
    removeOnFail: { age: 604800 },    // keep 7 days
  },
})

// Producer
export async function enqueueWelcomeEmail(userId: string) {
  await emailQueue.add('welcome', { userId }, {
    delay: 5000,           // 5s delay
    priority: 1,           // Higher = lower priority (counterintuitive)
  })
}

// Worker
const emailWorker = new Worker('email', async (job: Job) => {
  const { userId } = job.data
  const user = await userRepo.findById(userId)
  if (!user) {
    logger.warn({ userId, jobId: job.id }, 'User not found for welcome email')
    return // Don't throw — job succeeded (user deleted, nothing to do)
  }
  await mailer.send({ to: user.email, template: 'welcome', data: { name: user.name } })
}, {
  connection: redis,
  concurrency: 10,
})

emailWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Email job failed')
})
```

---

## Structured Logging

```typescript
import pino from 'pino'

export const logger = pino({
  level: env.LOG_LEVEL ?? 'info',
  ...(env.NODE_ENV === 'development' && {
    transport: { target: 'pino-pretty' }
  }),
})

// Always log with context — never bare strings
logger.info({ userId, orderId, amount }, 'Payment processed')
logger.error({ err: error, userId, requestId }, 'Failed to process payment')

// Request correlation ID middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID()
  req.log = logger.child({ requestId })
  res.setHeader('x-request-id', requestId)
  next()
})
```