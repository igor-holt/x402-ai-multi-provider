import { arbitrum } from "thirdweb/chains";
import { getDefaultToken } from "thirdweb/react";
import { modelID } from "./models";

// Payment configuration
export const paymentChain = arbitrum;
export const paymentToken = getDefaultToken(paymentChain, "USDC")!;

// Default maximum tokens per call (safety limit)
export const MAX_INFERENCE_TOKENS_PER_CALL = 10000; // 10k tokens max

// Base pricing in wei (1 USDC = 1e6 wei)
// These are SUGGESTED prices - adjust based on your costs and desired margin

// Price per token in wei for each provider
export const PRICING_PER_TOKEN_WEI: Record<string, bigint> = {
  // OpenAI pricing (adjust based on actual OpenAI costs + margin)
  openai: BigInt(1), // $0.000001 per token
  
  // Anthropic pricing
  anthropic: BigInt(2), // $0.000002 per token (Claude is more expensive)
  
  // Groq pricing (very fast, lower cost)
  groq: BigInt(0.5), // $0.0000005 per token
  
  // DeepInfra pricing
  deepinfra: BigInt(0.8), // $0.0000008 per token
};

// Model-specific pricing overrides (optional)
// Use this if certain models have different costs
export const MODEL_PRICING_OVERRIDES: Partial<Record<modelID, bigint>> = {
  // Example: Premium models can have higher prices
  "gpt-5.1": BigInt(2), // $0.000002 per token
  "gpt-5": BigInt(2),
  "claude-3-opus": BigInt(3), // $0.000003 per token
  "claude-3-7-sonnet-20250219": BigInt(2.5),
  "groq-llama-3.1-405b": BigInt(1), // Premium Groq model
  // Add more overrides as needed
};

// Get price for a specific model
export function getPricePerTokenWei(modelId: modelID): bigint {
  // Check for model-specific override first
  if (MODEL_PRICING_OVERRIDES[modelId] !== undefined) {
    return MODEL_PRICING_OVERRIDES[modelId]!;
  }
  
  // Get provider from model ID
  const provider = getProviderFromModelId(modelId);
  
  // Return provider-specific price or default
  return PRICING_PER_TOKEN_WEI[provider] || BigInt(1);
}

// Helper to extract provider from model ID
export function getProviderFromModelId(modelId: modelID): string {
  if (modelId.startsWith("gpt-") || modelId.startsWith("o1-")) return "openai";
  if (modelId.startsWith("claude-") || modelId.startsWith("sonnet-") || modelId.startsWith("haiku-")) return "anthropic";
  if (modelId.startsWith("groq-")) return "groq";
  if (modelId.startsWith("deepinfra-")) return "deepinfra";
  return "default";
}

// Calculate total price for a given number of tokens and model
export function calculateTotalPriceWei(modelId: modelID, tokenCount: number): bigint {
  const pricePerToken = getPricePerTokenWei(modelId);
  return pricePerToken * BigInt(tokenCount);
}

// Format price for display (converts wei to USDC)
export function formatPriceUsdc(weiAmount: bigint): string {
  // 1 USDC = 1,000,000 wei (6 decimals)
  const usdcAmount = Number(weiAmount) / 1_000_000;
  return usdcAmount.toFixed(6); // Show 6 decimal places
}

// Human-readable pricing info for UI
export const PRICING_DISPLAY_INFO = {
  openai: {
    name: "OpenAI",
    basePrice: "$0.000001",
    description: "Standard pricing for OpenAI models"
  },
  anthropic: {
    name: "Anthropic",
    basePrice: "$0.000002",
    description: "Premium pricing for Claude models"
  },
  groq: {
    name: "Groq",
    basePrice: "$0.0000005",
    description: "Fast & cost-effective inference"
  },
  deepinfra: {
    name: "DeepInfra",
    basePrice: "$0.0000008",
    description: "Open-source models at low cost"
  }
};
