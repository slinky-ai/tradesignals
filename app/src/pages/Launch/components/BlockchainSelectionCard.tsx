
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Server, ChevronDown } from "lucide-react";

interface BlockchainSelectionCardProps {
  selectedChain: string;
  onChainChange: (value: string) => void;
  customRpcUrl?: string;
  onCustomRpcChange?: (value: string) => void;
}

export const BlockchainSelectionCard = ({ 
  selectedChain, 
  onChainChange,
  customRpcUrl = "", 
  onCustomRpcChange 
}: BlockchainSelectionCardProps) => {
  const [customRpc, setCustomRpc] = useState<string>(customRpcUrl);

  const chains = [
    { 
      id: "solana", 
      name: "Solana", 
      icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      description: "High-performance blockchain platform",
      tag: "Most Popular",
      defaultRpc: "https://api.mainnet-beta.solana.com"
    },
    { 
      id: "base", 
      name: "Base", 
      icon: "https://assets.coingecko.com/coins/images/32375/small/base.png",
      description: "Secure and scalable L2 solution",
      tag: "Recommended",
      defaultRpc: "https://mainnet.base.org"
    },
    { 
      id: "movement", 
      name: "Movement", 
      icon: "https://assets.coingecko.com/coins/images/31179/small/token-logo.png",
      description: "Next-gen blockchain network",
      tag: "New",
      defaultRpc: "https://mainnet-rpc.movementlabs.xyz"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      description: "Leading smart contract platform",
      tag: "Popular",
      defaultRpc: "https://eth-mainnet.g.alchemy.com/v2/"
    },
    { 
      id: "bnb", 
      name: "BNB Chain", 
      icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      description: "Fast and low-cost transactions",
      tag: "Recommended",
      defaultRpc: "https://bsc-dataseed.binance.org/"
    }
  ];

  const selectedChainInfo = chains.find(chain => chain.id === selectedChain) || chains[0];

  // Set default RPC for Solana on initial load if no custom RPC is provided
  useEffect(() => {
    if (!customRpc && selectedChain === "solana") {
      const defaultRpc = chains[0].defaultRpc;
      setCustomRpc(defaultRpc);
      if (onCustomRpcChange) {
        onCustomRpcChange(defaultRpc);
      }
    }
  }, []);

  // Update parent component when customRpc changes
  useEffect(() => {
    if (onCustomRpcChange) {
      onCustomRpcChange(customRpc);
    }
  }, [customRpc, onCustomRpcChange]);

  // Update local state when prop changes from parent
  useEffect(() => {
    setCustomRpc(customRpcUrl);
  }, [customRpcUrl]);

  const useDefaultRpc = () => {
    const defaultValue = selectedChainInfo.defaultRpc;
    setCustomRpc(defaultValue);
    if (onCustomRpcChange) {
      onCustomRpcChange(defaultValue);
    }
  };

  const handleRpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomRpc(newValue);
    if (onCustomRpcChange) {
      onCustomRpcChange(newValue);
    }
  };

  const handleChainChange = (chainId: string) => {
    onChainChange(chainId);
    
    // Set default RPC for the selected chain
    const chain = chains.find(c => c.id === chainId);
    if (chain) {
      setCustomRpc(chain.defaultRpc);
      if (onCustomRpcChange) {
        onCustomRpcChange(chain.defaultRpc);
      }
    }
  };

  return (
    <Card className="bg-[#151A29]/80 border border-white/10">
      <CardHeader>
        <CardTitle>Select Blockchain</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose the blockchain network where your agent will operate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto py-3 px-4 bg-black/40 border-white/10 hover:bg-black/60"
              >
                <div className="flex items-center gap-3 text-left">
                  <img 
                    src={selectedChainInfo.icon} 
                    alt={selectedChainInfo.name} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-base">{selectedChainInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedChainInfo.description}</p>
                  </div>
                  <span className="px-2 py-0.5 ml-3 text-xs bg-[#FF8133]/10 text-[#FF8133] rounded-full">
                    {selectedChainInfo.tag}
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 ml-2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-[95%] bg-black/95 backdrop-blur-xl border-white/10"
              align="center"
            >
              {chains.map((chain) => (
                <DropdownMenuItem 
                  key={chain.id} 
                  onClick={() => handleChainChange(chain.id)}
                  className="py-3 px-4 hover:bg-[#FF8133]/10 focus:bg-[#FF8133]/10 focus:text-[#FF8133] cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <img 
                      src={chain.icon} 
                      alt={chain.name} 
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-base">{chain.name}</p>
                      <p className="text-sm text-muted-foreground">{chain.description}</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 text-xs bg-[#FF8133]/10 text-[#FF8133] rounded-full whitespace-nowrap">
                      {chain.tag}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="space-y-2 mt-6">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Server className="h-4 w-4" />
              RPC Endpoint
            </Label>
            <div className="flex gap-2">
              <Input
                value={customRpc}
                onChange={handleRpcChange}
                placeholder={selectedChainInfo.defaultRpc}
                className="flex-1 bg-black/40 border-white/10 focus-visible:ring-[#FF8133]/50 focus-visible:border-[#FF8133]/30"
              />
              <Button
                variant="outline"
                className="border-white/10 hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-colors whitespace-nowrap"
                onClick={useDefaultRpc}
              >
                Use Default
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
