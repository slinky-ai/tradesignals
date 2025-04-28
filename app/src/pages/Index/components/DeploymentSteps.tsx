
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeploymentConfig, AgentType, AgentConfiguration } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DeploymentStepsProps {
  step: number;
  form: UseFormReturn<DeploymentConfig>;
  operators: string[];
  agentType: AgentType;
}

export const DeploymentSteps = ({ step, form, operators, agentType }: DeploymentStepsProps) => {
  const { data: configuration } = useQuery({
    queryKey: ['agentConfiguration', agentType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_configurations')
        .select('*')
        .eq('agent_type', agentType)
        .single();
      
      if (error) throw error;
      return data as AgentConfiguration;
    }
  });

  const renderContent = () => {
    switch (step) {
      case 1:
        if (agentType === 'CEX_SPOT' || agentType === 'CEX_LEVERAGE') {
          return (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please create a new Binance sub-account and use its API key for better security.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="binanceApiKey">Binance API Key</Label>
                <Input
                  id="binanceApiKey"
                  type="password"
                  {...form.register("binanceApiKey")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="binanceApiSecret">Binance API Secret</Label>
                <Input
                  id="binanceApiSecret"
                  type="password"
                  {...form.register("binanceApiSecret")}
                />
              </div>
            </div>
          );
        }

        if (configuration?.chain_options) {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Select Blockchain</h3>
              <RadioGroup 
                defaultValue={form.getValues("chain")}
                onValueChange={(value) => form.setValue("chain", value)}
                className="space-y-2"
              >
                {configuration.chain_options.map((chain) => (
                  <div key={chain} className="flex items-center space-x-2">
                    <RadioGroupItem value={chain} id={chain} />
                    <Label htmlFor={chain}>{chain}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        }

        if (agentType === 'SOCIAL') {
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Select Social Platforms</h3>
              <div className="space-y-2">
                {['TWITTER', 'FARCASTER', 'LENS', 'TELEGRAM', 'DISCORD'].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox 
                      id={platform}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("socialPlatforms") || [];
                        if (checked) {
                          form.setValue("socialPlatforms", [...current, platform as any]);
                        } else {
                          form.setValue("socialPlatforms", current.filter(p => p !== platform));
                        }
                      }}
                    />
                    <label
                      htmlFor={platform}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {platform.charAt(0) + platform.slice(1).toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Environment</h3>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Choose your deployment environment and associated costs
              </p>
            </div>
            <RadioGroup 
              defaultValue={form.getValues("environment")}
              onValueChange={(value) => form.setValue("environment", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="verifiable" id="verifiable" />
                <Label htmlFor="verifiable">Verifiable (TEE) - $20/month</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-verifiable" id="non-verifiable" />
                <Label htmlFor="non-verifiable">Non-Verifiable - $10/month</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        if (configuration?.dex_options && configuration.chain_options) {
          const selectedChain = form.getValues("chain");
          const dexList = selectedChain ? configuration.dex_options[selectedChain] || [] : [];
          
          if (agentType === 'ARBITRAGE') {
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Select DEXs for Arbitrage</h3>
                <div className="space-y-2">
                  {dexList.map((dex) => (
                    <div key={dex} className="flex items-center space-x-2">
                      <Checkbox 
                        id={dex}
                        onCheckedChange={(checked) => {
                          const current = form.getValues("dex") as string[] || [];
                          if (checked) {
                            form.setValue("dex", [...current, dex]);
                          } else {
                            form.setValue("dex", current.filter(d => d !== dex));
                          }
                        }}
                      />
                      <label
                        htmlFor={dex}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dex}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Select DEX</h3>
              <Select 
                onValueChange={(value) => form.setValue("dex", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a DEX" />
                </SelectTrigger>
                <SelectContent>
                  {dexList.map((dex) => (
                    <SelectItem key={dex} value={dex}>
                      {dex}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        return null;

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Operators</h3>
            <p className="text-sm text-muted-foreground mb-4">You can select multiple operators for better scalability</p>
            <div className="space-y-2">
              {operators.map((operator) => (
                <div key={operator} className="flex items-center space-x-2">
                  <Checkbox 
                    id={operator}
                    onCheckedChange={(checked) => {
                      const currentOperators = form.getValues("operators") || [];
                      if (checked) {
                        form.setValue("operators", [...currentOperators, operator]);
                      } else {
                        form.setValue("operators", currentOperators.filter(op => op !== operator));
                      }
                    }}
                  />
                  <label
                    htmlFor={operator}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {operator}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">LLM Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">Choose your LLM provider</p>
            <RadioGroup 
              defaultValue="slinky"
              onValueChange={(value: "own" | "slinky") => form.setValue("llmChoice", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slinky" id="slinky-llm" />
                <Label htmlFor="slinky-llm">Use Slinky Layer Private LLM ($10 per 1M tokens)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="own" id="own-llm" />
                <Label htmlFor="own-llm">Use Own API Key</Label>
              </div>
            </RadioGroup>
            {form.getValues("llmChoice") === "own" && (
              <div className="mt-4 space-y-4">
                <Select
                  onValueChange={(value: "openai" | "groq" | "anthropic") => form.setValue("llmProvider", value)}
                  defaultValue="openai"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select API Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="groq">Groq</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    type="password"
                    id="api-key"
                    className="w-full mt-1"
                    onChange={(e) => form.setValue("llmApiKey", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
};

