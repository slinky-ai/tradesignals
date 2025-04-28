
import { ReactNode } from "react";

export interface Agent {
  id: number;
  appId: string;
  name: string;
  description: string;
  icon: ReactNode;
  features: string[];
  platforms: {
    name: string;
    logo: string;
  }[];
  type: AgentType;
  blockchains?: string[];
  walletAddress?: string;
  creator: string;
  status?: "active" | "inactive" | "pending";
}

export type AgentType = 
  | 'CEX_SPOT'
  | 'CEX_LEVERAGE'
  | 'DEX_SPOT'
  | 'ARBITRAGE'
  | 'DEX_LEVERAGE'
  | 'ANALYSIS'
  | 'SOCIAL';

export interface DeploymentConfig {
  chain?: string;
  environment: string;
  dex?: string[] | string;
  operators: string[];
  llmChoice: "own" | "slinky";
  llmProvider?: "openai" | "groq" | "anthropic";
  llmApiKey?: string;
  binanceApiKey?: string;
  binanceApiSecret?: string;
  socialPlatforms?: ('TWITTER' | 'FARCASTER' | 'LENS' | 'TELEGRAM' | 'DISCORD')[];
}

export interface AgentConfiguration {
  id: string;
  agent_type: AgentType;
  name: string;
  description: string | null;
  required_fields: Record<string, string>;
  chain_options: string[] | null;
  dex_options: Record<string, string[]> | null;
}
