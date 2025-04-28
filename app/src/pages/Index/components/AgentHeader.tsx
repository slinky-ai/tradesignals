
import { Bot } from "lucide-react";
import { Agent } from "../types";

interface AgentHeaderProps {
  agent: Agent;
}

export const AgentHeader = ({ agent }: AgentHeaderProps) => {
  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Bot className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-medium">{agent.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {agent.description}
        </p>
      </div>
    </div>
  );
};
