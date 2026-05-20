import type { AnalyzeRequest, AnalyzeResponse } from "./types";
import { analyzeEthereum } from "./ethereum/eth-analyzer";
import { analyzeSolana } from "./solana/solana-analyzer";

export async function analyzeAddress(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  if (input.chain === "ethereum") return analyzeEthereum(input);
  if (input.chain === "solana") return analyzeSolana(input);
  throw new Error("Unsupported chain");
}
