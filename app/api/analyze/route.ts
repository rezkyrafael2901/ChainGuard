import { NextResponse } from "next/server";
import { analyzeAddress } from "@/lib/analyzer";
import type { AnalyzeRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    if (!body.chain || !body.address) {
      return NextResponse.json({ error: "chain and address are required" }, { status: 400 });
    }
    const result = await analyzeAddress(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected analysis error" },
      { status: 500 },
    );
  }
}
