
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  mockTransactions,
  allChains,
  allStatuses,
  allExchanges,
  allTradingPairs,
} from "./Transactions/transactionsData";
import { TransactionFilters } from "./Transactions/components/TransactionFilters";
import { TransactionTable } from "./Transactions/components/TransactionTable";
import { useFilteredTransactions } from "./Transactions/hooks/useFilteredTransactions";
import { useTransformTransactions } from "./Transactions/hooks/useTransformTransactions";

const Transactions = () => {
  const [selectedPair, setSelectedPair] = useState<string | undefined>(undefined);
  const [selectedExchange, setSelectedExchange] = useState<string | undefined>(undefined);
  const [selectedChain, setSelectedChain] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const filteredTransactions = useFilteredTransactions(
    mockTransactions,
    selectedPair,
    selectedExchange,
    selectedChain,
    selectedStatus,
    fromDate,
    toDate
  );

  // Transform the filtered transactions to match the expected structure for perpetual trading
  const transformedTransactions = useTransformTransactions(filteredTransactions);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="w-full p-4 sm:p-6 bg-[#151A29]/80 border border-white/10 rounded-lg shadow-lg text-white">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1">Perpetual Trades</h1>
            <p className="text-xs sm:text-sm text-gray-400">Global perpetual trade history across all agents</p>
          </div>
        </header>

        <Card className="bg-black/40 border border-white/10 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4">
            <TransactionFilters
              allTradingPairs={allTradingPairs}
              allExchanges={allExchanges}
              allChains={allChains}
              allStatuses={allStatuses}
              selectedPair={selectedPair}
              selectedExchange={selectedExchange}
              selectedChain={selectedChain}
              selectedStatus={selectedStatus}
              fromDate={fromDate}
              toDate={toDate}
              onPairChange={setSelectedPair}
              onExchangeChange={setSelectedExchange}
              onChainChange={setSelectedChain}
              onStatusChange={setSelectedStatus}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </div>
        </Card>

        <Card className="bg-black/40 border border-white/10 overflow-hidden">
          <div className="p-3 sm:p-4">
            <div className="w-full overflow-x-auto">
              <TransactionTable transactions={transformedTransactions} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;
