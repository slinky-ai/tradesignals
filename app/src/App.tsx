import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "./components/ui/button";
import { LogOut, Wallet, Sparkle } from "lucide-react";
import { useToast } from "./hooks/use-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { autoConnectWallet } from "./utils/web3Auth";
import { NetworkSelector } from "./components/NetworkSelector";
import Launch from "./pages/Launch";
import MyAgents from "./pages/MyAgents";
import FeaturedAgents from "./pages/FeaturedAgents";
import AgentChat from "./pages/AgentChat";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Swipe from "./pages/MyAgents/Swipe";
import PlaceTrade from "./pages/MyAgents/PlaceTrade";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState("solana");

  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session) {
        const storedWalletAddress = localStorage.getItem('wallet_address');
        if (storedWalletAddress) {
          setWalletAddress(storedWalletAddress);
        }
      } else {
        setWalletAddress("");
        localStorage.removeItem('wallet_address');
      }
    });

    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      try {
        const storedWalletAddress = localStorage.getItem('wallet_address');
        
        if (storedWalletAddress) {
          const connectedAddress = await autoConnectWallet();
          
          if (connectedAddress) {
            console.log("Auto-connected to wallet on app initialization:", connectedAddress);
            setWalletAddress(connectedAddress);
          } else {
            console.log("Using stored wallet address:", storedWalletAddress);
            setWalletAddress(storedWalletAddress);
          }
        }
      } catch (error) {
        console.error("Error during wallet auto-connect:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeApp();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log("Wallet disconnected");
        setWalletAddress("");
        localStorage.removeItem('wallet_address');
        
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      } else if (accounts[0] !== walletAddress) {
        console.log("Wallet account changed:", accounts[0]);
        setWalletAddress(accounts[0]);
        localStorage.setItem('wallet_address', accounts[0]);
        
        toast({
          title: "Wallet Account Changed",
          description: `Now connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [walletAddress, toast]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setWalletAddress(address);
        
        localStorage.setItem('wallet_address', address);
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask",
        });
      } catch (error) {
        console.error("Wallet connection error:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MetaMask",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
    }
  };

  const connectMockWallet = () => {
    const mockAddress = "0x";
    setWalletAddress(mockAddress);
    
    localStorage.setItem('wallet_address', mockAddress);
    
    toast({
      title: "Mock Wallet Connected",
      description: "Successfully connected to mock wallet (0x00)",
    });
  };

  const disconnectWallet = async () => {
    setWalletAddress("");
    localStorage.removeItem('wallet_address');
    
    if (session) {
      await supabase.auth.signOut();
      setSession(null);
    }
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected wallet",
    });
  };

  const handleNetworkChange = (networkId: string) => {
    setCurrentNetwork(networkId);
    console.log(`Switching to network: ${networkId}`);
  };

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex min-h-screen bg-background dark:bg-gray-900">
            <Sidebar 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen}
              walletAddress={walletAddress} 
              onDisconnect={disconnectWallet}
            />
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} bg-black`}>
              <div className="sticky top-0 z-40 p-4 backdrop-blur-lg border-b border-[#FF8133]/10 bg-black/30">
                <div className="flex justify-end items-center gap-3">
                  {walletAddress && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#FF8133]/30 bg-gradient-to-r from-[#FF8133]/10 to-transparent"
                        title="Free Trial"
                      >
                        <Sparkle className="h-4 w-4 text-[#FF8133] animate-pulse" />
                        <span className="hidden sm:inline text-sm font-medium text-[#FF8133]">Free Trial</span>
                      </div>
                      <NetworkSelector 
                        currentNetwork={currentNetwork} 
                        onNetworkChange={handleNetworkChange}
                        compact={true}
                        className="sm:compact:false"
                      />
                    </div>
                  )}
                  {!walletAddress ? (
                    <Button
                      variant="sleek"
                      onClick={connectWallet}
                      className="bg-[#FF8133]/10 text-[#FF8133] hover:bg-[#FF8133]/20 transition-all duration-300 disabled:opacity-50"
                      title="Connect Wallet"
                    >
                      <Wallet className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Connect Wallet</span>
                    </Button>
                  ) : (
                    <Button
                      variant="sleek"
                      size="sm"
                      onClick={disconnectWallet}
                      title="Disconnect Wallet"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Disconnect</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-w-7xl mx-auto p-8">
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <Launch walletAddress={walletAddress} />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-agents" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <MyAgents walletAddress={walletAddress} />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-agents/:agentId/swipe" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <Swipe />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-agents/:agentId/place-trade" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <PlaceTrade />
                    </ProtectedRoute>
                  } />
                  <Route path="/featured" element={
                    <FeaturedAgents walletAddress={walletAddress} onConnect={connectWallet} />
                  } />
                  <Route path="/my-agents/:agentId/chat" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <AgentChat />
                    </ProtectedRoute>
                  } />
                  <Route path="/featured/:agentId/chat" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      {/* <AgentChat /> */}
                      <Swipe/>
                    </ProtectedRoute>
                  } />

                  <Route path="/transactions" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <Transactions />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <Profile walletAddress={walletAddress} />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute walletAddress={walletAddress} onConnect={connectWallet}>
                      <Settings />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </main>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
