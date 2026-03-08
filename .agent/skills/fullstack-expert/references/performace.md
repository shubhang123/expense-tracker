# Performance Optimization

## Measure First, Always

```typescript
// Never optimize without data
// Tools: Lighthouse, WebPageTest, clinic.js, pgBadger, EXPLAIN ANALYZE

// Node.js profiling
import { createServer } from 'node:http'
import { Session } from 'node:inspector'

// PostgreSQL — always EXPLAIN ANALYZE before shipping complex queries
const plan = await db.execute(sql`
  EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
  SELECT u.*, COUNT(o.id) as order_count
  FROM users u
  LEFT JOIN orders o ON o.user_id = u.id
  WHERE u.created_at > NOW() - INTERVAL '30 days'
  GROUP BY u.id
`)
// Look for: Seq Scan on large tables, nested loop on big sets, high actual rows vs estimated rows
```

---

## Database Performance

### Index Strategy
```sql
-- Index what you filter and sort by
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC) WHERE deleted_at IS NULL;
-- ^ Partial index: WHERE clause reduces index size for common query pattern

-- Covering index: eliminates table lookup entirely
CREATE INDEX idx_users_email_name ON users(email) INCLUDE (name, role);
-- SELECT name, role FROM users WHERE email = $1 → index-only scan

-- Don't over-index: each index slows writes
-- Rule: if a column appears in WHERE or JOIN ON and table > 10k rows, index it
```

### Query Optimization
```typescript
// ❌ SELECT * — fetches all columns, wastes bandwidth/memory
const users = await db.select().from(usersTable)

// ✅ Select only what you need
const users = await db.select({ id: usersTable.id, email: usersTable.email })
  .from(usersTable)
  .where(eq(usersTable.role, 'admin'))
  .limit(100)

// ❌ N+1
for (const order of orders) {
  order.items = await getOrderItems(order.id) // Query per order!
}

// ✅ Batch with IN or JOIN
const orderIds = orders.map(o => o.id)
const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
const itemsByOrder = groupBy(items, 'orderId')
orders.forEach(o => o.items = itemsByOrder[o.id] ?? [])

// ❌ Count(*) on large tables is slow
const count = await db.select({ count: sql`COUNT(*)` }).from(bigTable)

// ✅ Use pg_stat_user_tables for estimates, or a counter cache
const stats = await db.execute(sql`SELECT reltuples::BIGINT FROM pg_class WHERE relname = 'orders'`)
```

---

## Caching Strategy

```typescript
// Cache-aside pattern (most flexible)
async function getUser(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`
  
  // 1. Check cache
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)
  
  // 2. Cache miss → fetch from DB
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!user[0]) return null
  
  // 3. Populate cache with TTL
  await redis.setex(cacheKey, 300, JSON.stringify(user[0])) // 5 min TTL
  return user[0]
}

// Invalidate on mutation
async function updateUser(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id))
  await redis.del(`user:${id}`) // Invalidate immediately
}

// Write-through: update cache on write (for hot data)
async function incrementPageViews(articleId: string) {
  const [newCount] = await db
    .update(articles)
    .set({ views: sql`views + 1` })
    .where(eq(articles.id, articleId))
    .returning({ views: articles.views })
  
  await redis.set(`article:${articleId}:views`, newCount.views, { ex: 60 })
  return newCount.views
}
```

---

## Frontend Performance

### Bundle Optimization
```typescript
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Analyze bundle
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: { enabled: true }
  })
}

// Tree-shake: named imports only
import { debounce } from 'lodash-es' // ✅
import _ from 'lodash'               // ❌ Imports entire lodash

// Code split aggressively
const AdminPanel = lazy(() => import('./AdminPanel'))   // Not loaded for regular users
const RichEditor = lazy(() => import('./RichEditor'))   // Heavy editor — load on demand
```

### React Performance
```tsx
// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'

function InfiniteList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            style={{ position: 'absolute', top: `${vItem.start}px`, width: '100%' }}
          >
            <ItemRow item={items[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  []
)

// Avoid layout thrash — batch DOM reads/writes
// ❌ Interleaving reads and writes
elements.forEach(el => {
  const height = el.offsetHeight // Read (forces reflow)
  el.style.height = `${height + 10}px` // Write
})

// ✅ Batch reads, then writes
const heights = elements.map(el => el.offsetHeight) // All reads
elements.forEach((el, i) => el.style.height = `${heights[i] + 10}px`) // All writes
```

---

## Node.js Performance

```typescript
// CPU-bound work → Worker threads (never block the event loop)
import { Worker, isMainThread, parentPort } from 'worker_threads'
import { cpus } from 'os'

if (isMainThread) {
  const pool = new WorkerPool('./image-processor.worker.js', cpus().length)
  export const processImage = (buffer: Buffer) => pool.run(buffer)
} else {
  parentPort!.on('message', async (buffer: Buffer) => {
    const result = await heavyImageProcessing(buffer)
    parentPort!.postMessage(result)
  })
}

// I/O-bound: always async, never blocking
// ❌
const data = fs.readFileSync('large-file.json') // Blocks event loop!

// ✅
const data = await fs.promises.readFile('large-file.json')

// Stream large files / responses
app.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv')
  const cursor = db.select().from(orders).cursor()
  for await (const batch of cursor) {
    res.write(batch.map(rowToCsv).join('\n'))
  }
  res.end()
})
```

---

## Performance Budgets

Set these in CI — fail the build if exceeded:

```json
{
  "budgets": [
    { "type": "bundle", "name": "main", "maximumWarning": "200kb", "maximumError": "300kb" },
    { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
    { "type": "anyComponentStyle", "maximumWarning": "2kb" }
  ]
}
```

```yaml
# Lighthouse CI
- name: Lighthouse
  uses: treosh/lighthouse-ci-action@v11
  with:
    budgetPath: .lighthouserc.json
    urls: https://staging.myapp.com
  # Fail if: LCP > 2.5s, TTI > 3.5s, CLS > 0.1
```