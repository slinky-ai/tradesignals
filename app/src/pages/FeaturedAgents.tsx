
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Agent } from "./Index/types";
import { AgentCard } from "./Index/components/AgentCard";
import { getFeaturedAgents } from "@/integrations/api/server";
import { useNavigate } from "react-router-dom";
import { autoConnectWallet } from "@/utils/web3Auth";
import { ELIZA_CODE } from "@/config";
import { LoginModal } from "@/components/LoginModal";
import { loginWithWeb3 } from "@/utils/web3Auth";

interface FeaturedAgentsProps {
  walletAddress: string;
  onConnect: () => void;
}

const FeaturedAgents = ({ walletAddress, onConnect }: FeaturedAgentsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Try to auto-connect wallet on page load
  useEffect(() => {
    const attemptAutoConnect = async () => {
      try {
        // Only attempt to auto-connect if we don't already have a wallet address
        if (!walletAddress) {
          console.log("Attempting to auto-connect wallet...");
          const storedWalletAddress = localStorage.getItem('wallet_address');
          
          if (storedWalletAddress) {
            const connectedAddress = await autoConnectWallet();
            
            if (connectedAddress) {
              console.log("Auto-connected to wallet:", connectedAddress);
              onConnect();
            } else {
              console.log("Could not auto-connect. Wallet may not be available.");
              setShowLoginModal(true);
            }
          } else {
            // No stored wallet address, show login modal
            setShowLoginModal(true);
          }
        }
      } catch (error) {
        console.error("Error during auto-connect:", error);
        setShowLoginModal(true);
      } finally {
        setIsInitializing(false);
      }
    };
    
    attemptAutoConnect();
  }, [walletAddress, onConnect]);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const { token, address } = await loginWithWeb3();
      console.log('Successfully authenticated with Web3', { address });
      onConnect();
      setShowLoginModal(false);
      toast({
        title: "Connected Successfully",
        description: `Connected to wallet: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Web3 authentication error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    const fetchFeaturedAgents = async () => {
      if (isInitializing) return; // Don't fetch until initialization is complete
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching featured agents for wallet:", walletAddress);
        
        if (!walletAddress) {
          const storedWalletAddress = localStorage.getItem('wallet_address');
          
          if (!storedWalletAddress) {
            console.log("No wallet address available, showing empty state");
            setFeaturedAgents([]);
            setIsLoading(false);
            return;
          }
          
          console.log("Using stored wallet address:", storedWalletAddress);
          // Continue with stored wallet address
        }
        
        const effectiveWalletAddress = "-" //walletAddress || localStorage.getItem('wallet_address');
        
        // if (!effectiveWalletAddress) {
        //   setFeaturedAgents([]);
        //   setIsLoading(false);
        //   return;
        // }
        
        // For now, we're using getAgents (my agents) to populate the featured agents page
        const response = await getFeaturedAgents();
        console.log("API Response:", response);
        
        if (!response || !response.agents) {
          throw new Error("Invalid response format from API");
        }
        
        const data = response.agents;
        // console.log("Featured agents data:", data);

        // Transform the data to match the Agent type
        const transformedAgents: Agent[] = data.map((agent: any) => ({
          id: agent.agentid || Math.random().toString(36).substring(7),
          appId: agent.appid || ELIZA_CODE,
          name: agent.agentname || "Unnamed Agent",
          description: agent.description || "",
          type: agent.agent_type || 'ASSISTANT',
          icon: null, // We'll handle the icon in the AgentCard component
          features: [],
          platforms: [],
          // Ensure blockchains is always an array with at least one default value
          blockchains: Array.isArray(agent.blockchains) && agent.blockchains.length > 0 
            ? agent.blockchains 
            : ["All Chains"],
          walletAddress: agent.creator,
          creator: agent.creator,
          status: agent.status === true ? "active" : "inactive",
          links: agent.links,
          twitter: {
            username: agent.links?.twitter || agent?.twitter?.username
          },
          telegram: {
            username: agent.links?.telegram || agent?.telegram?.username
          }
        }));

        console.log("Transformed agents:", transformedAgents);
        setFeaturedAgents(transformedAgents);
      } catch (error) {
        console.error("Error fetching featured agents:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        toast({
          title: "Error loading featured agents",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedAgents();
  }, [walletAddress, toast, isInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 overflow-y-auto">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModal} 
        onLogin={handleConnectWallet} 
        isLoading={isConnecting} 
      />
      
      <div className="min-h-screen bg-black p-4 md:p-8 overflow-y-auto pb-16">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Featured Agents</h1>
            <p className="text-sm md:text-base text-gray-400">
              Discover our most popular AI agents for trading and market analysis
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              <p>Error: {error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 h-64 animate-pulse border border-white/5">
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {featuredAgents.map((agent) => (
                  <div key={agent.id} className="h-full">
                    <AgentCard 
                      agent={agent} 
                      walletAddress={agent?.creator?.toLowerCase()|| '-'}
                    />
                  </div>
                ))}
              </div>

              {featuredAgents.length === 0 && !isLoading && !error && (
                <div className="text-center p-6 md:p-8 bg-card rounded-lg border border-white/5 mb-8">
                  <h3 className="text-lg font-medium text-white mb-1">No Featured Agents Yet</h3>
                  <p className="text-sm text-gray-400">
                    Check back soon! We're constantly adding new featured agents.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FeaturedAgents;
