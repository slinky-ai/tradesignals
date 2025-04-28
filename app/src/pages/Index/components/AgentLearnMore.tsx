
import { Agent } from "../types";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ArrowRight } from "lucide-react";

interface AgentLearnMoreProps {
  agent: Agent;
}

export const AgentLearnMore = ({ agent }: AgentLearnMoreProps) => {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center space-x-2">
          {agent.icon}
          <span>{agent.name}</span>
        </SheetTitle>
        <SheetDescription>
          {agent.description}
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-4">Key Features</h4>
        <ul className="space-y-4">
          {agent.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-[#FF8133]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
