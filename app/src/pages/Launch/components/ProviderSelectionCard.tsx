
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ELIZA_CODE, FLEEK_CODE } from "@/config";
import { DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const SLINKY_CODE_1 = "1";

interface ProviderSelectionCardProps {
  selectedProvider?: string;
  onProviderChange: (provider: string) => void;
  onPaymentComplete?: () => void;
  isPaid?: boolean;
  freeTrialApplied?: boolean;
  onApplyFreeTrial?: () => void;
}

export const ProviderSelectionCard = ({ 
  selectedProvider, 
  onProviderChange,
  onPaymentComplete,
  isPaid = false,
  freeTrialApplied = false,
  onApplyFreeTrial
}: ProviderSelectionCardProps) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      provider: ELIZA_CODE //selectedProvider || ELIZA_CODE
    }
  });

  useEffect(() => {
    // If no provider is selected, default to ELIZA_CODE and trigger the change
    if (!selectedProvider) {
      onProviderChange(ELIZA_CODE);
      form.setValue("provider", ELIZA_CODE);
      setCurrentPrice(freeTrialApplied ? 0 : 10); // Default price for ELIZA_CODE
    } else {
      // Set price based on selected provider
      const provider = providers.find(p => p.id === selectedProvider);
      if (provider) {
        setCurrentPrice(freeTrialApplied ? 0 : provider.pricing.base);
        form.setValue("provider", selectedProvider);
      }
    }
  }, [selectedProvider, onProviderChange, form, freeTrialApplied]);

  const handleProviderChange = (value: string) => {
    onProviderChange(value);
    // Update price when provider changes
    const provider = providers.find(p => p.id === value);
    if (provider) {
      setCurrentPrice(freeTrialApplied ? 0 : provider.pricing.base);
    }
  };

  const providers = [
    {
      id: ELIZA_CODE,
      name: "Managed Hosting",
      description: "Let us handle the setup and maintenance for you. Enjoy hassle-free, secure, and reliable hosting on our platform.",
      pricing: {
        base: 10,
        details: [
          { name: "Basic Plan", cost: "$10/month", includes: "Up to 1,000 daily interactions", "per": "" },
          // { name: "Additional Usage", cost: "$0.005", per: "per interaction beyond limit" }
        ]
      }
    },
    // {
    //   id: ELIZA_CODE,
    //   name: "ElizaOS",
    //   description: "Intelligent agent with advanced conversational capabilities",
    //   pricing: {
    //     base: 10,
    //     details: [
    //       { name: "Basic Plan", cost: "$10/month", includes: "Up to 1,000 daily interactions" },
    //       { name: "Additional Usage", cost: "$0.005", per: "per interaction beyond limit" }
    //     ]
    //   }
    // },
    // {
    //   id: FLEEK_CODE,
    //   name: "Fleek Network",
    //   description: "Decentralized infrastructure for Web3 applications",
    //   pricing: {
    //     base: 15,
    //     details: [
    //       { name: "Standard Plan", cost: "$15/month", includes: "Up to 20GB storage & CDN" },
    //       { name: "Additional Storage", cost: "$0.02", per: "per GB beyond limit" }
    //     ]
    //   }
    // }
  ];

  return (
    <Card className="bg-[#151A29]/80 border-white/5 relative">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Select Provider</CardTitle>
        <CardDescription>
          Choose the deployment provider for your AI agent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleProviderChange(value);
                  }}
                  className="space-y-6"
                >
                  {providers.map((provider) => (
                    <FormItem 
                      key={provider.id} 
                      className="flex items-start space-x-3 space-y-0 relative border border-white/10 rounded-lg p-4 hover:border-[#FF8133]/30 transition-all bg-black/20"
                    >
                      <FormControl>
                        <RadioGroupItem value={provider.id} />
                      </FormControl>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <Label className="text-base font-medium">{provider.name}</Label>
                          <div className="flex items-center text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-medium">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {provider.pricing.base}/month
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                        
                        {/* Pricing details */}
                        <div className="mt-3 bg-black/20 p-2 rounded-md">
                          <h4 className="text-xs font-medium text-[#FF8133] mb-1">Pricing Details</h4>
                          <ul className="space-y-1">
                            {provider.pricing.details.map((detail, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex justify-between">
                                <span>{detail.name}</span>
                                <span className="font-mono">{detail.cost} {detail.per && <span className="text-gray-500">{detail.per}</span>}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormItem>
            )}
          />
        </Form>
        
        {/* Payable amount display with Free Trial button */}
        <div className="mt-6 py-3 px-4 bg-black/20 border border-white/10 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-white">Payable Amount</h3>
            <p className="text-xs text-muted-foreground">Monthly subscription</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold text-green-500 flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              {freeTrialApplied ? 0 : currentPrice}
            </div>
            {!isPaid && !freeTrialApplied && (
              <Button 
                onClick={onApplyFreeTrial} 
                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
              >
                Apply Free Trial
              </Button>
            )}
          </div>
        </div>
        
        {/* Payment/Free Trial confirmation message */}
        {isPaid && (
          <div className="mt-4 py-3 px-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
            <div>
              <h3 className="text-sm font-medium text-white">
                {freeTrialApplied ? "Free Trial Applied" : "Payment Complete"}
              </h3>
              <p className="text-xs text-muted-foreground">Your agent is ready to deploy</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
