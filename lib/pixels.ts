/**
 * Helper untuk fire event Meta (Facebook) Pixel + TikTok Pixel dari sisi client.
 *
 * Aman dipanggil di mana saja: kalau pixel belum dipasang (env kosong) atau
 * script-nya belum ke-load, fungsi otomatis jadi no-op — nggak akan error.
 *
 * Event yang dipakai:
 *   - PageView  → otomatis di components/MarketingPixels.tsx
 *   - Lead      → trackLead()      (saat user klik tombol beli)
 *   - Purchase  → trackPurchase()  (di halaman /terima-kasih setelah bayar)
 */

declare global {
  interface Window {
    fbq?: (command: string, ...args: unknown[]) => void;
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
  }
}

type LeadParams = {
  /** Nama paket, cth "Paket VIP Member" */
  contentName?: string;
  /** Harga dalam angka, cth 199000 */
  value?: number;
  /** Mata uang, default "IDR" */
  currency?: string;
};

type PurchaseParams = {
  value?: number;
  currency?: string;
  contentName?: string;
};

/** Fire saat user menunjukkan minat beli (klik tombol checkout/beli). */
export function trackLead({
  contentName,
  value,
  currency = "IDR",
}: LeadParams = {}) {
  if (typeof window === "undefined") return;

  // Meta Pixel — event standar "Lead"
  window.fbq?.("track", "Lead", {
    content_name: contentName,
    value,
    currency,
  });

  // TikTok Pixel — "InitiateCheckout" paling dekat dengan klik tombol beli
  window.ttq?.track("InitiateCheckout", {
    content_name: contentName,
    value,
    currency,
  });
}

/** Fire saat pembayaran selesai (halaman terima kasih). */
export function trackPurchase({
  value,
  currency = "IDR",
  contentName,
}: PurchaseParams = {}) {
  if (typeof window === "undefined") return;

  window.fbq?.("track", "Purchase", {
    content_name: contentName,
    value,
    currency,
  });

  window.ttq?.track("CompletePayment", {
    content_name: contentName,
    value,
    currency,
  });
}
