
import { FormData } from "../types/agentTypes";

export class NextButtonDisabledChecker {
  constructor(
    private formData: FormData,
    private currentStep: number,
    private agentType?: string
  ) {}

  isDisabled(): boolean {
    if (this.agentType === "SOCIAL") {
      // Handle the opt-out flow
      const isOptOut = !!this.formData.socialPlatformsOptOut;
      
      // When opt-out is selected, we need to adjust the step validation
      if (isOptOut) {
        switch (this.currentStep) {
          case 1: // Agent name
            return !this.formData.name.trim();
          case 2: // Trading config
            return !this.formData.assetPairs?.length || 
                   !this.formData.tradingConfig?.tradeSignalType?.length || 
                   !this.formData.tradingConfig?.tradeType?.length || 
                   (this.formData.tradingConfig?.tradeType?.includes("perpetual") && 
                    !this.formData.tradingConfig?.perpetualType?.length);
          case 3: // Social platforms - for opt-out, always enable Next
            return false;
          case 4: // Provider selection - last step with opt-out
            if (this.formData.selectedProvider) {
              return false;
            }
            return true;
          default:
            return false;
        }
      }
      
      // Regular flow (no opt-out) - now we skip base model for all social platforms
      switch (this.currentStep) {
        case 1:
          return !this.formData.name.trim();
        case 2:
          return !this.formData.assetPairs?.length || 
                 !this.formData.tradingConfig?.tradeSignalType?.length || 
                 !this.formData.tradingConfig?.tradeType?.length || 
                 (this.formData.tradingConfig?.tradeType?.includes("perpetual") && 
                  !this.formData.tradingConfig?.perpetualType?.length);
        case 3:
          return !this.formData.socialPlatforms?.length ||
            (this.formData.socialPlatforms.includes("twitter") &&
              (
                !this.formData.twitterConfig?.email?.trim() ||
                !this.formData.twitterConfig?.password?.trim() ||
                !this.formData.twitterConfig?.twoFactorSecret?.trim() ||
                !this.formData.twitterConfig?.handle?.trim()
              )
            ) ||
            (this.formData.socialPlatforms.includes("telegram") &&
              !this.formData.telegramConfig?.botToken?.trim());
        case 4: // Character details step
          return !this.formData.characterDetails?.bio?.some((b: string) => b.trim() !== "");
        case 5: // Provider selection
          if (this.formData.selectedProvider) {
            return false;
          }
          return true;
        default:
          return false;
      }
    } else {
      // For onchain agents - keep existing behavior
      switch (this.currentStep) {
        case 1:
          return !this.formData.name.trim();
        case 2:
          if (!this.formData.baseModel.provider?.trim() || !this.formData.baseModel.subModel?.trim()) return true;
          
          if (
            ["openai", "anthropic", "grok"].includes(this.formData.baseModel.provider) &&
            (!this.formData.baseModel.apiKey || !this.formData.baseModel.apiKey.trim())
          ) {
            return true;
          }
          return false;
        case 3:
          return !this.formData.strategy.trim();
        case 4:
          return !this.formData.chain.trim();
        case 5:
          if (this.formData.selectedProvider) {
            return false;
          }
          return true;
        default:
          return false;
      }
    }
  }
}
