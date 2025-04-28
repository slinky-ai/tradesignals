
import { Bot } from "lucide-react";

export const WalletPrompt = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Bot className="w-16 h-16 text-[#FF8133]" />
      <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Please connect your wallet to view your deployed agents.
      </p>
    </div>
  );
};

