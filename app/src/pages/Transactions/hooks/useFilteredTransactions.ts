
import { useMemo } from "react";

interface Transaction {
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

export const useFilteredTransactions = (
  transactions: Transaction[],
  selectedPair?: string,
  selectedExchange?: string,
  selectedChain?: string,
  selectedStatus?: string,
  fromDate?: Date,
  toDate?: Date
) => {
  return useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedPair) {
        const pair = `${tx.source_token?.toUpperCase()} / ${tx.target_token?.toUpperCase()}`;
        if (pair !== selectedPair) return false;
      }

      if (selectedExchange && tx.exchange !== selectedExchange) return false;

      if (selectedChain && tx.chain !== selectedChain) return false;

      if (selectedStatus && tx.status !== selectedStatus) return false;

      const createdDate = new Date(tx.created_at);
      if (fromDate && createdDate < fromDate) return false;
      if (toDate && createdDate > toDate) return false;

      return true;
    });
  }, [transactions, selectedPair, selectedExchange, selectedChain, selectedStatus, fromDate, toDate]);
};

