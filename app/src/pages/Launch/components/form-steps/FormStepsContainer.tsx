import { useState, useEffect } from "react";
import { NavigationButtons } from "../NavigationButtons";
import { AgentStepRenderer } from "./AgentStepRenderer";
import { FormData } from "../../types/agentTypes";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useProviderManagement } from "../../hooks/useProviderManagement";
import { useToast } from "@/hooks/use-toast";

interface FormStepsContainerProps {
  currentStep: number;
  totalSteps: number;
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  agentType?: string;
  walletAddress?: string;
  hasExistingAgent?: boolean;
  isLoadingAgents?: boolean;
}

export const FormStepsContainer = ({
  currentStep,
  totalSteps,
  formData,
  updateFormData,
  onNext,
  onPrev,
  agentType,
  walletAddress,
  hasExistingAgent = false,
  isLoadingAgents = false
}: FormStepsContainerProps) => {
  const { errors, validateStep, isNextDisabled } = useFormValidation(formData, currentStep, agentType);
  const { 
    isPaid, 
    currentPrice, 
    selectedProvider, 
    freeTrialApplied,
    handleProviderChange, 
    handlePayment,
    applyFreeTrial
  } = useProviderManagement();
  const { toast } = useToast();
  const [showLimitError, setShowLimitError] = useState(false);
  
  const getActualTotalSteps = () => {
    if (agentType === "SOCIAL") {
      if (formData.socialPlatformsOptOut) {
        return 4;
      }
      return 5;
    }
    return totalSteps;
  };
  
  const actualTotalSteps = getActualTotalSteps();
  
  const getLogicalStep = (displayStep: number): number => {
    if (agentType === "SOCIAL") {
      if (displayStep >= 4) {
        if (formData.socialPlatformsOptOut) {
          return displayStep + 2;
        } else {
          return displayStep + 1;
        }
      }
      return displayStep;
    }
    return displayStep;
  };

  const isOptOut = agentType === "SOCIAL" && !!formData.socialPlatformsOptOut;
  const skipBaseModelStep = agentType === "SOCIAL"; 
  const skipCharacterDetailsStep = isOptOut;
  
  const displayedCurrentStep = currentStep;
  
  useEffect(() => {
    if (selectedProvider && selectedProvider !== formData.selectedProvider) {
      updateFormData("selectedProvider", selectedProvider);
    }
  }, [selectedProvider, formData.selectedProvider, updateFormData]);

  const updateTwitterConfig = (newConfig: Partial<typeof formData.twitterConfig>) => {
    updateFormData("twitterConfig", {
      ...formData.twitterConfig,
      ...newConfig,
    });
  };

  const updateTelegramConfig = (newConfig: Partial<typeof formData.telegramConfig>) => {
    updateFormData("telegramConfig", {
      ...formData.telegramConfig,
      ...newConfig,
    });
  };

  const handleNext = () => {
    const logicalStep = getLogicalStep(currentStep);
    
    if (currentStep === 1 && hasExistingAgent && !isLoadingAgents) {
      
      setShowLimitError(true);
      toast({
        title: "Agent Limit Reached",
        description: "You can only create one agent in the free trial mode",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setShowLimitError(false);
      }, 5000);
      
      return;
    }
    
    if (validateStep()) {
      onNext();
    }
  };

  const handlePrev = () => {
    onPrev();
  };

  const isProviderSelectionStep = 
    (isOptOut && currentStep === 4) || 
    (!isOptOut && agentType === "SOCIAL" && currentStep === 5) || 
    (agentType !== "SOCIAL" && currentStep === 5);

  const isFinalStep = isProviderSelectionStep;
  
  const isNameStep = currentStep === 1;
  const isNextDisabledByExistingAgent = isNameStep && hasExistingAgent && !isLoadingAgents;
  
  const isDeployButtonDisabled = 
    isProviderSelectionStep && !isPaid;

  const isNextButtonDisabled = isNextDisabledByExistingAgent || 
                              isDeployButtonDisabled || 
                              isNextDisabled(isPaid, isProviderSelectionStep);

  return (
    <>
      <AgentStepRenderer 
        currentStep={getLogicalStep(currentStep)}
        formData={formData}
        updateFormData={updateFormData}
        agentType={agentType}
        updateTwitterConfig={updateTwitterConfig}
        updateTelegramConfig={updateTelegramConfig}
        onProviderChange={handleProviderChange}
        isPaid={isPaid}
        freeTrialApplied={freeTrialApplied}
        onApplyFreeTrial={applyFreeTrial}
        skipBaseModelStep={skipBaseModelStep}
        skipCharacterDetailsStep={skipCharacterDetailsStep}
      />
      
      {errors.length > 0 && (
        <div className="mt-2 text-red-500">
          {errors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}
      
      {showLimitError && (
        <div className="mt-2 text-red-500">
          <p>You can only create one agent in the free trial mode</p>
        </div>
      )}
      
      <NavigationButtons
        currentStep={displayedCurrentStep}
        totalSteps={actualTotalSteps}
        onNext={handleNext}
        onPrev={handlePrev}
        isNextDisabled={isNextButtonDisabled}
        showPayButton={isProviderSelectionStep && !isPaid && !freeTrialApplied}
        onPay={handlePayment}
        isPaid={isPaid}
        currentPrice={currentPrice}
        isFinalStep={isFinalStep}
        hasExistingAgent={hasExistingAgent}
      />
    </>
  );
};
