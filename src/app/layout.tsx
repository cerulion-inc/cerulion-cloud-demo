import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // TODO: Add proper metadata
  title: "Cerulion Cloud - The Future of Cloud Computing",
  description: "Experience lightning-fast performance, unmatched reliability, and enterprise-grade security with our next-generation cloud platform.",
  keywords: ["cloud computing", "hosting", "deployment", "enterprise", "performance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
