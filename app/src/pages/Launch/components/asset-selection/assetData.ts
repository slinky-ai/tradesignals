
export interface AssetPair {
  id: string;
  label: string;
  icon: string;
  description: string;
  tag: string;
  change: string;
  trend: "up" | "down";
}

export const assetPairs: AssetPair[] = [
  { 
    id: "BTC/USDT", 
    label: "BTC/USDT", 
    icon: "₿",
    description: "Bitcoin to Tether trading pair",
    tag: "Most Popular",
    change: "+2.4%",
    trend: "up"
  },
  { 
    id: "ETH/USDT", 
    label: "ETH/USDT", 
    icon: "Ξ",
    description: "Ethereum to Tether trading pair",
    tag: "Popular",
    change: "+1.8%",
    trend: "up"
  },
  { 
    id: "SOL/USDT", 
    label: "SOL/USDT", 
    icon: "◎",
    description: "Solana to Tether trading pair",
    tag: "Trending",
    change: "+5.2%",
    trend: "up"
  },
  { 
    id: "XRP/USDT", 
    label: "XRP/USDT", 
    icon: "✕",
    description: "Ripple to Tether trading pair",
    tag: "Common",
    change: "-0.5%",
    trend: "down"
  },
  { 
    id: "SHIB/USDT", 
    label: "SHIB/USDT", 
    icon: "₳",
    description: "Shiba to Tether trading pair",
    tag: "Growing",
    change: "+0.7%",
    trend: "up"
  },
  { 
    id: "DOGE/USDT", 
    label: "DOGE/USDT", 
    icon: "Ð",
    description: "Dogecoin to Tether trading pair",
    tag: "Meme Coin",
    change: "+1.2%",
    trend: "up"
  },
];
