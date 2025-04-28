
import { ReactNode } from "react";

export interface DeployedAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  deployedAt: string;
  framework: "ElizaOS" | "Solana Agent Kit";
  plugins: string[];
  operator: {
    name: string;
    address: string;
  };
  blockchains: string[];
  walletAddress: string;
  llmConfig: {
    provider: string;
    tokens_used: number;
    tokens_limit: number;
  };
  configuration: {
    tee?: boolean;
    chain?: string;
  };
  strategy?: string;
  trading_parameters: Record<string, any>;
}

export interface MyAgentsProps {
  walletAddress: string;
}

export interface StatsOverviewProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface AgentDetailsProps {
  agent: DeployedAgent;
  isOpen: boolean;
  onOpenChange: () => void;
}
