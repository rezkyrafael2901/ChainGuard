import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainGuard AI | Ethereum & Solana Risk Analyzer",
  description: "AI-driven Ethereum smart contract and Solana token risk analysis dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
