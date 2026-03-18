'use client';

import { useState, useEffect } from "react";

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Check if localStorage exists and is a function
    if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
      return false;
    }
    
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage once on mount
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
          setValue(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading localStorage:", err);
      }
    }
    setIsInitialized(true);
  }, [key]);

  // Save to localStorage whenever value changes, but only after initialization
  useEffect(() => {
    if (isInitialized && isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error("Error saving localStorage:", err);
      }
    }
  }, [key, value, isInitialized]);

  return [value, setValue] as const;
}
