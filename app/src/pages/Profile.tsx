
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "./Profile/components/ProfileHeader";
import { AccountDetails } from "./Profile/components/AccountDetails";
import { ActivitySection } from "./Profile/components/ActivitySection";
import { AgentsStats } from "./Profile/components/AgentsStats";
import { useToast } from "@/hooks/use-toast";
import { getAgents } from "@/integrations/api/server";

interface ProfileProps {
  walletAddress?: string;
}

const Profile = ({ walletAddress }: ProfileProps) => {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [agentStats, setAgentStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const getUserInfo = async () => {
      if (!walletAddress) return;
      
      try {
        // Try to get user by wallet address (using the email format we created)
        const { data } = await supabase.auth.signInWithPassword({
          email: `${walletAddress.toLowerCase()}@wallet.auth`,
          password: localStorage.getItem('web3_jwt') || 'placeholder',
        });
        
        // If we were able to sign in this way, use the user data
        if (data.user) {
          if (data.user.email) {
            setUserEmail(data.user.email.replace('@wallet.auth', ''));
          }
          
          if (data.user.created_at) {
            const date = new Date(data.user.created_at);
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            setCreatedAt(formattedDate);
            return;
          }
        }
        
        // Fallback to localStorage timestamp if Supabase auth failed
        const storedTimestamp = localStorage.getItem('wallet_connected_at');
        
        if (storedTimestamp) {
          const date = new Date(parseInt(storedTimestamp));
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          setCreatedAt(formattedDate);
        } else {
          // If all else fails, use current time as fallback
          const now = new Date();
          const formattedDate = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          localStorage.setItem('wallet_connected_at', now.getTime().toString());
          setCreatedAt(formattedDate);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        
        // Fallback to localStorage if Supabase auth failed
        const storedTimestamp = localStorage.getItem('wallet_connected_at');
        if (storedTimestamp) {
          const date = new Date(parseInt(storedTimestamp));
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          setCreatedAt(formattedDate);
        }
      }
    };
    
    getUserInfo();
  }, [walletAddress]);

  useEffect(() => {
    const fetchAgentStats = async () => {
      if (!walletAddress) return;
      
      try {
        const { agents } = await getAgents({ walletAddress: walletAddress.toLowerCase() });
        
        const stats = {
          total: agents.length,
          active: agents.filter(agent => agent.status === true).length,
          inactive: agents.filter(agent => agent.status !== true).length,
        };
        
        setAgentStats(stats);
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      }
    };

    fetchAgentStats();
  }, [walletAddress]);

  const handleLinkEmail = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: window.prompt("Please enter your email address") || "",
      });
      
      if (error) throw error;
      
      toast({
        title: "Email Verification Sent",
        description: "Please check your email to complete the linking process.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <ProfileHeader 
        title="Profile Overview"
        description="Manage your account and view your activity"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <AccountDetails 
            walletAddress={walletAddress}
            userEmail={userEmail}
            onEmailLink={handleLinkEmail}
          />
          <ActivitySection createdAt={createdAt} />
        </div>
        <div className="md:col-span-4">
          <AgentsStats stats={agentStats} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
