import { Listener } from "../types/finance";

const changeEventName = "trip-finance-local-change";

export const readLocal = <T>(key: string): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? (JSON.parse(stored) as T[]) : [];
};

export const writeLocal = <T>(key: string, value: T[]) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(changeEventName));
};

export const watchLocal = <T>(key: string, listener: Listener<T>) => {
  const emit = () => listener(readLocal<T>(key));
  emit();
  window.addEventListener(changeEventName, emit);
  return () => window.removeEventListener(changeEventName, emit);
};
