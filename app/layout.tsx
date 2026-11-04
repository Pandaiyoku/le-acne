import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Le Acne — Debt Ledger", description: "A private debt ledger." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
