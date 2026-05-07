"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as seedProducts, type Product } from "./mockData";
import { adminUsers as seedUsers, type AdminUser } from "./adminData";

const PRODUCTS_KEY = "planetai.products.v1";
const USERS_KEY = "planetai.users.v1";

type Ctx = {
  products: Product[];
  users: AdminUser[];
  upsertProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  upsertUser: (u: AdminUser) => void;
  removeUser: (id: string) => void;
  resetSeed: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setProducts(load(PRODUCTS_KEY, seedProducts));
    setUsers(load(USERS_KEY, seedUsers));
    setHydrated(true);
  }, []);

  // Persist whenever state changes (after first hydration)
  useEffect(() => {
    if (hydrated) save(PRODUCTS_KEY, products);
  }, [products, hydrated]);

  useEffect(() => {
    if (hydrated) save(USERS_KEY, users);
  }, [users, hydrated]);

  const upsertProduct = useCallback((p: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx === -1) return [p, ...prev];
      const next = [...prev];
      next[idx] = p;
      return next;
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        permissions: u.permissions.filter((pid) => pid !== id),
      }))
    );
  }, []);

  const upsertUser = useCallback((u: AdminUser) => {
    setUsers((prev) => {
      const idx = prev.findIndex((x) => x.id === u.id);
      if (idx === -1) return [u, ...prev];
      const next = [...prev];
      next[idx] = u;
      return next;
    });
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const resetSeed = useCallback(() => {
    setProducts(seedProducts);
    setUsers(seedUsers);
    save(PRODUCTS_KEY, seedProducts);
    save(USERS_KEY, seedUsers);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      products,
      users,
      upsertProduct,
      removeProduct,
      upsertUser,
      removeUser,
      resetSeed,
    }),
    [products, users, upsertProduct, removeProduct, upsertUser, removeUser, resetSeed]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useDataStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}

export function useProduct(id: string) {
  const { products } = useDataStore();
  return products.find((p) => p.id === id);
}

export function useUser(id: string) {
  const { users } = useDataStore();
  return users.find((u) => u.id === id);
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
