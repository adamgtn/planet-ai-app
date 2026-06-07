import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";
import { DataStoreProvider } from "@/lib/dataStore";
import { AuthProvider } from "@/lib/auth";
import MarketingPixels from "@/components/MarketingPixels";

// Font display untuk headline hero LP — dipakai via class `font-display`.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://planetsoft.id"),
  title: "PlanetSoft — Learning Center",
  description:
    "Member area eksklusif PlanetSoft. Belajar AI dengan kurikulum yang terstruktur, modern, dan praktis.",
  // Next.js auto-generate favicon dari app/icon.png + app/apple-icon.png
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={anton.variable}>
      <body className="min-h-screen bg-white text-ink antialiased">
        <MarketingPixels />
        <AuthProvider>
          <DataStoreProvider>{children}</DataStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
