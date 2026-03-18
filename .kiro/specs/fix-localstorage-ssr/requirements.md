# Fix localStorage SSR Issue

## Problem Statement

The application crashes with `TypeError: localStorage.getItem is not a function` during server-side rendering. This occurs because `localStorage` is a browser-only API that doesn't exist on the server, but the code attempts to access it during SSR.

## Root Cause

The `useLocalStorage` hook in `src/hooks/use-local-storage.ts` is used in client components, but Next.js still attempts to render these components on the server first. During SSR, `window.localStorage` is not available, causing the error.

## User Stories

- As a user, I want the application to load without errors during server-side rendering
- As a user, I want my localStorage data to persist across page reloads
- As a developer, I want a robust localStorage hook that safely handles SSR

## Requirements

### 1. SSR-Safe localStorage Access
- **1.1** The `useLocalStorage` hook must not throw errors when rendered on the server
- **1.2** The hook should detect if `localStorage` is available before accessing it
- **1.3** The hook should gracefully handle the initial SSR render and subsequent client hydration

### 2. Data Persistence
- **2.1** Data stored in localStorage should persist across page reloads
- **2.2** The hook should read from localStorage on the client side after hydration
- **2.3** The hook should write to localStorage whenever the value changes

### 3. Type Safety
- **3.1** The hook must maintain full TypeScript type safety
- **3.2** Generic type parameter should be preserved through storage operations

### 4. Error Handling
- **4.1** The hook should catch and log errors when reading from or writing to localStorage
- **4.2** Errors should not crash the application

## Acceptance Criteria

- [ ] Application loads without localStorage errors during SSR
- [ ] Transaction and category data persists in localStorage after page reloads
- [ ] The SpendingDashboard component displays correctly on initial load
- [ ] The RecentTransactions component displays correctly on initial load
- [ ] No console errors related to localStorage during development