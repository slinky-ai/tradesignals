
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AgentInformationCardProps {
  name: string;
  onNameChange: (value: string) => void;
}

export const AgentInformationCard = ({ name, onNameChange }: AgentInformationCardProps) => {
  return (
    <div className="p-8 bg-[#151A29]/80 border border-white/10 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Let's Name Your Agent</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agentName">Agent Name</Label>
          <Input 
            id="agentName"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., X Prime"
            className="bg-black border-white/10 dark:border-white/10"
          />
        </div>
      </div>
    </div>
  );
};
