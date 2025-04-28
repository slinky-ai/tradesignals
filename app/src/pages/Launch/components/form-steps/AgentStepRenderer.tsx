import { AgentInformationCard } from "../AgentInformationCard";
import { BaseModelCard } from "../BaseModelCard";
import { FinalConfigCard } from "../FinalConfigCard";
import { BlockchainSelectionCard } from "../BlockchainSelectionCard";
import { DeploymentEnvironmentCard } from "../DeploymentEnvironmentCard";
import { SocialPlatformCard } from "../SocialPlatformCard";
import { CharacterDetailsForm } from "../CharacterDetailsForm";
import { ProviderSelectionCard } from "../ProviderSelectionCard";
import { AssetPairSelectionCard } from "../AssetPairSelectionCard";
import { TradingConfigurationCard } from "../TradingConfigurationCard";
import { FormData } from "../../types/agentTypes";
import { useEffect } from "react";
import { replaceNameInObject } from "@/utils/transformChar";

interface AgentStepRendererProps {
  currentStep: number;
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  agentType?: string;
  updateTwitterConfig: (newConfig: any) => void;
  updateTelegramConfig: (newConfig: any) => void;
  onProviderChange: (provider: string) => void;
  isPaid: boolean;
  freeTrialApplied?: boolean;
  onApplyFreeTrial?: () => void;
  skipBaseModelStep?: boolean;
  skipCharacterDetailsStep?: boolean;
}

export const AgentStepRenderer = ({
  currentStep,
  formData,
  updateFormData,
  agentType,
  updateTwitterConfig,
  updateTelegramConfig,
  onProviderChange,
  isPaid,
  freeTrialApplied = false,
  onApplyFreeTrial,
  skipBaseModelStep = false,
  skipCharacterDetailsStep = false,
}: AgentStepRendererProps) => {
  useEffect(() => {
    if (agentType === "SOCIAL") {
      if (!formData.baseModel.provider) {
        updateFormData("baseModel", {
          provider: "openai",
          subModel: "gpt-4",
          apiKey: formData.baseModel.apiKey || ""
        });
      }

      if (formData.socialPlatformsOptOut && !formData.characterDetails?.bio?.length) {
        import("@/characters/dobby.character.json").then(dobbyData => {
          let data = dobbyData.default;
          
          updateFormData("characterDetails", {
            bio: data.bio || ["Friendly AI assistant eager to help."],
            lore: data.lore || ["Created to assist users."],
            knowledge: data.knowledge || ["General knowledge"],
            messageExamples: data.messageExamples || [],
            style: data.style || { all: ["Helpful"], chat: ["Conversational"], post: ["Informative"] },
            topics: data.topics || ["Assistance"],
            adjectives: data.adjectives || ["Helpful"],
            postExamples: data.postExamples || [""]
          });
        });
      }
    }
  }, [agentType, formData.socialPlatformsOptOut, formData.name]);

  return agentType === "SOCIAL" ? renderSocialAgentStep() : renderOnchainAgentStep();

  function renderSocialAgentStep() {
    switch (currentStep) {
      case 1:
        return (
          <AgentInformationCard
            name={formData.name}
            onNameChange={(value) => updateFormData("name", value)}
          />
        );
      case 2:
        return (
          <TradingConfigurationCard
            tradingConfig={formData.tradingConfig || { 
              tradeSignalType: ["ai"], 
              tradeType: ["spot"] 
            }}
            selectedAssets={formData.assetPairs || []}
            onTradingConfigChange={(config) => updateFormData("tradingConfig", config)}
            onAssetSelectionChange={(assets) => updateFormData("assetPairs", assets)}
          />
        );
      case 3:
        if (!formData.socialPlatforms || formData.socialPlatforms.length === 0) {
          updateFormData("socialPlatforms", ["chat"]);
        }
        return (
          <SocialPlatformCard
            selectedPlatforms={formData.socialPlatforms || ["chat"]}
            onPlatformsChange={(platforms) => updateFormData("socialPlatforms", platforms)}
            twitterConfig={formData.twitterConfig}
            telegramConfig={formData.telegramConfig}
            onTwitterConfigChange={updateTwitterConfig}
            onTelegramConfigChange={updateTelegramConfig}
            optOut={!!formData.socialPlatformsOptOut}
            onOptOutChange={(optOut) => updateFormData("socialPlatformsOptOut", optOut)}
          />
        );
      case 4:
        if (skipBaseModelStep) {
          return null;
        }
        return (
          <BaseModelCard
            baseModel={formData.baseModel}
            onBaseModelChange={(newBaseModel) => updateFormData("baseModel", newBaseModel)}
          />
        );
      case 5:
        if (skipCharacterDetailsStep) {
          return null;
        }
        return (
          <CharacterDetailsForm
            agentName={formData.name}
            onDetailsSubmit={(details) => updateFormData("characterDetails", details)}
          />
        );
      case 6:
        return (
          <ProviderSelectionCard
            selectedProvider={formData.selectedProvider}
            onProviderChange={onProviderChange}
            onPaymentComplete={() => {}}
            isPaid={isPaid}
            freeTrialApplied={freeTrialApplied}
            onApplyFreeTrial={onApplyFreeTrial}
          />
        );
      default:
        return null;
    }
  }

  function renderOnchainAgentStep() {
    switch (currentStep) {
      case 1:
        return (
          <AgentInformationCard
            name={formData.name}
            onNameChange={(value) => updateFormData("name", value)}
          />
        );
      case 2:
        return (
          <BaseModelCard
            baseModel={formData.baseModel}
            onBaseModelChange={(newBaseModel) => updateFormData("baseModel", newBaseModel)}
          />
        );
      case 3:
        return (
          <FinalConfigCard
            selectedStrategy={formData.strategy}
            onStrategyChange={(value) => updateFormData("strategy", value)}
          />
        );
      case 4:
        return (
          <BlockchainSelectionCard
            selectedChain={formData.chain}
            onChainChange={(value) => updateFormData("chain", value)}
            customRpcUrl={formData.customRpc}
            onCustomRpcChange={(value) => updateFormData("customRpc", value)}
          />
        );
      case 5:
        return (
          <ProviderSelectionCard
            selectedProvider={formData.selectedProvider}
            onProviderChange={onProviderChange}
            onPaymentComplete={() => {}}
            isPaid={isPaid}
            freeTrialApplied={freeTrialApplied}
            onApplyFreeTrial={onApplyFreeTrial}
          />
        );
      default:
        return null;
    }
  }
};
