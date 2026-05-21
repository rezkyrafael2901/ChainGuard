import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainGuard AI | Multi-Chain Smart Contract & Meme Token Risk Analyzer",
  description: "AI-driven Ethereum, BSC, Polygon, Base, Optimism, Arbitrum, Solana, and Pump.fun-style token risk analysis dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
