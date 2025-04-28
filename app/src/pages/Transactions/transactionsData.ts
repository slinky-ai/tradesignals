
export interface Transaction {
  id: string;
  agent_id: string;
  amount: number;
  created_at: string;
  token_symbol: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  chain: string;
  exchange: string | null;
  action_type: string;
  source_token: string | null;
  source_amount: number | null;
  source_amount_usd: number | null;
  target_token: string | null;
  target_amount: number | null;
  target_amount_usd: number | null;
  deployed_agents: {
    name: string;
    id: string;
  } | null;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    agent_id: "agent1",
    amount: 100,
    created_at: "2024-03-20T10:00:00Z",
    token_symbol: "SOL",
    status: "completed",
    chain: "solana",
    exchange: "jupiter",
    action_type: "swap",
    source_token: "SOL",
    source_amount: 2.5,
    source_amount_usd: 250,
    target_token: "USDC",
    target_amount: 245,
    target_amount_usd: 245,
    deployed_agents: {
      name: "Trading Bot Alpha",
      id: "agent1",
    },
  },
  {
    id: "2",
    agent_id: "agent2",
    amount: 500,
    created_at: "2024-03-20T09:30:00Z",
    token_symbol: "USDC",
    status: "pending",
    chain: "base",
    exchange: "uniswap",
    action_type: "stake",
    source_token: "USDC",
    source_amount: 500,
    source_amount_usd: 500,
    target_token: "cbETH",
    target_amount: 0.25,
    target_amount_usd: 495,
    deployed_agents: {
      name: "Yield Optimizer",
      id: "agent2",
    },
  },
  {
    id: "3",
    agent_id: "agent1",
    amount: 1000,
    created_at: "2024-03-20T09:00:00Z",
    token_symbol: "BONK",
    status: "failed",
    chain: "solana",
    exchange: "raydium",
    action_type: "trade",
    source_token: "BONK",
    source_amount: 1000000,
    source_amount_usd: 1000,
    target_token: "SOL",
    target_amount: null,
    target_amount_usd: null,
    deployed_agents: {
      name: "Trading Bot Alpha",
      id: "agent1",
    },
  },
];

export const allChains = Array.from(
  new Set(mockTransactions.map((tx) => tx.chain).filter(Boolean))
);
export const allStatuses = Array.from(
  new Set(mockTransactions.map((tx) => tx.status).filter(Boolean))
);
export const allExchanges = Array.from(
  new Set(mockTransactions.map((tx) => tx.exchange).filter(Boolean) as string[])
);
export const allTradingPairs = Array.from(
  new Set(
    mockTransactions
      .map((tx) =>
        tx.source_token && tx.target_token
          ? `${tx.source_token.toUpperCase()} / ${tx.target_token.toUpperCase()}`
          : null
      )
      .filter(Boolean) as string[]
  )
);

