# Testing Strategy: 90%+ Coverage

## Testing Philosophy

**Tests are first-class code.** Untested code is broken code you haven't found yet.

### The Testing Trophy (preferred over pyramid for full-stack)
```
         /\
        /e2e\          <- Few (critical user journeys only)
       /------\
      /integr- \       <- Most tests live here
     /  ation   \
    /------------\
   /    unit      \    <- Pure functions, complex logic
  /________________\
      static types     <- TypeScript catches a lot for free
```

**Key insight**: Integration tests (testing a real service with a real DB) give the most confidence per test dollar. Don't over-invest in unit tests for code that just orchestrates other code.

---

## Unit Tests (Vitest / Jest)

```typescript
// users.service.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UsersService } from './users.service'
import { createMockUserRepository } from '@test/factories/user.factory'

describe('UsersService', () => {
  let service: UsersService
  let userRepo: ReturnType<typeof createMockUserRepository>

  beforeEach(() => {
    userRepo = createMockUserRepository()
    service = new UsersService(userRepo, mockPasswordHasher, mockEventBus)
  })

  describe('createUser', () => {
    it('creates user with hashed password', async () => {
      userRepo.findByEmail.mockResolvedValue(null)
      mockPasswordHasher.hash.mockResolvedValue('hashed123')

      const result = await service.createUser({ email: 'test@example.com', password: 'secret123', name: 'Test' })

      expect(result.ok).toBe(true)
      expect(userRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' })
      )
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('secret123')
    })

    it('returns error when email already exists', async () => {
      userRepo.findByEmail.mockResolvedValue(mockUser({ email: 'test@example.com' }))

      const result = await service.createUser({ email: 'test@example.com', password: 'secret123', name: 'Test' })

      expect(result.ok).toBe(false)
      expect(result.error.code).toBe('USER_EXISTS')
    })

    it('never stores plaintext password', async () => {
      userRepo.findByEmail.mockResolvedValue(null)
      
      await service.createUser({ email: 'test@example.com', password: 'plaintext', name: 'Test' })

      const savedUser = userRepo.save.mock.calls[0][0]
      expect(savedUser.passwordHash).not.toContain('plaintext')
    })
  })
})
```

### Test Factories
```typescript
// test/factories/user.factory.ts
import { vi } from 'vitest'
import type { UserRepository } from '@/domain/repositories'

export function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'usr_test123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    passwordHash: '$argon2id$...',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  }
}

export function createMockUserRepository(): jest.Mocked<UserRepository> {
  return {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  }
}
```

---

## Integration Tests

```typescript
// test/integration/users.integration.spec.ts
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { createTestingApp, resetDatabase } from '@test/helpers/db'
import * as request from 'supertest'

describe('Users API (integration)', () => {
  let app: INestApplication
  let db: TestDatabase

  beforeAll(async () => {
    db = await createTestingApp()
    app = db.app
    await app.init()
  })

  beforeEach(async () => {
    await resetDatabase(db) // Truncate all tables, reset sequences
  })

  afterAll(async () => {
    await app.close()
    await db.destroy()
  })

  describe('POST /users', () => {
    it('creates user and returns 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'new@example.com', password: 'Secure123!', name: 'New User' })
        .expect(201)

      expect(response.body.data).toMatchObject({
        email: 'new@example.com',
        name: 'New User',
      })
      expect(response.body.data).not.toHaveProperty('password')
      expect(response.body.data).not.toHaveProperty('passwordHash')

      // Verify persisted
      const dbUser = await db.users.findOne({ where: { email: 'new@example.com' } })
      expect(dbUser).toBeTruthy()
    })

    it('returns 422 for duplicate email', async () => {
      await createUser(db, { email: 'exists@example.com' })

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'exists@example.com', password: 'Secure123!', name: 'Dupe' })
        .expect(422)

      expect(response.body.error.code).toBe('USER_EXISTS')
    })

    it('returns 422 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'not-an-email', password: 'Secure123!', name: 'Test' })
        .expect(422)
    })
  })

  describe('authentication', () => {
    it('blocks unauthenticated requests to protected routes', async () => {
      await request(app.getHttpServer()).get('/users').expect(401)
    })

    it('blocks insufficient permissions', async () => {
      const token = await loginAs(app, { role: 'user' })

      await request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
    })
  })
})
```

---

## Frontend Testing (React Testing Library + Vitest)

```tsx
// components/login-form.spec.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import { server } from '@test/mocks/server' // MSW
import { rest } from 'msw'

describe('LoginForm', () => {
  it('submits credentials and calls onSuccess', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    render(<LoginForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Secure123!')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={vi.fn()} />)

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.tab() // Trigger blur

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid email/i)
  })

  it('shows server error on failed login', async () => {
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) =>
        res(ctx.status(401), ctx.json({ error: { code: 'INVALID_CREDENTIALS' } }))
      )
    )
    const user = userEvent.setup()
    render(<LoginForm onSuccess={vi.fn()} />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await screen.findByText(/invalid credentials/i)
  })

  it('is accessible', async () => {
    const { container } = render(<LoginForm onSuccess={vi.fn()} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

---

## E2E Tests (Playwright)

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'
import { loginAs, createProduct } from './helpers'

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'customer@example.com')
  })

  test('completes purchase successfully', async ({ page }) => {
    await page.goto('/products')
    await page.click('[data-testid="product-card"]:first-child button')
    await page.click('[data-testid="cart-icon"]')
    await page.click('text=Checkout')

    await page.fill('[name="cardNumber"]', '4242424242424242')
    await page.fill('[name="expiry"]', '12/25')
    await page.fill('[name="cvc"]', '123')
    await page.click('text=Place Order')

    await expect(page.locator('h1')).toContainText('Order Confirmed')
    await expect(page).toHaveURL(/\/orders\/\w+/)
  })
})
```

---

## Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
      exclude: [
        'src/main.ts',
        'src/**/*.dto.ts',     // Validated by integration tests
        'src/**/*.module.ts',  // Framework boilerplate
        'src/**/*.spec.ts',
        'test/**',
      ],
    },
  },
})
```

---

## Mocking Strategy

```typescript
// ✅ Mock at boundaries, not implementation details
// Mock: external HTTP, DB, queues, email — things outside your control
// Don't mock: your own services, utilities, business logic

// MSW for HTTP mocking (works in both browser and Node)
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.get('https://api.stripe.com/v1/customers/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, email: 'test@example.com' })
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```