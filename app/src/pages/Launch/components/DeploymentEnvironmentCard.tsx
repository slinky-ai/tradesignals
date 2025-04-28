
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DeploymentEnvironmentCardProps {
  selectedEnvironment: string;
  onEnvironmentChange: (value: string) => void;
}

export const DeploymentEnvironmentCard = ({ selectedEnvironment, onEnvironmentChange }: DeploymentEnvironmentCardProps) => {
  return (
    <Card className="border-border/40 bg-card">
      <CardHeader>
        <CardTitle>Select Deployment Environment</CardTitle>
        <CardDescription>
          Choose your preferred deployment environment based on your security needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedEnvironment} onValueChange={onEnvironmentChange} className="space-y-4">
          <div 
            className="rounded-lg border p-6 hover:bg-accent/50 transition-colors relative cursor-pointer"
            onClick={() => onEnvironmentChange("verifiable")}
          >
            <RadioGroupItem value="verifiable" id="verifiable" className="absolute left-6 top-6" />
            <div className="space-y-2 pl-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Verifiable (TEE)</h3>
                <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full ml-4">
                  $20/month
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Verifiable agents run in a Trusted Execution Environment (TEE) such as Intel SGX, Intel TDX, AWS Nitro Enclave and AMD SEV. Such agents guarantee non human/machine interference and generate verifiable proofs.
              </p>
            </div>
          </div>

          <div 
            className="rounded-lg border p-6 hover:bg-accent/50 transition-colors relative cursor-pointer"
            onClick={() => onEnvironmentChange("non-verifiable")}
          >
            <RadioGroupItem value="non-verifiable" id="non-verifiable" className="absolute left-6 top-6" />
            <div className="space-y-2 pl-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Non-Verifiable</h3>
                <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full ml-4">
                  $10/month
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Non-verifiable agents run on standard hardware and do not provide any guarantees of non human/machine interference.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
