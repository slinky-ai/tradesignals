
import { useState } from "react";
import { FormData } from "../types/agentTypes";
import { FormStepValidator } from "../validators/FormStepValidator";
import { NextButtonDisabledChecker } from "../validators/NextButtonDisabledChecker";

export const useFormValidation = (
  formData: FormData,
  currentStep: number,
  agentType?: string
) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validateStep = (): boolean => {
    const validator = new FormStepValidator(formData, currentStep, agentType);
    const validationResult = validator.validate();
    
    setErrors(validationResult);
    return validationResult.length === 0;
  };

  const isNextDisabled = (isPaid: boolean, isProviderSelectionStep: boolean): boolean => {
    // If we're on the provider selection step and payment is completed, always enable the next button
    if (isProviderSelectionStep && isPaid) {
      return false;
    }
    
    const disabledChecker = new NextButtonDisabledChecker(formData, currentStep, agentType);
    return disabledChecker.isDisabled();
  };

  return {
    errors,
    setErrors,
    validateStep,
    isNextDisabled
  };
};
