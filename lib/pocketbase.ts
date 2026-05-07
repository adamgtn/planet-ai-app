"use client";

import PocketBase from "pocketbase";

/** URL PocketBase — bisa di-override via env. Default: db.planet-ai.tech. */
export const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "https://db.planet-ai.tech";

let _pb: PocketBase | null = null;

/**
 * Singleton client PocketBase — share auth state lintas component.
 * Dibuat lazy supaya aman dipanggil di SSR (akan return instance dummy
 * tanpa storage). Auto-rehydrate dari localStorage saat di browser.
 */
export function getPB(): PocketBase {
  if (typeof window === "undefined") {
    // Server-side: tidak share state, instance baru per call
    return new PocketBase(PB_URL);
  }
  if (!_pb) {
    _pb = new PocketBase(PB_URL);
  }
  return _pb;
}

/**
 * Tipe user yang dikembalikan PocketBase auth, dengan field custom kita.
 */
export type PBUser = {
  id: string;
  email: string;
  emailVisibility?: boolean;
  verified?: boolean;
  name: string;
  role: "super_admin" | "admin" | "member";
  status: "active" | "suspended" | "expired";
  phone?: string;
  avatar?: string;
  last_login_at?: string;
  created: string;
  updated: string;
};
