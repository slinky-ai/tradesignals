
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface BaseModel {
  provider: string; // "openai" | "anthropic" | "grok" | etc.
  subModel: string; // e.g. "gpt-4" or "claude-3-opus"
  apiKey: string;   // The API key for the chosen provider
}

interface BaseModelCardProps {
  baseModel: BaseModel;
  onBaseModelChange: (newBaseModel: BaseModel) => void;
}

export const BaseModelCard = ({ baseModel, onBaseModelChange }: BaseModelCardProps) => {
  useEffect(() => {
    // Set default sub-model when provider changes
    if (baseModel.provider === "openai" && !baseModel.subModel) {
      onBaseModelChange({ ...baseModel, subModel: "gpt-4" });
    } else if (baseModel.provider === "anthropic" && !baseModel.subModel) {
      onBaseModelChange({ ...baseModel, subModel: "claude-3-opus" });
    } else if (baseModel.provider === "grok" && !baseModel.subModel) {
      onBaseModelChange({ ...baseModel, subModel: "grok-v1" }); // Default Grok model
    }
  }, [baseModel.provider, baseModel.subModel, onBaseModelChange]);

  const handleProviderChange = (provider: string) => {
    // Reset API key when provider changes
    onBaseModelChange({ provider, subModel: "", apiKey: "" });
  };

  const handleApiKeyChange = (apiKey: string) => {
    onBaseModelChange({ ...baseModel, apiKey });
  };

  const handleSubModelChange = (subModel: string) => {
    onBaseModelChange({ ...baseModel, subModel });
  };

  return (
    <Card className="bg-[#151A29]/80 border border-white/10 rounded-lg">
      <CardHeader>
        <CardTitle>Base Model</CardTitle>
        <CardDescription>
          Choose the AI model that will power your agent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={baseModel.provider}
          onValueChange={handleProviderChange}
          className="space-y-4"
        >
          {/* OpenAI Option */}
          <div className="space-y-4">
            <div
              className="bg-black flex items-center space-x-4 rounded-lg border p-4 hover:bg-[#FF8133]/10 transition-colors cursor-pointer"
              onClick={() => handleProviderChange("openai")}
            >
              <RadioGroupItem value="openai" id="openai" />
              <div className="flex-1">
                <Label htmlFor="openai" className="text-base font-semibold">
                  OpenAI
                </Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">GPT-4 and GPT-3.5 models</p>
                  <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    $6 per 1M tokens
                  </span>
                </div>
              </div>
            </div>
            {/* Render the OpenAI API Key + sub-models only if provider === "openai" */}
            {baseModel.provider === "openai" && (
              <div className="pl-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    className="bg-black"
                    id="openai-key"
                    type="password"
                    value={baseModel.apiKey || ""}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                  />
                  {/* You can show an inline error if needed */}
                </div>
                <div className="space-y-2">
                  <Label>Select Sub-Model</Label>
                  <RadioGroup
                    value={baseModel.subModel}
                    onValueChange={handleSubModelChange}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gpt-4" id="gpt-4" />
                      <Label htmlFor="gpt-4">
                        <div className="space-y-1">
                          <div className="font-medium">GPT-4</div>
                          <div className="text-xs text-muted-foreground">
                            Most capable model, best for complex tasks
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gpt-3.5-turbo" id="gpt-3.5-turbo" />
                      <Label htmlFor="gpt-3.5-turbo">
                        <div className="space-y-1">
                          <div className="font-medium">GPT-3.5 Turbo</div>
                          <div className="text-xs text-muted-foreground">
                            Fast and cost-effective for most tasks
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Anthropic Option */}
          <div className="space-y-4">
            <div
              className="bg-black flex items-center space-x-4 rounded-lg border p-4 hover:bg-[#FF8133]/10 transition-colors cursor-pointer"
              onClick={() => handleProviderChange("anthropic")}
            >
              <RadioGroupItem value="anthropic" id="anthropic" />
              <div className="flex-1">
                <Label htmlFor="anthropic" className="text-base font-semibold">
                  Anthropic
                </Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Claude models</p>
                  <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    $10 per 1M tokens
                  </span>
                </div>
              </div>
            </div>
            {baseModel.provider === "anthropic" && (
              <div className="pl-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <Input
                    className="bg-black"
                    id="anthropic-key"
                    type="password"
                    value={baseModel.apiKey || ""}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your Anthropic API key"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Sub-Model</Label>
                  <RadioGroup
                    value={baseModel.subModel}
                    onValueChange={handleSubModelChange}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="claude-3-opus" id="claude-3-opus" />
                      <Label htmlFor="claude-3-opus">
                        <div className="space-y-1">
                          <div className="font-medium">Claude 3 Opus</div>
                          <div className="text-xs text-muted-foreground">
                            Most powerful model, best for complex analysis
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="claude-3-sonnet" id="claude-3-sonnet" />
                      <Label htmlFor="claude-3-sonnet">
                        <div className="space-y-1">
                          <div className="font-medium">Claude 3 Sonnet</div>
                          <div className="text-xs text-muted-foreground">
                            Balanced performance and cost efficiency
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Grok Option */}
          <div className="space-y-4">
            <div
              className="bg-black flex items-center space-x-4 rounded-lg border p-4 hover:bg-[#FF8133]/10 transition-colors cursor-pointer"
              onClick={() => handleProviderChange("grok")}
            >
              <RadioGroupItem value="grok" id="grok" />
              <div className="flex-1">
                <Label htmlFor="grok" className="text-base font-semibold">
                  Grok
                </Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Grok model description</p>
                  <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    Pricing info
                  </span>
                </div>
              </div>
            </div>
            {baseModel.provider === "grok" && (
              <div className="pl-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grok-key">Grok API Key</Label>
                  <Input
                    className="bg-black"
                    id="grok-key"
                    type="password"
                    value={baseModel.apiKey || ""}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter your Grok API key"
                    required
                  />
                </div>
                {/* Additional config fields for Grok if needed */}
              </div>
            )}
          </div>

          {/* Disabled Options (SlinkyLayer and Self-Hosted) */}
          <div
            className="bg-black flex items-center space-x-4 rounded-lg border p-4 bg-muted/40 cursor-not-allowed"
          >
            <RadioGroupItem value="slinky" id="slinky" disabled />
            <div className="flex-1">
              <Label htmlFor="slinky" className="text-base font-semibold">
                SlinkyLayer Private LLM
              </Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Fully private, no conversation recording</p>
                <Badge variant="secondary" className="bg-muted-foreground/20 text-muted-foreground">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </div>

          <div
            className="bg-black flex items-center space-x-4 rounded-lg border p-4 bg-muted/40 cursor-not-allowed"
          >
            <RadioGroupItem value="self-hosted" id="self-hosted" disabled />
            <div className="flex-1">
              <Label htmlFor="self-hosted" className="text-base font-semibold text-muted-foreground">
                Self Hosted
              </Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Use your own endpoint</p>
                <Badge variant="secondary" className="bg-muted-foreground/20 text-muted-foreground">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
