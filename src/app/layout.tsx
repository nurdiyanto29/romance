// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Romance PDKT",
  description: "Elegant & sweet toolkit for thoughtful PDKT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
