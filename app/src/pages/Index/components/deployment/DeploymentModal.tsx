
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DeploymentProgress } from "../DeploymentProgress";
import { DeploymentSteps } from "../DeploymentSteps";
import { CostEstimate } from "../CostEstimate";
import { DeploymentConfig, AgentType } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { AgentNameStep } from "./AgentNameStep";
import { useDeploymentProgress } from "../../hooks/useDeploymentProgress";

interface DeploymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
  walletAddress: string;
  agentType: AgentType;
  onDeploy: () => void;
  onComplete: () => void;
}

export const DeploymentModal = ({ 
  open, 
  onOpenChange, 
  agentName, 
  walletAddress,
  agentType,
  onDeploy,
  onComplete 
}: DeploymentModalProps) => {
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [customAgentName, setCustomAgentName] = useState(agentName);
  const [deploymentCompleted, setDeploymentCompleted] = useState(false);

  const form = useForm<DeploymentConfig>({
    defaultValues: {
      environment: "non-verifiable",
      llmChoice: "slinky",
      operators: []
    }
  });

  const deploymentSteps = [
    "Initiating memory chain...",
    "Connecting to Slinky Layer...",
    "Creating Bitcoin secured agent...",
    "Configuring secure runtime environment...",
    "Establishing operator connections...",
    "Finalizing deployment..."
  ];

  const { progress, deploymentStatus } = useDeploymentProgress(
    isDeploying,
    deploymentSteps,
    () => {
      setDeploymentCompleted(true);
      onComplete();
    }
  );

  const calculateCost = () => {
    const basePrice = form.watch("environment") === "verifiable" ? 20 : 10;
    const llmPrice = form.watch("llmChoice") === "slinky" ? 10 : 0;
    const operators = form.watch("operators") || [];
    return { basePrice, llmPrice, operators };
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    const { data: config } = await supabase
      .from('agent_configurations')
      .select('id')
      .eq('agent_type', agentType)
      .single();

    if (!config) {
      console.error('Agent configuration not found');
      return;
    }

    const formValues = form.getValues();
    const { error } = await supabase
      .from('deployed_agents')
      .insert({
        user_id: walletAddress,
        config_id: config.id,
        name: customAgentName,
        status: 'active',
        configuration: JSON.parse(JSON.stringify(formValues))
      });

    if (error) {
      console.error('Error deploying agent:', error);
      return;
    }
    
    onDeploy();
  };

  const maxSteps = agentType === 'ANALYSIS' ? 5 : 6;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!deploymentCompleted) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy {customAgentName}</DialogTitle>
          <DialogDescription>
            {isDeploying ? 
              "Setting up your agent. Please wait while we complete the process." :
              "Configure your agent deployment settings."
            }
          </DialogDescription>
        </DialogHeader>

        {!isDeploying ? (
          <div className="mt-4 space-y-4">
            {step === 1 && (
              <AgentNameStep 
                customAgentName={customAgentName}
                setCustomAgentName={setCustomAgentName}
              />
            )}
            
            {step > 1 && (
              <DeploymentSteps 
                step={step - 1}
                form={form}
                operators={[
                  "Animoca Brands",
                  "Phala Cloud",
                  "Validation Cloud",
                  "Everstake",
                  "P-OPS Team",
                  "HashKey Cloud"
                ]}
                agentType={agentType}
              />
            )}
            
            {step > 2 && (
              <CostEstimate 
                {...calculateCost()}
              />
            )}
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (step < maxSteps) {
                    setStep((prev) => prev + 1);
                  } else {
                    handleDeploy();
                  }
                }}
                disabled={step === 1 && !customAgentName.trim()}
              >
                {step === maxSteps ? "Deploy" : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          <DeploymentProgress 
            progress={progress}
            deploymentStatus={deploymentStatus}
            onComplete={onComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
