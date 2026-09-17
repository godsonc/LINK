import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LinkProvider } from "@/lib/link-context";
import { AppShell } from "@/components/AppShell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LINK — Lincolnshire Inclusion & Navigation Network",
  description:
    "From need to opportunity. Describe your situation and receive a local support pathway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <LinkProvider>
          <AppShell>{children}</AppShell>
        </LinkProvider>
      </body>
    </html>
  );
}
