
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NetworkInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const networks: NetworkInfo[] = [
  {
    id: "slinky-bb-testnet-1",
    name: "Slinky Testnet",
    icon: "https://pbs.twimg.com/profile_images/1805862431354200064/vpf3Reju_400x400.jpg",
    color: "#627EEA"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "#627EEA"
  },
  {
    id: "solana",
    name: "Solana",
    icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    color: "#9945FF"
  },
  {
    id: "base",
    name: "Base",
    icon: "https://assets.coingecko.com/asset_platforms/images/131/small/base-network.png",
    color: "#0052FF"
  },
  {
    id: "bnb",
    name: "BNB Chain",
    icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    color: "#F0B90B"
  },
  {
    id: "movement",
    name: "Movement",
    icon: "https://assets.coingecko.com/coins/images/39345/standard/movement-testnet-token.png",
    color: "#FF5CAA"
  }
];

interface NetworkSelectorProps {
  currentNetwork: string;
  onNetworkChange: (networkId: string) => void;
  className?: string;
  compact?: boolean;
}

export const NetworkSelector = ({
  currentNetwork = "ethereum",
  onNetworkChange,
  className,
  compact = false
}: NetworkSelectorProps) => {
  const currentNetworkInfo = networks.find(net => net.id === currentNetwork) || networks[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200",
        "border border-muted hover:bg-accent focus:outline-none cursor-pointer",
        className
      )}>
        <div className="flex items-center gap-2">
          <img
            src={currentNetworkInfo.icon}
            alt={currentNetworkInfo.name}
            className="w-5 h-5 rounded-full"
          />
          {!compact && (
            <>
              <span className="text-sm font-medium">{currentNetworkInfo.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={compact ? "center" : "start"}
        className="w-[180px] p-2 bg-black/40 backdrop-blur-xl border border-white/10"
      >
        <div className="py-1 px-2 text-xs text-gray-400 font-medium">Select Network</div>
        
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer",
              "focus:bg-accent focus:text-white",
              currentNetwork === network.id && "bg-accent text-white"
            )}
            onClick={() => onNetworkChange(network.id)}
          >
            <img
              src={network.icon}
              alt={network.name}
              className="w-5 h-5 rounded-full"
            />
            <span>{network.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
