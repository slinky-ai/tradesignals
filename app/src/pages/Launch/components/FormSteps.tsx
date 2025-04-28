
import { FormStepsContainer } from "./form-steps/FormStepsContainer";
import { FormData } from "../types/agentTypes";

interface FormStepsProps {
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

export const FormSteps = ({
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
}: FormStepsProps) => {
  return (
    <FormStepsContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      formData={formData}
      updateFormData={updateFormData}
      onNext={onNext}
      onPrev={onPrev}
      agentType={agentType}
      walletAddress={walletAddress}
      hasExistingAgent={hasExistingAgent}
      isLoadingAgents={isLoadingAgents}
    />
  );
};
