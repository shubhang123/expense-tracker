# Frontend: React / Next.js / TypeScript

## Next.js App Router Fundamentals

### Server vs Client Components
```tsx
// app/dashboard/page.tsx — Server Component (default)
// Runs on server: can use async/await, access DB directly, no bundle cost
export default async function DashboardPage() {
  const user = await getCurrentUser() // direct server call
  const stats = await db.query.stats.findMany({ where: eq(stats.userId, user.id) })
  
  return (
    <main>
      <h1>Dashboard</h1>
      <StatsGrid stats={stats} />          {/* Server Component */}
      <InteractiveChart initialData={stats} /> {/* Client Component — only what needs interactivity */}
    </main>
  )
}

// components/interactive-chart.tsx
'use client' // Only when you need: useState, useEffect, event handlers, browser APIs

import { useState } from 'react'
export function InteractiveChart({ initialData }: { initialData: Stats[] }) {
  const [filter, setFilter] = useState<string>('all')
  // ...
}
```

### Data Fetching Patterns
```tsx
// Server: fetch with caching
async function getProducts(category: string) {
  const res = await fetch(`/api/products?category=${category}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
    // next: { tags: ['products'] }, // On-demand revalidation
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json() as Promise<Product[]>
}

// Client: TanStack Query for interactive data
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function useProducts(category: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => api.products.list({ category }),
    staleTime: 60_000,
  })
}

function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.products.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
```

### Route Handlers (API Routes)
```typescript
// app/api/users/[id]/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/auth'
import { db } from '@/lib/db'

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await authenticate(req)
  if (!session) return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (session.userId !== params.id && session.role !== 'admin') {
    return Response.json({ error: { code: 'FORBIDDEN' } }, { status: 403 })
  }

  const body = await req.json()
  const parsed = UpdateUserSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, { status: 422 })
  }

  const user = await db.update(users).set(parsed.data).where(eq(users.id, params.id)).returning()
  return Response.json({ data: user[0] })
}
```

---

## TypeScript Patterns

### Strict Configuration
```json
// tsconfig.json — never compromise on these
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Utility Types & Patterns
```typescript
// Branded types for domain primitives (prevents UserId/OrderId mix-up)
type Brand<T, B> = T & { readonly __brand: B }
type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

const userId = '123' as UserId
const orderId = '123' as OrderId
// getUser(orderId) // TS Error — correct!

// Discriminated unions for state machines
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Exhaustive checking
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`)
}

function renderState(state: AsyncState<User>) {
  switch (state.status) {
    case 'idle': return <Idle />
    case 'loading': return <Spinner />
    case 'success': return <UserCard user={state.data} />
    case 'error': return <ErrorBanner error={state.error} />
    default: return assertNever(state)
  }
}
```

### Zod for Runtime Validation
```typescript
import { z } from 'zod'

// Define once, derive types
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'moderator']),
  createdAt: z.coerce.date(),
})

type User = z.infer<typeof UserSchema>

// Validate env vars at startup (fail fast)
const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
})

export const env = EnvSchema.parse(process.env) // throws if invalid
```

---

## Component Patterns

### Compound Components
```tsx
// Flexible, composable APIs
function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div role="tablist" className="tabs__list">{children}</div>
}

Tabs.Tab = function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// Usage
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="details">Details</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

### Server Actions (Next.js 14+)
```typescript
// app/actions/user.actions.ts
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { authenticate } from '@/lib/auth'

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500),
})

export async function updateProfile(formData: FormData) {
  const session = await authenticate()
  if (!session) throw new Error('Unauthorized')

  const parsed = UpdateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  })
  if (!parsed.success) return { error: parsed.error.flatten() }

  await db.update(users).set(parsed.data).where(eq(users.id, session.userId))
  revalidatePath('/profile')
  return { success: true }
}
```

---

## Performance

### Core Web Vitals Targets
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Always measure with Lighthouse CI in PR pipeline

### Optimization Checklist
```tsx
// Images — always use next/image
import Image from 'next/image'
<Image src={url} alt="Descriptive alt" width={800} height={600} priority={isAboveFold} />

// Fonts — always use next/font (eliminates CLS)
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })

// Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // only if truly browser-only
})

// Memoize expensive computations
const sortedItems = useMemo(
  () => items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  [items]
)

// Stable callbacks to prevent child re-renders
const handleClick = useCallback((id: string) => {
  dispatch({ type: 'SELECT_ITEM', id })
}, [dispatch])
```

---

## Accessibility

```tsx
// Always: semantic HTML first, ARIA second
<button onClick={handleClose} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Form fields always have labels
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && <p id="email-error" role="alert">{errors.email}</p>}

// Focus management in modals/dialogs
useEffect(() => {
  if (isOpen) {
    firstFocusableRef.current?.focus()
  }
}, [isOpen])

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') onClose()
  if (e.key === 'Tab') trapFocus(e, containerRef)
}
```

---

## State Management Decision Tree

```
Is this server data? → TanStack Query
Is this URL state? → useSearchParams / router
Is this form state? → React Hook Form
Is this component-local UI state? → useState
Is this shared across few components? → Context + useReducer
Is this complex global app state? → Zustand
```

```typescript
// Zustand store (simple, typed)
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  total: number
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  get total() { return get().items.reduce((sum, item) => sum + item.price * item.qty, 0) },
}))
```