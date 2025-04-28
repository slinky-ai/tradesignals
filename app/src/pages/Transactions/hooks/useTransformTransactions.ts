
import { useMemo } from 'react';

// This is the original transaction type from transactionsData
interface RawTransaction {
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

// This is the transaction type expected by TransactionTable
export interface TransformedTransaction {
  id: string;
  agent_id: string;
  created_at: string;
  closed_at: string | null;
  duration: string | null;
  status: "open" | "closed" | "liquidated";
  action_type: "LONG" | "SHORT";
  chain: string;
  exchange: string | null;
  leverage: number;
  position_size: number;
  entry_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  market: string;
  pnl_percentage: number | null;
  pnl: number | null;
  deployed_agents: {
    name: string;
    id: string;
  } | null;
}

export const useTransformTransactions = (transactions: RawTransaction[]): TransformedTransaction[] => {
  return useMemo(() => {
    return transactions.map(tx => {
      // Generate a random closed date for completed transactions
      let closedAt = null;
      let duration = null;

      if (tx.status === 'completed' || tx.status === 'failed') {
        const createdDate = new Date(tx.created_at);
        const randomHours = Math.floor(Math.random() * 24) + 1;
        const closedDate = new Date(createdDate.getTime() + randomHours * 60 * 60 * 1000);
        closedAt = closedDate.toISOString();
        
        // Calculate duration
        const durationHours = Math.floor((closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
        const durationMinutes = Math.floor(((closedDate.getTime() - createdDate.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${durationHours}h ${durationMinutes}m`;
      }
      
      // Map existing transaction fields to the expected structure
      const transformedTx: TransformedTransaction = {
        id: tx.id,
        agent_id: tx.agent_id,
        created_at: tx.created_at,
        closed_at: closedAt,
        duration: duration,
        // Map statuses to the new perpetual trading specific statuses
        status: tx.status === 'completed' ? 'closed' : tx.status === 'pending' ? 'open' : 'liquidated',
        // Map 'swap' to 'LONG' and other actions to 'SHORT' for demo purposes
        action_type: tx.action_type === 'swap' ? 'LONG' : 'SHORT',
        chain: tx.chain,
        exchange: tx.exchange,
        // Add mock leverage, random between 1x and 20x
        leverage: Math.floor(Math.random() * 20) + 1,
        // Use source_amount_usd or amount as position size
        position_size: tx.source_amount_usd || tx.amount || 0,
        // Generate a fake entry price based on amount
        entry_price: tx.source_amount ? tx.source_amount_usd! / tx.source_amount : 100,
        // Add mock stop loss (10-20% below entry price)
        stop_loss: Math.random() < 0.8 ? (tx.source_amount ? (tx.source_amount_usd! / tx.source_amount) * (0.8 + Math.random() * 0.1) : 80) : null,
        // Add mock take profit (10-50% above entry price)
        take_profit: Math.random() < 0.7 ? (tx.source_amount ? (tx.source_amount_usd! / tx.source_amount) * (1.1 + Math.random() * 0.4) : 150) : null,
        // For market, use token_symbol / target_token or just the token_symbol
        market: tx.source_token && tx.target_token 
          ? `${tx.source_token.toUpperCase()}/${tx.target_token.toUpperCase()}` 
          : tx.token_symbol,
        // Calculate mock PnL based on status
        pnl: tx.status === 'completed' 
          ? (Math.random() > 0.5 ? 1 : -1) * (tx.source_amount_usd || tx.amount) * (Math.random() * 0.3)
          : tx.status === 'failed' ? -(tx.source_amount_usd || tx.amount) * (Math.random() * 0.8) : null,
        // Calculate PnL percentage
        pnl_percentage: tx.status === 'completed' 
          ? (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 35) 
          : tx.status === 'failed' ? -(Math.random() * 80) : null,
        deployed_agents: tx.deployed_agents
      };
      
      return transformedTx;
    });
  }, [transactions]);
};
