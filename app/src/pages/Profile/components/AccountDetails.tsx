
import { Wallet, Mail, CreditCard, Copy, Stars, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AccountDetailsProps {
  walletAddress?: string;
  userEmail: string | null;
  onEmailLink: () => Promise<void>;
}

export const AccountDetails = ({ walletAddress, userEmail, onEmailLink }: AccountDetailsProps) => {
  const { toast } = useToast();

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 border border-white/10">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
        <Stars className="w-32 h-32 text-[#FF8133]/10" />
      </div> */}
      {/* <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3">
        <Sparkles className="w-24 h-24 text-[#FF8133]/10" />
      </div> */}

      <div className="flex items-center gap-4 mb-6 relative">
        <div className="p-3 rounded-xl bg-[#FF8133]/10">
          <Wallet className="h-5 w-5 text-white animate-bounce-subtle" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Account Details</h2>
          <p className="text-sm text-white/60">My Personal Details</p>
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Connected Address</p>
            <p className="font-medium text-white">{walletAddress ? shortenAddress(walletAddress) : 'Not Connected'}</p>
          </div>
          {walletAddress && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-[#FF8133]/10"
              onClick={() => copyToClipboard(walletAddress)}
            >
              <Copy className="h-4 w-4 text-[#FF8133]" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`h-2 w-2 rounded-full ${walletAddress ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          <span className="text-sm text-white/60">
            {walletAddress ? 'Verified Account' : 'Pending Verification'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-4 w-4 text-[#FF8133] animate-bounce-subtle" />
            <p className="text-sm text-white/60">Email</p>
          </div>
          {userEmail ? (
            <p className="font-medium text-white">{userEmail}</p>
          ) : (
            <Button
              variant="link"
              className="text-[#FF8133] p-0 h-auto font-medium hover:text-[#FF8133]/80"
              // onClick={onEmailLink}
            >
              Link Email
            </Button>
          )}
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-4 w-4 text-[#FF8133] animate-bounce-subtle" />
            <p className="text-sm text-white/60">Payment</p>
          </div>
          {false ? (
            <p className="font-medium text-white">•••• 4242</p>
          ) : (
            <Button
              variant="link"
              className="text-[#FF8133] p-0 h-auto font-medium hover:text-[#FF8133]/80"
            >
              Link Payment
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
