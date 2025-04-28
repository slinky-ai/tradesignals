
import { useState } from "react";
import { ELIZA_CODE, FLEEK_CODE } from "@/config";
import { useToast } from "@/hooks/use-toast";

export const useProviderManagement = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(10); // Default price
  const [selectedProvider, setSelectedProvider] = useState(ELIZA_CODE); // Default to ELIZA
  const [freeTrialApplied, setFreeTrialApplied] = useState(false);
  const { toast } = useToast();

  const handleProviderChange = (provider: string) => {
    // Update current price based on selected provider
    const providerPrice = provider === FLEEK_CODE ? 15 : 10;
    setCurrentPrice(freeTrialApplied ? 0 : providerPrice);
    setSelectedProvider(provider);
    
    return provider;
  };

  const handlePayment = () => {
    setIsPaid(true);
    
    // Show payment success toast
    toast({
      title: "Payment Successful",
      description: `You have successfully paid $${currentPrice} for your selected plan.`,
      variant: "default",
      duration: 3000,
    });
  };

  const applyFreeTrial = () => {
    setFreeTrialApplied(true);
    setCurrentPrice(0);
    setIsPaid(true);
    
    // Show free trial applied toast
    toast({
      title: "Free Trial Applied",
      description: "You have successfully applied the free trial. Enjoy your agent!",
      variant: "default",
      duration: 3000,
    });
  };

  return {
    isPaid,
    currentPrice,
    selectedProvider,
    freeTrialApplied,
    handleProviderChange,
    handlePayment,
    applyFreeTrial
  };
};
