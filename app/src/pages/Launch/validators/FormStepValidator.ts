import { FormData } from "../types/agentTypes";

export class FormStepValidator {
  constructor(
    private formData: FormData,
    private currentStep: number,
    private agentType?: string
  ) {}

  validate(): string[] {
    const stepErrors: string[] = [];

    if (this.agentType === "SOCIAL") {
      switch (this.currentStep) {
        case 1:
          this.validateName(stepErrors);
          break;
        case 2:
          if (!this.formData.assetPairs || this.formData.assetPairs.length === 0) {
            stepErrors.push("At least one asset pair must be selected.");
          }
          
          if (!this.formData.tradingConfig?.tradeSignalType || this.formData.tradingConfig.tradeSignalType.length === 0) {
            stepErrors.push("Please select a trading signal type.");
          }
          
          if (!this.formData.tradingConfig?.tradeType || this.formData.tradingConfig.tradeType.length === 0) {
            stepErrors.push("Please select a trade type.");
          }
          
          if (this.formData.tradingConfig?.tradeType.includes("perpetual") && 
              (!this.formData.tradingConfig.perpetualType || this.formData.tradingConfig.perpetualType.length === 0)) {
            stepErrors.push("Please select a perpetual trade type (Long/Short/Both).");
          }
          break;
        case 3:
          // If opted out of social platforms, skip validation
          if (this.formData.socialPlatformsOptOut) {
            break;
          }
          
          if (!this.formData.socialPlatforms || this.formData.socialPlatforms.length === 0) {
            stepErrors.push("At least one social platform must be selected.");
          }
          
          if (this.formData.socialPlatforms?.includes("twitter")) {
            if (!this.formData.twitterConfig?.email?.trim()) {
              stepErrors.push("Twitter email is required.");
            }
            if (!this.formData.twitterConfig?.password?.trim()) {
              stepErrors.push("Twitter password is required.");
            }
            if (!this.formData.twitterConfig?.twoFactorSecret?.trim()) {
              stepErrors.push("Twitter 2FA secret is required.");
            }
            if (!this.formData.twitterConfig?.handle?.trim()) {
              stepErrors.push("Twitter handle is required.");
            }
          }
          
          if (this.formData.socialPlatforms?.includes("telegram") && 
              !this.formData.telegramConfig?.botToken?.trim()) {
            stepErrors.push("Telegram bot token is required.");
          }
          break;
        case 4:
          // Skip base model validation for all social platforms
          break;
        case 5:
          // Skip character details validation if opted out
          if (!this.formData.socialPlatformsOptOut) {
            if (
              !this.formData.characterDetails ||
              !this.formData.characterDetails.bio.some((b: string) => b.trim() !== "")
            ) {
              stepErrors.push("Please provide at least one bio line.");
            }
          }
          break;
        case 6:
          if (!this.formData.selectedProvider) {
            stepErrors.push("Please select a provider.");
          }
          break;
      }
    } else {
      switch (this.currentStep) {
        case 1:
          this.validateName(stepErrors);
          break;
        case 2:
          this.validateBaseModel(stepErrors);
          break;
        case 3:
          if (!this.formData.strategy.trim()) {
            stepErrors.push("A strategy is required.");
          }
          break;
        case 4:
          if (!this.formData.chain.trim()) {
            stepErrors.push("Please select a blockchain.");
          }
          break;
        case 5:
          if (!this.formData.selectedProvider) {
            stepErrors.push("Please select a provider.");
          }
          break;
      }
    }

    return stepErrors;
  }

  private validateName(stepErrors: string[]): void {
    if (!this.formData.name.trim()) {
      stepErrors.push("Agent name is required.");
    } else if (this.formData.name.trim().length < 3) {
      stepErrors.push("Agent name must be at least 3 characters long.");
    } else if (!/^[A-Za-z\s]+$/.test(this.formData.name.trim())) {
      stepErrors.push("Agent name can only contain letters and spaces.");
    }
  }

  private validateBaseModel(stepErrors: string[]): void {
    if (!this.formData.baseModel.provider?.trim()) {
      stepErrors.push("Please select a base model provider.");
    }
    
    if (!this.formData.baseModel.subModel?.trim()) {
      stepErrors.push("Please select a specific model from the provider.");
    }
    
    // Check if API key is required for the selected provider
    if (
      ["openai", "anthropic", "grok"].includes(this.formData.baseModel.provider || "") &&
      (!this.formData.baseModel.apiKey || !this.formData.baseModel.apiKey.trim())
    ) {
      stepErrors.push(`Please enter your ${this.formData.baseModel.provider} API Key.`);
    }
  }
}
