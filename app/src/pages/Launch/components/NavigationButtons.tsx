
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
// import type { LifecycleStatus } from '@coinbase/onchainkit/checkout';


interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  showPayButton?: boolean;
  onPay?: () => void;
  isPaid?: boolean;
  currentPrice?: number;
  isFinalStep?: boolean;
  hasExistingAgent?: boolean;
}

export const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev,
  isNextDisabled = false,
  showPayButton = false,
  onPay,
  isPaid = false,
  currentPrice = 0,
  isFinalStep = false,
  hasExistingAgent=false
}: NavigationButtonsProps) => {
  const { toast } = useToast();
  
  const handlePayment = () => {
    if (onPay) {
      onPay();
    }
  };

  // const handleStatus = (status: LifecycleStatus) => {
  //   if (status.statusName === 'success') {
  //     const { chargeId, transactionReceipts, receiptUrl } = status.statusData;
  //     console.log('Payment successful!', { chargeId, transactionReceipts, receiptUrl });
  //     // Perform additional actions here, such as updating the UI or notifying the user
  //   }
  // };

  // Always show payment button when payment is required and not yet made
  const shouldShowPaymentButton = showPayButton && !isPaid;
  
  // Determine if we should show "Deploy" or "Next Step" on the button
  const buttonText = isFinalStep ? "Deploy" : "Next Step";

  const finalNextDisabled = hasExistingAgent ? false : isNextDisabled;

  return (
    <div className="flex justify-between mt-3 mb-8">
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onPrev}
          className="border-white/10 hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-all duration-300"
        >
          Previous Step
        </Button>
      )}
      <div className="flex-1" />
      
      {shouldShowPaymentButton && (
        <Button
          onClick={handlePayment}
          className="bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all duration-300 mr-3"
          disabled={true}
        >
          Pay Now
        </Button>
      )}
      
{/* 
      { false &&
         <Checkout productId={import.meta.env.VITE_PUBLIC_PRODUCT_ID!} 
         onStatus={handleStatus}
        >
        <CheckoutButton coinbaseBranded/> 
        <CheckoutStatus />
      </Checkout>
       } */}

      <Button
        onClick={onNext}
        disabled={finalNextDisabled}
        className="bg-[#FF8133]/10 text-[#FF8133] hover:bg-[#FF8133]/20 transition-all duration-300 disabled:opacity-50"
      >
        {buttonText}
      </Button>
    </div>
  );
};
