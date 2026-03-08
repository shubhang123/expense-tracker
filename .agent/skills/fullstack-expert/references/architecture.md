# Architecture & Design Patterns

## Clean Architecture Principles

### Dependency Rule
Dependencies point **inward only**. Outer layers know about inner layers; inner layers know nothing about outer.

```
[Presentation] → [Application/Use Cases] → [Domain] ← [Infrastructure]
```

### Domain Layer (Pure Business Logic)
```typescript
// domain/entities/user.ts — No framework imports EVER
export class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: Email,
    public readonly role: UserRole,
    private passwordHash: PasswordHash,
  ) {}

  static create(props: CreateUserProps): Result<User> {
    const emailResult = Email.create(props.email)
    if (!emailResult.ok) return emailResult

    return { ok: true, value: new User(UserId.generate(), emailResult.value, props.role, props.passwordHash) }
  }

  canAccessResource(resource: Resource): boolean {
    return this.role === UserRole.ADMIN || resource.ownerId === this.id
  }
}

// domain/repositories/user.repository.ts — Interface, not implementation
export interface UserRepository {
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: UserId): Promise<void>
}
```

### Use Case Pattern
```typescript
// application/use-cases/create-user.use-case.ts
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<Result<UserId>> {
    const existing = await this.userRepo.findByEmail(Email.create(command.email).value!)
    if (existing) return { ok: false, error: new AppError('USER_EXISTS') }

    const hash = await this.passwordHasher.hash(command.password)
    const userResult = User.create({ email: command.email, passwordHash: hash, role: UserRole.USER })
    if (!userResult.ok) return userResult

    await this.userRepo.save(userResult.value)
    await this.eventBus.publish(new UserCreatedEvent(userResult.value.id))

    return { ok: true, value: userResult.value.id }
  }
}
```

---

## Scalability Patterns

### CQRS (Command Query Responsibility Segregation)
Use when read and write models diverge significantly:

```typescript
// Commands mutate state
class TransferFundsCommand { constructor(public from: AccountId, public to: AccountId, public amount: Money) {} }

// Queries return optimized read models (can use different DB/cache)
class GetAccountSummaryQuery { constructor(public accountId: AccountId) {} }
```

### Event-Driven Architecture
```typescript
// Decouple services via events
class OrderPlacedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly total: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

// Multiple consumers, zero coupling
eventBus.subscribe(OrderPlacedEvent, [
  sendOrderConfirmationEmail,
  updateInventory,
  triggerFulfillment,
  recordAnalytics,
])
```

### Saga Pattern (Distributed Transactions)
```typescript
// Orchestration saga for multi-step workflows
class CheckoutSaga {
  async execute(command: CheckoutCommand): Promise<void> {
    const reservationId = await this.inventoryService.reserve(command.items)
    
    try {
      const chargeId = await this.paymentService.charge(command.payment)
      try {
        await this.orderService.confirm(command, reservationId, chargeId)
      } catch {
        await this.paymentService.refund(chargeId)
        throw new CheckoutError('ORDER_CONFIRMATION_FAILED')
      }
    } catch {
      await this.inventoryService.release(reservationId)
      throw
    }
  }
}
```

---

## API Design

### REST Best Practices
```
GET    /users              # list (with pagination)
GET    /users/:id          # single resource
POST   /users              # create
PUT    /users/:id          # full replace
PATCH  /users/:id          # partial update
DELETE /users/:id          # soft delete preferred

# Nested resources (max 2 levels)
GET    /users/:id/orders
GET    /orders/:id         # not /users/:id/orders/:orderId

# Actions that don't fit CRUD
POST   /orders/:id/cancel
POST   /users/:id/resend-verification
```

### Pagination Standard
```typescript
// Cursor-based for large datasets (preferred)
interface CursorPage<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

// Offset-based for small, stable datasets
interface OffsetPage<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

### API Response Envelope
```typescript
// Success
{ "data": { ... }, "meta": { "requestId": "uuid" } }

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",        // Machine-readable
    "message": "Email is invalid",     // Human-readable
    "details": [{ "field": "email", "message": "Invalid format" }],
    "requestId": "uuid"
  }
}
```

---

## Module Design Principles

### Cohesion & Coupling
- **High cohesion**: Things that change together, live together
- **Low coupling**: Modules communicate via stable interfaces, not internal details
- **Single responsibility**: One reason to change

### Dependency Injection
```typescript
// Always inject dependencies; never instantiate inside constructors
class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,    // interface
    private readonly paymentGateway: PaymentGateway, // interface
    private readonly logger: Logger,                 // interface
  ) {}
}

// DI container handles wiring
container.bind<OrderRepository>(TOKENS.OrderRepository).to(PostgresOrderRepository)
container.bind<PaymentGateway>(TOKENS.PaymentGateway).to(StripePaymentGateway)
```

---

## Feature Flags & Progressive Rollout

```typescript
// Always gate new features
if (await featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return newCheckoutFlow(cart)
}
return legacyCheckoutFlow(cart)
```

```typescript
// Config-driven, not code-driven
const flags = {
  'new-checkout-flow': { enabled: true, rolloutPercentage: 10, allowlist: ['internal-users'] },
}
```