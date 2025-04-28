
import React, { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as LucideCalendar } from "lucide-react";

interface TransactionFiltersProps {
  allTradingPairs: string[];
  allExchanges: string[];
  allChains: string[];
  allStatuses: string[];
  selectedPair?: string;
  selectedExchange?: string;
  selectedChain?: string;
  selectedStatus?: string;
  fromDate?: Date;
  toDate?: Date;
  onPairChange: (value?: string) => void;
  onExchangeChange: (value?: string) => void;
  onChainChange: (value?: string) => void;
  onStatusChange: (value?: string) => void;
  onFromDateChange: (date?: Date) => void;
  onToDateChange: (date?: Date) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  allTradingPairs,
  allExchanges,
  allChains,
  allStatuses,
  selectedPair,
  selectedExchange,
  selectedChain,
  selectedStatus,
  fromDate,
  toDate,
  onPairChange,
  onExchangeChange,
  onChainChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
}) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Select
        onValueChange={(value) => onPairChange(value || undefined)}
        value={selectedPair}
      >
        <SelectTrigger className="w-full bg-[#2A2930] text-white">
          <SelectValue placeholder="Filter by Trading Pair" />
        </SelectTrigger>
        <SelectContent className="bg-[#333446] text-white border border-white/20 z-50">
          {allTradingPairs.map((pair) => (
            <SelectItem key={pair} value={pair} className="text-white">
              {pair}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onExchangeChange(value || undefined)}
        value={selectedExchange}
      >
        <SelectTrigger className="w-full bg-[#2A2930] text-white">
          <SelectValue placeholder="Filter by Exchange" />
        </SelectTrigger>
        <SelectContent className="bg-[#333446] text-white border border-white/20 z-50">
          {allExchanges.map((exchange) => (
            <SelectItem key={exchange} value={exchange} className="text-white">
              {exchange}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onChainChange(value || undefined)}
        value={selectedChain}
      >
        <SelectTrigger className="w-full bg-[#2A2930] text-white">
          <SelectValue placeholder="Filter by Chain" />
        </SelectTrigger>
        <SelectContent className="bg-[#333446] text-white border border-white/20 z-50">
          {allChains.map((chain) => (
            <SelectItem key={chain} value={chain} className="text-white">
              {chain}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onStatusChange(value || undefined)}
        value={selectedStatus}
      >
        <SelectTrigger className="w-full bg-[#2A2930] text-white">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#333446] text-white border border-white/20 z-50">
          {allStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-white">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={fromOpen} onOpenChange={setFromOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !fromDate && "text-muted-foreground",
              "bg-[#2A2930] text-white border-white/20"
            )}
          >
            <LucideCalendar className="mr-2 h-4 w-4" />
            {fromDate ? format(fromDate, "PPP") : "From Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#333446] text-white border border-white/20" align="start">
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={(date) => {
              onFromDateChange(date ?? undefined);
              setFromOpen(false);
            }}
            disabled={(date) => (toDate ? date > toDate : false)}
            initialFocus
            className="p-3 pointer-events-auto bg-[#333446] text-white"
          />
        </PopoverContent>
      </Popover>

      <Popover open={toOpen} onOpenChange={setToOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !toDate && "text-muted-foreground",
              "bg-[#2A2930] text-white border-white/20"
            )}
          >
            <LucideCalendar className="mr-2 h-4 w-4" />
            {toDate ? format(toDate, "PPP") : "To Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#333446] text-white border border-white/20" align="start">
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={(date) => {
              onToDateChange(date ?? undefined);
              setToOpen(false);
            }}
            disabled={(date) => (fromDate ? date < fromDate : false)}
            initialFocus
            className="p-3 pointer-events-auto bg-[#333446] text-white"
          />
        </PopoverContent>
      </Popover>
    </section>
  );
};
