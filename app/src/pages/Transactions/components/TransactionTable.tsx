import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  CircleCheck,
  Clock,
  CircleX,
  CirclePause,
  MessageSquare,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GroupedCell } from "./table/GroupedCell";

interface Transaction {
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

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "closed":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case "open":
        return <CirclePause className="h-4 w-4 text-yellow-500" />;
      case "liquidated":
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatNumber = (num: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }).format(num);
  };

  const formatUSD = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: amount !== 0 ? "always" : "never",
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return "-";
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === null) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null) return sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === "asc" 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleRowClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-3">
          {sortedTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-black/40 border border-white/10 rounded-lg shadow-lg hover:bg-black/50 
                      active:scale-[0.99] transition-all duration-200"
              onClick={() => handleRowClick(tx)}
            >
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-sm">
                    {tx.deployed_agents?.name || "Unknown Agent"}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium capitalize",
                      tx.action_type === "LONG" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {tx.action_type === "LONG" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {tx.action_type} {tx.leverage}x
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tx.market}</span>
                    <span className="text-sm text-gray-400">${formatNumber(tx.position_size)}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs capitalize",
                      tx.status === "closed" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                      tx.status === "liquidated" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                    )}
                  >
                    {getStatusIcon(tx.status)}
                    <span className="ml-1">{tx.status}</span>
                  </Badge>
                </div>
              </div>

              <div className="p-3 grid grid-cols-3 gap-3 border-b border-white/5">
                <div>
                  <span className="text-xs text-gray-400 block">Entry</span>
                  <span className="text-sm font-medium">${formatNumber(tx.entry_price)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Stop Loss</span>
                  <span className="text-sm font-medium">
                    {tx.stop_loss ? `$${formatNumber(tx.stop_loss)}` : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Take Profit</span>
                  <span className="text-sm font-medium">
                    {tx.take_profit ? `$${formatNumber(tx.take_profit)}` : "-"}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="space-y-0.5">
                    <span className={cn(
                      "block text-sm font-medium",
                      tx.pnl && tx.pnl > 0 ? "text-green-500" : 
                      tx.pnl && tx.pnl < 0 ? "text-red-500" : ""
                    )}>
                      {formatUSD(tx.pnl)}
                    </span>
                    <span className={cn(
                      "block text-xs",
                      tx.pnl_percentage && tx.pnl_percentage > 0 ? "text-green-500" : 
                      tx.pnl_percentage && tx.pnl_percentage < 0 ? "text-red-500" : ""
                    )}>
                      {formatPercentage(tx.pnl_percentage)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="text-sm">{tx.duration || "-"}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-white/5">
                      {tx.exchange || "-"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-white/5">
                      {tx.chain}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/agent/${tx.deployed_agents?.id}/chat`);
                    }}
                    className="h-6 w-6 p-0 text-[#FF8133] hover:text-[#FF8133] hover:bg-[#FF8133]/10"
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <TransactionDetailDialog 
          transaction={selectedTransaction} 
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          navigate={navigate}
        />
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Info</TableHead>
            <TableHead>Market Info</TableHead>
            <TableHead>Entry/Exit</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Status & Time</TableHead>
            <TableHead>Exchange Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id} onClick={() => handleRowClick(tx)} className="cursor-pointer">
              <TableCell>
                <GroupedCell>
                  <div className="flex flex-col gap-2">
                    <Badge variant="outline">
                      {tx.deployed_agents?.name || "Unknown Agent"}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "w-fit",
                        tx.action_type === "LONG" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {tx.action_type === "LONG" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {tx.action_type} {tx.leverage}x
                    </Badge>
                  </div>
                </GroupedCell>
              </TableCell>

              <TableCell>
                <GroupedCell>
                  <div className="space-y-1">
                    <div className="font-medium">{tx.market}</div>
                    <div className="text-sm text-gray-400">
                      ${formatNumber(tx.position_size)}
                    </div>
                  </div>
                </GroupedCell>
              </TableCell>

              <TableCell>
                <GroupedCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Entry:</span>
                      <span className="font-medium">${formatNumber(tx.entry_price)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">SL:</span>
                      <span>{tx.stop_loss ? `$${formatNumber(tx.stop_loss)}` : "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">TP:</span>
                      <span>{tx.take_profit ? `$${formatNumber(tx.take_profit)}` : "-"}</span>
                    </div>
                  </div>
                </GroupedCell>
              </TableCell>

              <TableCell>
                <GroupedCell>
                  <div className="space-y-1">
                    <div className={cn(
                      "font-medium",
                      tx.pnl && tx.pnl > 0 ? "text-green-500" : 
                      tx.pnl && tx.pnl < 0 ? "text-red-500" : ""
                    )}>
                      {formatUSD(tx.pnl)}
                    </div>
                    <div className={cn(
                      "text-sm",
                      tx.pnl_percentage && tx.pnl_percentage > 0 ? "text-green-500" : 
                      tx.pnl_percentage && tx.pnl_percentage < 0 ? "text-red-500" : ""
                    )}>
                      {formatPercentage(tx.pnl_percentage)}
                    </div>
                  </div>
                </GroupedCell>
              </TableCell>

              <TableCell>
                <GroupedCell>
                  <div className="space-y-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "capitalize whitespace-nowrap",
                        tx.status === "closed" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                        tx.status === "liquidated" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <span>{tx.status}</span>
                      </div>
                    </Badge>
                    <div className="text-sm text-gray-400">{tx.duration || "-"}</div>
                  </div>
                </GroupedCell>
              </TableCell>

              <TableCell>
                <GroupedCell>
                  <div className="flex items-center gap-2">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="block">
                        {tx.exchange || "-"}
                      </Badge>
                      <Badge variant="secondary" className="block">
                        {tx.chain}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/agent/${tx.deployed_agents?.id}/chat`);
                      }}
                      className="ml-auto"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </GroupedCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TransactionDetailDialog 
        transaction={selectedTransaction} 
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        navigate={navigate}
      />
    </>
  );
};

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({ 
  transaction, 
  open,
  onClose,
  navigate
}) => {
  if (!transaction) return null;

  const formatNumber = (num: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }).format(num);
  };

  const formatUSD = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: amount !== 0 ? "always" : "never",
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return "-";
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "closed":
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case "open":
        return <CirclePause className="h-5 w-5 text-yellow-500" />;
      case "liquidated":
        return <CircleX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/80 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                className={cn(
                  "text-sm font-medium capitalize",
                  transaction.action_type === "LONG" 
                    ? "bg-green-500/10 text-green-500" 
                    : "bg-red-500/10 text-red-500"
                )}
              >
                {transaction.action_type === "LONG" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {transaction.action_type} {transaction.leverage}x
              </Badge>
              <span className="font-bold">{transaction.market}</span>
            </div>
            <Badge 
              variant="outline"
              className={cn(
                "capitalize",
                transaction.status === "closed" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                transaction.status === "liquidated" ? "bg-red-500/10 text-red-500 border-red-500/30" :
                "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
              )}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(transaction.status)}
                <span>{transaction.status}</span>
              </div>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Position Size</p>
              <p className="font-medium">${formatNumber(transaction.position_size)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Entry Price</p>
              <p className="font-medium">${formatNumber(transaction.entry_price)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Stop Loss</p>
              <p className="font-medium">{transaction.stop_loss ? `$${formatNumber(transaction.stop_loss)}` : "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Take Profit</p>
              <p className="font-medium">{transaction.take_profit ? `$${formatNumber(transaction.take_profit)}` : "-"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">P&L</p>
              <p className={cn(
                "font-medium",
                transaction.pnl && transaction.pnl > 0 ? "text-green-500" : 
                transaction.pnl && transaction.pnl < 0 ? "text-red-500" : ""
              )}>
                {formatUSD(transaction.pnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">P&L %</p>
              <p className={cn(
                "font-medium",
                transaction.pnl_percentage && transaction.pnl_percentage > 0 ? "text-green-500" : 
                transaction.pnl_percentage && transaction.pnl_percentage < 0 ? "text-red-500" : ""
              )}>
                {formatPercentage(transaction.pnl_percentage)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Open Time</p>
              <p className="font-medium">{formatDate(transaction.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Close Time</p>
              <p className="font-medium">{formatDate(transaction.closed_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Duration</p>
              <p className="font-medium">{transaction.duration || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Exchange</p>
              <p className="font-medium">{transaction.exchange || "-"}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Agent</p>
              <p className="font-medium">{transaction.deployed_agents?.name || "Unknown Agent"}</p>
            </div>
            <Button
              variant="default1"
              size="sm"
              onClick={() => {
                navigate(`/agent/${transaction.deployed_agents?.id}/chat`);
                onClose();
              }}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
