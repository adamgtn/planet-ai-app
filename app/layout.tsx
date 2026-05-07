import type { Metadata } from "next";
import "./globals.css";
import { DataStoreProvider } from "@/lib/dataStore";

export const metadata: Metadata = {
  title: "Planet AI — Learning Center",
  description:
    "Member area eksklusif Planet AI. Belajar AI dengan kurikulum yang terstruktur, modern, dan praktis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-ink antialiased">
        <DataStoreProvider>{children}</DataStoreProvider>
      </body>
    </html>
  );
}
