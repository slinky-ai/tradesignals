
import { ReactNode, useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { Navigate, useLocation } from "react-router-dom";
import { loginWithWeb3 } from "@/utils/web3Auth";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  walletAddress?: string;
  onConnect: () => void;
}

export const ProtectedRoute = ({ 
  children, 
  walletAddress,
  onConnect 
}: ProtectedRouteProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAndRestoreSession = async () => {
      try {
        // Check if we have both a stored JWT token and wallet address
        const storedToken = localStorage.getItem('web3_jwt');
        const storedWalletAddress = localStorage.getItem('wallet_address');
        
        if (!walletAddress && storedToken && storedWalletAddress) {
          // If we have stored credentials but no active wallet address, trigger reconnection
          console.log('Found stored credentials, attempting to reconnect wallet...');
          onConnect();
          // Don't show login modal when reconnecting
          setShowLoginModal(false);
        } else if (!walletAddress && (!storedToken || !storedWalletAddress)) {
          // Only show login modal if we truly have no credentials
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error("Error restoring session:", error);
        // If restoration fails, show login modal
        setShowLoginModal(true);
      } finally {
        // Mark initialization as complete
        setIsInitializing(false);
      }
    };
    
    checkAndRestoreSession();
  }, [walletAddress, onConnect]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
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
      // Clear stored credentials if authentication fails
      localStorage.removeItem('web3_jwt');
      localStorage.removeItem('wallet_address');
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    if (!walletAddress) {
      window.location.href = '/';
    }
  };

  // If we're still initializing, render nothing until we complete the auth check
  if (isInitializing) {
    return null;
  }

  // Check for valid credentials - either active wallet or stored credentials
  const hasActiveWallet = !!walletAddress;
  const hasStoredCredentials = !!(localStorage.getItem('web3_jwt') && localStorage.getItem('wallet_address'));
  
  // If user has a wallet or stored credentials, render the protected content
  if (hasActiveWallet || hasStoredCredentials) {
    return <>{children}</>;
  }

  // Show login modal if it's open
  if (showLoginModal) {
    return (
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleClose}
        onLogin={handleConnect}
        isLoading={isLoading}
      />
    );
  }

  // Only redirect if there's no wallet, no stored credentials, and we're not showing the login modal
  return <Navigate to="/" replace />;
};
