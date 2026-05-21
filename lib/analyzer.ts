import type { AnalyzeRequest, AnalyzeResponse } from "./types";
import { analyzeEvm } from "./ethereum/eth-analyzer";
import { analyzeSolana } from "./solana/solana-analyzer";
import { isEvmChain } from "./chains";

export async function analyzeAddress(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const scanMode = input.scanMode ?? (input.chain === "pumpfun" ? "meme" : "standard");
  const normalized = { ...input, scanMode };
  if (isEvmChain(normalized.chain)) return analyzeEvm(normalized);
  if (normalized.chain === "solana" || normalized.chain === "pumpfun") return analyzeSolana(normalized);
  throw new Error("Unsupported chain");
}
