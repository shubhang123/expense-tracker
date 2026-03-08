'use client';

import { useState, useEffect, useCallback } from 'react';

function getStoredValue<T>(key: string, initialValue: T | (() => T)): T {
  const fallback = initialValue instanceof Function ? initialValue() : initialValue;

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
  }

  return fallback;
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    // During SSR, always return the initial value
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
    return getStoredValue(key, initialValue);
  });

  // Sync to localStorage on change
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Hydrate from localStorage on mount (handles SSR mismatches)
  useEffect(() => {
    const stored = getStoredValue(key, initialValue);
    setValue(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue] as const;
}
