
import { BarChart3, Network, Workflow, Cpu, Bot, Blocks, MessageSquare } from "lucide-react";
import { Agent } from "../types";

export const agents: any[] = [
  {
    id: 1,
    name: "CEX Spot Trading Agent",
    description: "Advanced trading bot for centralized exchanges with real-time market analysis",
    icon: <BarChart3 className="w-8 h-8" />,
    type: "CEX_SPOT",
    features: [
      "Real-time market analysis",
      "Multiple trading strategies",
      "Risk management system",
      "Automated portfolio rebalancing",
      "24/7 operation capability"
    ],
    platforms: [
      {
        name: "Binance",
        logo: "https://assets.coingecko.com/markets/images/52/small/binance.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "CEX Leverage Trading Agent",
    description: "Specialized trading bot for margin trading on centralized exchanges",
    icon: <Network className="w-8 h-8" />,
    type: "CEX_LEVERAGE",
    features: [
      "Leverage optimization",
      "Risk control systems",
      "Position sizing",
      "Stop-loss management",
      "Margin level monitoring"
    ],
    platforms: [
      {
        name: "Binance",
        logo: "https://assets.coingecko.com/markets/images/52/small/binance.jpg"
      },
      {
        name: "Bybit",
        logo: "https://assets.coingecko.com/markets/images/698/small/bybit_logo.png"
      }
    ]
  },
  {
    id: 3,
    name: "DEX Spot Trading Agent",
    description: "Decentralized exchange trading bot with cross-chain capabilities",
    icon: <Workflow className="w-8 h-8" />,
    type: "DEX_SPOT",
    features: [
      "Multi-DEX integration",
      "Gas optimization",
      "Smart contract interaction",
      "Liquidity pool analysis",
      "Cross-chain trading"
    ],
    platforms: [
      {
        name: "Solana",
        logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png"
      },
      {
        name: "Aptos",
        logo: "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png"
      },
      {
        name: "Base",
        logo: "https://assets.coingecko.com/coins/images/32375/small/base.png"
      }
    ]
  },
  {
    id: 4,
    name: "Arbitrage Agent",
    description: "Cross-exchange arbitrage opportunities finder and executor",
    icon: <Cpu className="w-8 h-8" />,
    type: "ARBITRAGE",
    features: [
      "Real-time price monitoring",
      "Cross-DEX arbitrage",
      "Flash loan integration",
      "Gas optimization",
      "Profit calculation"
    ],
    platforms: [
      {
        name: "Solana",
        logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png"
      },
      {
        name: "Movement",
        logo: "https://assets.coingecko.com/coins/images/31179/small/token-logo.png"
      },
      {
        name: "Base",
        logo: "https://assets.coingecko.com/coins/images/32375/small/base.png"
      }
    ]
  },
  {
    id: 5,
    name: "DEX Leverage Trading Agent",
    description: "Decentralized margin trading bot with advanced risk management",
    icon: <Blocks className="w-8 h-8" />,
    type: "DEX_LEVERAGE",
    features: [
      "Leverage position management",
      "Liquidation protection",
      "Automated margin calls",
      "Risk assessment",
      "Protocol-specific optimizations"
    ],
    platforms: [
      {
        name: "Base",
        logo: "https://assets.coingecko.com/coins/images/32375/small/base.png"
      },
      {
        name: "Movement",
        logo: "https://assets.coingecko.com/coins/images/31179/small/token-logo.png"
      }
    ]
  },
  {
    id: 6,
    name: "Analysis Agent",
    description: "Advanced trading signal provider with no wallet connection required",
    icon: <Bot className="w-8 h-8" />,
    type: "ANALYSIS",
    features: [
      "Technical analysis",
      "Market sentiment analysis",
      "Trading signals",
      "Risk assessment",
      "Performance tracking"
    ],
    platforms: [
      {
        name: "All Chains",
        logo: "https://cdn-icons-png.flaticon.com/512/7838/7838652.png"
      }
    ]
  },
  {
    id: 7,
    name: "Social Agent",
    description: "Automated social media engagement and analytics",
    icon: <MessageSquare className="w-8 h-8" />,
    type: "SOCIAL",
    features: [
      "Multi-platform management",
      "Automated engagement",
      "Content analysis",
      "Sentiment tracking",
      "Performance analytics"
    ],
    platforms: [
      {
        name: "All Platforms",
        logo: "https://cdn-icons-png.flaticon.com/512/7838/7838652.png"
      }
    ]
  }
];
