"use client";

/**
 * Marketing Pixels — Meta (Facebook) + TikTok.
 *
 * ID pixel diambil dari environment variable, JADI BISA DIGANTI SENDIRI
 * tanpa ngedit kode. Cukup set di file `.env` (atau setting VPS):
 *
 *   NEXT_PUBLIC_FB_PIXEL_ID=1234567890
 *   NEXT_PUBLIC_TIKTOK_PIXEL_ID=ABCDEFGHIJK
 *
 * - Env kosong  → pixel TIDAK dipasang (komponen render null). Aman.
 * - Mau matiin salah satu → kosongin aja value-nya.
 * - Setelah ganti env, lakukan re-deploy / rebuild biar nilai baru kebaca.
 *
 * Event:
 *   - PageView : otomatis tiap halaman dibuka + tiap pindah halaman (SPA).
 *   - Lead     : lihat lib/pixels.ts → trackLead()     (tombol beli)
 *   - Purchase : lihat lib/pixels.ts → trackPurchase() (app/terima-kasih)
 */

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";

export default function MarketingPixels() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // PageView untuk navigasi SPA (client-side route change).
  // PageView pertama udah di-handle base snippet di bawah, jadi skip render awal.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (FB_PIXEL_ID) window.fbq?.("track", "PageView");
    if (TIKTOK_PIXEL_ID) window.ttq?.page();
  }, [pathname]);

  // Nggak ada pixel yang di-set → jangan render apa-apa.
  if (!FB_PIXEL_ID && !TIKTOK_PIXEL_ID) return null;

  return (
    <>
      {FB_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
