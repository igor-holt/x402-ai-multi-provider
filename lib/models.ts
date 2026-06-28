import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { deepinfra } from "@ai-sdk/deepinfra";
import { customProvider } from "ai";

// custom provider with all supported AI models
export const myProvider = customProvider({
  languageModels: {
    // OpenAI Models
    "gpt-5.1": openai("gpt-5.1"),
    "gpt-5": openai("gpt-5"),
    "gpt-4o": openai("gpt-4o"),
    "gpt-4o-mini": openai("gpt-4o-mini"),
    "gpt-4-turbo": openai("gpt-4-turbo"),
    "gpt-4": openai("gpt-4"),
    "gpt-3.5-turbo": openai("gpt-3.5-turbo"),
    
    // Anthropic Models
    "sonnet-3.7": anthropic("claude-3-7-sonnet-20250219"),
    "haiku-3.7": anthropic("claude-3-7-haiku-20250307"),
    "claude-3-5-sonnet": anthropic("claude-3-5-sonnet-20250620"),
    "claude-3-opus": anthropic("claude-3-opus-20240229"),
    "claude-3-sonnet": anthropic("claude-3-sonnet-20240229"),
    "claude-3-haiku": anthropic("claude-3-haiku-20240307"),
    "claude-2.1": anthropic("claude-2:1"),
    
    // Groq Models
    "groq-llama-3.1-405b": groq("llama-3.1-405b-reasoning"),
    "groq-llama-3.1-70b": groq("llama-3.1-70b-versatile"),
    "groq-llama-3-8b": groq("llama-3-8b-instant"),
    "groq-llama-3-70b": groq("llama-3-70b-versatile"),
    "groq-mixtral-8x7b": groq("mixtral-8x7b-32768"),
    
    // DeepInfra Models
    "deepinfra-llama-3.1-405b": deepinfra("meta-llama/Llama-3.1-405B"),
    "deepinfra-llama-3.1-70b": deepinfra("meta-llama/Llama-3.1-70B"),
    "deepinfra-mistral-large": deepinfra("mistralai/Mistral-Large"),
    "deepinfra-mixtral-8x7b": deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
  },
});

export type modelID = Parameters<(typeof myProvider)["languageModel"]>["0"];

// Model display names organized by provider
export const models: Record<modelID, string> = {
  // OpenAI
  "gpt-5.1": "GPT-5.1 (OpenAI)",
  "gpt-5": "GPT-5 (OpenAI)",
  "gpt-4o": "GPT-4o (OpenAI)",
  "gpt-4o-mini": "GPT-4o Mini (OpenAI)",
  "gpt-4-turbo": "GPT-4 Turbo (OpenAI)",
  "gpt-4": "GPT-4 (OpenAI)",
  "gpt-3.5-turbo": "GPT-3.5 Turbo (OpenAI)",
  
  // Anthropic
  "sonnet-3.7": "Claude 3.7 Sonnet (Anthropic)",
  "haiku-3.7": "Claude 3.7 Haiku (Anthropic)",
  "claude-3-5-sonnet": "Claude 3.5 Sonnet (Anthropic)",
  "claude-3-opus": "Claude 3 Opus (Anthropic)",
  "claude-3-sonnet": "Claude 3 Sonnet (Anthropic)",
  "claude-3-haiku": "Claude 3 Haiku (Anthropic)",
  "claude-2.1": "Claude 2.1 (Anthropic)",
  
  // Groq
  "groq-llama-3.1-405b": "Llama 3.1 405B (Groq)",
  "groq-llama-3.1-70b": "Llama 3.1 70B (Groq)",
  "groq-llama-3-8b": "Llama 3 8B (Groq)",
  "groq-llama-3-70b": "Llama 3 70B (Groq)",
  "groq-mixtral-8x7b": "Mixtral 8x7B (Groq)",
  
  // DeepInfra
  "deepinfra-llama-3.1-405b": "Llama 3.1 405B (DeepInfra)",
  "deepinfra-llama-3.1-70b": "Llama 3.1 70B (DeepInfra)",
  "deepinfra-mistral-large": "Mistral Large (DeepInfra)",
  "deepinfra-mixtral-8x7b": "Mixtral 8x7B (DeepInfra)",
};

// Group models by provider for organized UI display
export const modelsByProvider: Record<string, Array<{id: modelID; name: string}>> = {
  "OpenAI": [
    { id: "gpt-5.1", name: "GPT-5.1" },
    { id: "gpt-5", name: "GPT-5" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  ],
  "Anthropic": [
    { id: "sonnet-3.7", name: "Claude 3.7 Sonnet" },
    { id: "haiku-3.7", name: "Claude 3.7 Haiku" },
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "claude-2.1", name: "Claude 2.1" },
  ],
  "Groq": [
    { id: "groq-llama-3.1-405b", name: "Llama 3.1 405B" },
    { id: "groq-llama-3.1-70b", name: "Llama 3.1 70B" },
    { id: "groq-llama-3-8b", name: "Llama 3 8B" },
    { id: "groq-llama-3-70b", name: "Llama 3 70B" },
    { id: "groq-mixtral-8x7b", name: "Mixtral 8x7B" },
  ],
  "DeepInfra": [
    { id: "deepinfra-llama-3.1-405b", name: "Llama 3.1 405B" },
    { id: "deepinfra-llama-3.1-70b", name: "Llama 3.1 70B" },
    { id: "deepinfra-mistral-large", name: "Mistral Large" },
    { id: "deepinfra-mixtral-8x7b", name: "Mixtral 8x7B" },
  ],
};

// Default model selection
export const defaultModelId: modelID = "gpt-5.1";
