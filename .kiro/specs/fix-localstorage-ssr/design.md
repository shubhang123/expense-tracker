# Design: Fix localStorage SSR Issue

## Solution Overview

The fix involves modifying the `useLocalStorage` hook to safely handle server-side rendering by checking for `localStorage` availability before accessing it.

## Implementation Details

### Hook Changes

The `useLocalStorage` hook in `src/hooks/use-local-storage.ts` will be updated to:

1. Add a client-side check before accessing `localStorage`
2. Use a state variable to track if we're on the client
3. Only read from localStorage after the component mounts on the client

### Code Changes

```typescript
'use client';

import { useState, useEffect } from 'react';

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client and localStorage is available
  useEffect(() => {
    setIsClient(true);
    if (isLocalStorageAvailable()) {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
          setValue(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Error loading localStorage:', err);
      }
    }
  }, [key]);

  // Save automatically whenever value changes (only on client)
  useEffect(() => {
    if (isClient && isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('Error saving localStorage:', err);
      }
    }
  }, [key, value, isClient]);

  return [value, setValue] as const;
}
```

## Files to Modify

- `src/hooks/use-local-storage.ts` - Update the hook implementation

## Testing Strategy

### Unit Tests
- Test that the hook doesn't throw during SSR
- Test that data is correctly read from localStorage on the client
- Test that data is correctly written to localStorage
- Test that error handling works correctly

### Integration Tests
- Test that the home page loads without errors
- Test that SpendingDashboard displays correctly
- Test that RecentTransactions displays correctly

## Verification Steps

1. Run `npm run dev` and verify no localStorage errors
2. Navigate to the home page and verify it loads correctly
3. Check browser console for any localStorage-related errors
4. Reload the page and verify data persists