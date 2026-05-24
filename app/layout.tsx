import type { Metadata } from "next";
import "./globals.css";
import { DataStoreProvider } from "@/lib/dataStore";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "PlanetSoft — Learning Center",
  description:
    "Member area eksklusif PlanetSoft. Belajar AI dengan kurikulum yang terstruktur, modern, dan praktis.",
  icons: {
    icon: "/brand/planetsoft-icon.png",
    apple: "/brand/planetsoft-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-ink antialiased">
        <AuthProvider>
          <DataStoreProvider>{children}</DataStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
