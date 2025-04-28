
import { Agent } from "../types";

interface AgentPlatformsProps {
  agent: Agent;
}

export const AgentPlatforms = ({ agent }: AgentPlatformsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {agent.platforms.map((platform, index) => (
        <div key={index} className="flex flex-col items-center">
          <img 
            src={platform.logo} 
            alt={platform.name} 
            className="h-6 w-6 object-contain"
            title={platform.name}
          />
        </div>
      ))}
    </div>
  );
};
