
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDeploymentProgress } from "@/pages/Index/hooks/useDeploymentProgress";
import { AgentType } from "@/pages/Index/types";
import { getStrategyDescription, getTradingParameters } from "../utils/strategyUtils";
import { FormData } from "../types/agentTypes";
import { deployAgent, getAgent } from "@/integrations/api/server";
import { 
  deploymentSteps, 
  getAgentClients, 
  getAgentSettings,
  prepareAgentData,
  getAgentLinks
} from "../utils/deploymentUtils";
import { replaceNameInObject, transformCharacter } from "@/utils/transformChar";

export const useAgentDeployment = (formData: FormData, walletAddress?: string, agentType: AgentType = "CEX_SPOT") => {
  const [isDeploying, setIsDeploying] = useState(false);
  const deploymentRef = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { progress, deploymentStatus } = useDeploymentProgress(isDeploying, deploymentSteps);

  useEffect(() => {
    const handleDeploy = async () => {
      if (!deploymentRef.current && isDeploying) {
        console.log('Starting agent deployment...', isDeploying, deploymentRef.current);
        deploymentRef.current = true;

        try {
          if (!walletAddress) {
            throw new Error('Wallet address is required for agent deployment');
          }

          if(formData.socialPlatformsOptOut) {
            let temp = formData.characterDetails;
            temp = replaceNameInObject(temp, "Dobby", formData.name);
            formData.characterDetails = temp;
          }
          const normalizedWalletAddress = walletAddress.toLowerCase();
          const configId = ""; // Placeholder for future implementation
          const clients = getAgentClients(formData);
          const { settings } = getAgentSettings(formData);
          
          let description = "Trading agent";
          let tradingParameters = {};

          // Set appropriate description and trading parameters based on agent type
          if (agentType === "SOCIAL") {
            // description = "Social and personal agent";
            if (!formData.socialPlatformsOptOut && !formData.characterDetails) {
              throw new Error('Agent details are required for social agents');
            }
            
            // Include trading configuration for SOCIAL agents too
            tradingParameters = {
              tradingConfig: formData.tradingConfig || { tradeSignalType: ["ai"], tradeType: ["spot"] },
              assetPairs: formData.assetPairs || ["BTC/USDT"]
            };
          } else {
            tradingParameters = {
              ...getTradingParameters(formData.strategy),
              tradingConfig: formData.tradingConfig || { tradeSignalType: ["ai"], tradeType: ["spot"] },
              assetPairs: formData.assetPairs || ["BTC/USDT"]
            };
            // description = getStrategyDescription(formData.strategy);
          }

          console.log('Trading parameters:', tradingParameters);
          console.log('Trading config from form:', formData.tradingConfig);
          console.log('Asset pairs from form:', formData.assetPairs);
          console.log('Description:', description);
          
          // Prepare agent configuration data
          const agentData = prepareAgentData(
            formData, 
            normalizedWalletAddress, 
            description, 
            tradingParameters, 
            configId
          );
          console.log('Calling deploy-agent function with data:', agentData);

          // Make sure provider is set
          if (!formData.selectedProvider) {
            throw new Error('Provider selection is required');
          }

          const links = getAgentLinks(formData);
          // return;
          // Uncomment the API call to enable deployment
          const deployedAgent = await deployAgent({
            walletAddress: normalizedWalletAddress,
            type: formData.selectedProvider,
            provider: formData.selectedProvider, 
            creator: normalizedWalletAddress,
            character: agentData.configuration.characterDetails,
            links,
          });
          
          console.log('Deployed agent:', deployedAgent);

          if (!deployedAgent?.success) {
            console.error('Error from deploy-agent function:', deployedAgent?.message);
            throw deployedAgent?.message || "Failed to deploy agent";
          } else {
            console.log('Agent deployed successfully:', deployedAgent);
  
            // Add a small delay for UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message and navigate
            toast({
              title: "Agent Deployed Successfully",
              description: "Your agent has been created and is ready to use.",
            });
    
            setIsDeploying(false);
            navigate("/my-agents", { replace: true });
          }

        } catch (error) {
          console.error('Deployment failed:', error);
          toast({
            title: "Deployment Failed",
            description: error instanceof Error ? error.message : String(error),
            duration: 5000,
          });
        } finally {
          deploymentRef.current = false;
          setIsDeploying(false);
        }
      }
    };

    handleDeploy();
  }, [isDeploying, formData, walletAddress, agentType, navigate, toast]);

  return {
    isDeploying,
    progress, 
    deploymentStatus,
    setIsDeploying,
    startDeployment: () => setIsDeploying(true)
  };
};
