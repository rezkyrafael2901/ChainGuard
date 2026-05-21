import type { Chain } from "./types";

export const chainInfo: Record<Chain, { name: string; family: "evm" | "solana"; explorer: string; specialty: string }> = {
  ethereum: { name: "Ethereum", family: "evm", explorer: "Etherscan", specialty: "ERC-20, DeFi, proxy, ownership and governance risk" },
  bsc: { name: "BNB Smart Chain", family: "evm", explorer: "BscScan", specialty: "meme tokens, tax logic, honeypot, liquidity and owner control risk" },
  polygon: { name: "Polygon", family: "evm", explorer: "PolygonScan", specialty: "bridged assets, proxy contracts, DeFi and gamefi token risk" },
  base: { name: "Base", family: "evm", explorer: "BaseScan", specialty: "new token launches, proxy contracts and L2 liquidity risk" },
  optimism: { name: "Optimism", family: "evm", explorer: "Optimistic Etherscan", specialty: "L2 governance, proxy, bridge and token-permission risk" },
  arbitrum: { name: "Arbitrum", family: "evm", explorer: "Arbiscan", specialty: "DeFi, bridge, proxy and rollup ecosystem token risk" },
  solana: { name: "Solana", family: "solana", explorer: "Solscan", specialty: "mint authority, freeze authority, liquidity and holder concentration" },
  pumpfun: { name: "Pump.fun / Solana Meme", family: "solana", explorer: "Solscan", specialty: "meme coin launch, bonding curve, authority, holder and liquidity migration risk" },
};

export function getChainName(chain: Chain) {
  return chainInfo[chain]?.name ?? chain;
}

export function isEvmChain(chain: Chain) {
  return chainInfo[chain]?.family === "evm";
}
