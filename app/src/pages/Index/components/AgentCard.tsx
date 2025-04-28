
import { Button } from "@/components/ui/button";
import { Twitter, MessageCircle, Send, CircuitBoard, Share2, Bot } from "lucide-react";
import { FaXTwitter } from 'react-icons/fa6';

import { useToast } from "@/hooks/use-toast";
import { Agent } from "../types";
import { useState } from "react";
import { LearnMoreSheet } from "./deployment/LearnMoreSheet";
import { DeploymentModal } from "./deployment/DeploymentModal";
import ReactConfetti from 'react-confetti';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface AgentCardProps {
  agent: any;
  walletAddress: string;
}
// Featured Agents Card

const getDefaultDescription = (agentType: string): string => {
  const descriptions: Record<string, string> = {
    CEX_SPOT: "Advanced trading bot for centralized exchanges with real-time market analysis",
    CEX_LEVERAGE: "Specialized trading bot for margin trading on centralized exchanges",
    DEX_SPOT: "Decentralized exchange trading bot with cross-chain capabilities",
    DEX_LEVERAGE: "Decentralized margin trading bot with advanced risk management",
    ARBITRAGE: "Cross-exchange arbitrage opportunities finder and executor",
    ANALYSIS: "Advanced trading signal provider with no wallet connection required",
    SOCIAL: "Automated social media engagement and analytics"
  };
  
  return descriptions[agentType] || "Intelligent agent with advanced capabilities";
};

const getBlockchainInfo = (agentType: string): string[] => {
  const blockchainMap: Record<string, string[]> = {
    DEX_SPOT: ["Solana", "Base", "Aptos"],
    DEX_LEVERAGE: ["Base", "Movement"],
    ARBITRAGE: ["Solana", "Base", "Movement"],
    CEX_SPOT: ["Binance"],
    CEX_LEVERAGE: ["Binance", "Bybit"],
    ANALYSIS: ["All Chains"],
    SOCIAL: ["All Platforms"],
    ASSISTANT: ["All Chains"]
  };
  
  return blockchainMap[agentType] || ["Ethereum"];
};

const shortenAddress = (address: string): string => {
  if (!address || address.length < 10) return address || "0x000...000";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const getChainIcon = (chainName: string) => {
  switch (chainName.toLowerCase()) {
    case 'ethereum':
      return <CircuitBoard className="w-3 h-3 text-[#627EEA]" />;
    case 'solana':
      return <CircuitBoard className="w-3 h-3 text-[#9945FF]" />;
    case 'base':
      return <CircuitBoard className="w-3 h-3 text-[#0052FF]" />;
    case 'aptos':
      return <CircuitBoard className="w-3 h-3 text-[#2CDFD2]" />;
    case 'movement':
      return <CircuitBoard className="w-3 h-3 text-[#FF5CAA]" />;
    case 'binance':
      return <CircuitBoard className="w-3 h-3 text-[#F0B90B]" />;
    case 'bybit':
      return <CircuitBoard className="w-3 h-3 text-[#FCD535]" />;
    case 'all chains':
    case 'all platforms':
      return <CircuitBoard className="w-3 h-3 text-[#A8A8A8]" />;
    default:
      return <CircuitBoard className="w-3 h-3 text-[#A8A8A8]" />;
  }
};

export const AgentCard = ({ agent, walletAddress }: AgentCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [deploymentModalOpen, setDeploymentModalOpen] = useState(false);

  const description = agent.description || getDefaultDescription(agent.type);
  
  const blockchains = agent.blockchains || getBlockchainInfo(agent.type);
  
  const agentWalletAddress = agent.creator  // || `0x${Math.random().toString(16).substring(2, 14)}`;
  
  const status = agent.status || "active";

  const handleChatClick = () => {
    toast({
      title: "Chat initiated",
      description: `Opening chat with ${agent.name}`,
    });
    navigate(`/featured/${agent.appId}-${agent.id}/chat`);
  };

  const handleTwitterClick = () => {
    if(agent?.twitter?.username) {
      window.open(`https://twitter.com/${agent?.twitter.username.toLowerCase()}`, "_blank");
    }
  };

  const handleTelegramClick = () => {
    if(agent?.telegram?.username) {
      window.open(`https://t.me/${agent?.telegram?.username.toLowerCase()}`, "_blank");
    }
  };

  return (
    <div className="bg-[#151A29]/80 rounded-lg overflow-hidden h-full flex flex-col shadow-lg border border-white/10 transition-all duration-300 hover:shadow-xl hover:border-[#FF8133]/30">
      {showConfetti && (
        <ReactConfetti 
          recycle={false} 
          onConfettiComplete={() => setShowConfetti(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000
          }}
        />
      )}
      
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-start mb-4">
          <div className="p-2 sm:p-3 bg-[#FF8133]/20 rounded-lg mr-3 sm:mr-4 shadow-inner self-center">
            <Bot className="w-7 h-7 text-[#FF8133] drop-shadow-md animate-bounce-subtle" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                  {agent.name === 'Moonad_10143' ? "Moonad" : (agent.name==='molly_psyops_config' ? "Molly": agent.name) }
                </h3>
                <div className={`mt-1 px-2 py-0.5 inline-block rounded-full text-xs font-medium ${
                  status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                  status === 'inactive' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {status}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 sm:mb-6 bg-[black]/30 p-2 rounded-lg border border-[#242B3D]/50">
          <p className="text-gray-300 line-clamp-3 text-xs sm:text-sm">
            {description}
          </p>
        </div>
        
        {/* Social Media Icons - In their own section */}
        <div className="mb-4">
          <div className="inline-flex space-x-2 bg-black/30 rounded-full px-3 py-1.5 border border-[#242B3D]/50">
            <Button 
              variant="ghost" 
              size="sm"
              className="rounded-full h-7 w-7 p-0 text-[#FF8133] hover:text-white hover:bg-[#FF8133]/20 transition-colors duration-300 flex-shrink-0"
              onClick={handleTwitterClick}
              title="Visit on X (Twitter)"
            >
              {/* <Twitter className="w-3.5 h-3.5" /> */}
              <FaXTwitter className="w-3.5 h-3.5" />

            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              className="rounded-full h-7 w-7 p-0 text-[#FF8133] hover:text-white hover:bg-[#FF8133]/20 transition-colors duration-300 flex-shrink-0"
              onClick={handleTelegramClick}
              title="Chat on Telegram"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              className="rounded-full h-7 w-7 p-0 text-[#FF8133] hover:text-white hover:bg-[#FF8133]/20 transition-colors duration-300 flex-shrink-0"
              onClick={handleChatClick}
              title="Chat with Agent"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 sm:space-y-3 mt-auto">
          <div className="flex flex-wrap items-start gap-1">
            <span className="text-gray-400 w-14 sm:w-20 text-xs sm:text-sm font-medium flex-shrink-0">Chain:</span>
            <div className="flex flex-wrap gap-1">
              {blockchains.map((chain, i) => (
                <span 
                  key={i} 
                  className="bg-[black] text-xs py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-full text-gray-300 border border-[#242B3D] flex items-center gap-1.5"
                >
                  {getChainIcon(chain)}
                  <span className="text-xs hidden xs:inline">{chain}</span>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-gray-400 w-14 sm:w-20 text-xs sm:text-sm font-medium flex-shrink-0">Address:</span>
            <span className="font-mono text-gray-300 text-xs bg-[black]/30 px-2 py-0.5 sm:py-1 rounded-md truncate max-w-[140px] sm:max-w-none">
              {shortenAddress(agentWalletAddress)}
            </span>
          </div>
          
          {/* Agent Type Tag - Moved below Address */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-gray-400 w-14 sm:w-20 text-xs sm:text-sm font-medium flex-shrink-0">Type:</span>
            <span 
              className="bg-gradient-to-r from-[#FF8133]/30 to-[#FF8133]/10 text-[#FF8133] text-xs py-0.5 sm:py-1 px-2 sm:px-3 rounded-full font-medium border border-[#FF8133]/20"
            >
              {agent.type.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <DeploymentModal 
        open={deploymentModalOpen}
        onOpenChange={setDeploymentModalOpen}
        agentName={agent.name}
        walletAddress={walletAddress}
        agentType={agent.type}
        onDeploy={() => {}}
        onComplete={() => setShowConfetti(true)}
      />
    </div>
  );
};
