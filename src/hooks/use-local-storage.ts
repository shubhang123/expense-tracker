'use client';

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // Load from localStorage once
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error loading localStorage:", err);
    }
  }, [key]);

  // Save automatically whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error saving localStorage:", err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}