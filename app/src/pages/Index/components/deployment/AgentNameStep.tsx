
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AgentNameStepProps {
  customAgentName: string;
  setCustomAgentName: (name: string) => void;
}

export const AgentNameStep = ({ customAgentName, setCustomAgentName }: AgentNameStepProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="agentName">Agent Name</Label>
      <Input 
        id="agentName"
        value={customAgentName}
        onChange={(e) => setCustomAgentName(e.target.value)}
        placeholder="Enter a name for your agent"
        className="w-full"
      />
    </div>
  );
};
