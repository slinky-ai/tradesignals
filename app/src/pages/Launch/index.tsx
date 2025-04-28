import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletPrompt } from "@/pages/MyAgents/components/WalletPrompt";
import { DeploymentProgress } from "@/pages/Index/components/DeploymentProgress";
import { FormSteps } from "./components/FormSteps";
import { ProgressBar } from "./components/ProgressBar";
import { useAgentDeployment } from "./hooks/useAgentDeployment";
import { useToast } from "@/hooks/use-toast";
import { FormData } from "./types/agentTypes";
import { supabase } from "@/integrations/supabase/client";
import { Sparkle } from "lucide-react";
import { getAgents } from "@/integrations/api/server";

const FREE_TRIAL_ONLY = true;

interface LaunchProps {
  walletAddress?: string;
}

const Launch = ({ walletAddress }: LaunchProps) => {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<"onchain" | "social">("social");
  const [userAgentCount, setUserAgentCount] = useState(0);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    baseModel: {
      provider: "",
      subModel: "",
      apiKey: ""
    },
    strategy: "",
    chain: "solana",
    customRpc: "",
    environment: "",
    socialPlatforms: [] as string[],
    socialPlatformsOptOut: true,
    assetPairs: ["BTC/USDT"] as string[],
    indicators: [] as Array<{ assetId: string; id: string; timeframe: string[] }>,
    tradingConfig: {
      tradeSignalType: ["ai"],
      tradeType: ["spot"]
    },
    telegramConfig: {
      allowSelectedUsers: true,
      botToken: "",
      selectedUserIds: ""
    },
    characterFile: "",
    selectedProvider: "",
  });

  // Fetch user's agents count
  useEffect(() => {
    if (!walletAddress) return;
    
    const fetchUserAgents = async () => {
      setIsLoadingAgents(true);
      try {

        const { agents: data } = await getAgents({ walletAddress: walletAddress.toLowerCase() });
        if(data) {
          setUserAgentCount(data.length || 0);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch existing agents",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error in agent count fetch:', err);
      } finally {
        setIsLoadingAgents(false);
      }
    };
    
    fetchUserAgents();
  }, [walletAddress]);

  // Adjust total steps based on agent type and opt-out selection
  const getTotalSteps = () => {
    if (selectedType === "social") {
      // If opt-out is selected, skip both base model and character details steps
      if (formData.socialPlatformsOptOut) {
        return 4; // Name, Trading Config, Social Platforms, Provider Selection
      }
      return 5; // Regular social flow with base model step skipped
    }
    return 5; // Onchain agents
  };

  const totalSteps = getTotalSteps();

  const { isDeploying, setIsDeploying, progress, deploymentStatus } = useAgentDeployment(
    formData,
    walletAddress,
    selectedType === "social" ? "SOCIAL" : "CEX_SPOT"
  );

  const handleNextStep = () => {
    // When we're at the final step, trigger deployment
    if (currentStep === totalSteps) {
      setIsDeploying(true);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update total steps when opt-out changes
  useEffect(() => {
    if (currentStep > getTotalSteps()) {
      setCurrentStep(getTotalSteps());
    }
  }, [formData.socialPlatformsOptOut]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // If toggling socialPlatformsOptOut, ensure we set appropriate defaults
      if (field === "socialPlatformsOptOut" && value === true) {
        // Set default base model for opt-out
        if (!updated.baseModel.provider) {
          updated.baseModel = {
            ...updated.baseModel,
            provider: "openai",
            subModel: "gpt-4"
          };
        }
      }

      return updated;
    });
  };

  if (!walletAddress) {
    return <WalletPrompt />;
  }

  if (isDeploying) {
    return (
      <div className="min-h-screen bg-background">
        <DeploymentProgress
          progress={progress}
          deploymentStatus={deploymentStatus}
          onComplete={() => { }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6 relative">
        <div className="text-center space-y-2 relative mb-6">
          <div className="absolute top-0 right-0 transform rotate-12">
            <Sparkle className="w-10 h-10 text-[#FF8133]/10" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent relative">
            Launch your AI Trading Agent with few clicks
            <div className="absolute -top-6 -right-6">
              <Sparkle className="w-6 h-6 text-[#FF8133]/20 animate-pulse" />
            </div>
          </h1>
          <h3 className="text-sm bg-gradient-to-r from-[#FF8133]/70 to-[#FF8133]/70 bg-clip-text text-transparent relative">
            Run your AI Trading Agent in just a few clicks for automated signal generation and seamless trade execution.
            <div className="absolute -top-6 -right-6">
              <Sparkle className="w-6 h-6 text-[#FF8133]/20 animate-pulse" />
            </div>
          </h3>
        </div>

        <Tabs
          value={selectedType}
          onValueChange={(value: "onchain" | "social") => {
            setSelectedType(value);
            setCurrentStep(1);
            setFormData({
              name: "",
              baseModel: {
                provider: "",
                subModel: "",
                apiKey: ""
              },
              strategy: "",
              chain: "solana",
              customRpc: "",
              environment: "",
              socialPlatforms: [],
              socialPlatformsOptOut: true,
              assetPairs: ["BTC/USDT"],
              indicators: [],
              tradingConfig: {
                tradeSignalType: ["ai"],
                tradeType: ["spot"]
              },
              characterFile: "",
              selectedProvider: "",
              telegramConfig: {
                allowSelectedUsers: true,
                botToken: "",
                selectedUserIds: ""
              },
            });
          }}
          className="w-full"
        >
          <TabsContent value="social" className="space-y-6 mt-6">
            <FormSteps
              currentStep={currentStep}
              totalSteps={totalSteps}
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              agentType="SOCIAL"
              walletAddress={walletAddress}
              hasExistingAgent={FREE_TRIAL_ONLY ? userAgentCount >= 1 : false}
              // hasExistingAgent={false}
              isLoadingAgents={isLoadingAgents}
            />
          </TabsContent>

          <TabsContent value="onchain" className="space-y-6 mt-6">
            <FormSteps
              currentStep={currentStep}
              totalSteps={totalSteps}
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              agentType="CEX_SPOT"
              walletAddress={walletAddress}
              hasExistingAgent={FREE_TRIAL_ONLY ? userAgentCount >= 1 : false}
              // hasExistingAgent={false}
              isLoadingAgents={isLoadingAgents}
            />
          </TabsContent>
        </Tabs>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  );
};

export default Launch;
