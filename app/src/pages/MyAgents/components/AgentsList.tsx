
import { Bot, Settings, Pause, Play, MessageSquare, ExternalLink, ChevronDown, Sparkle, Star, Rabbit } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentDetails } from "./AgentDetails";
import { DeployedAgent } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AgentsListProps {
  agents: DeployedAgent[];
  openAgents: string[];
  toggleAgent: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: "active" | "inactive") => Promise<void>;
}

export const AgentsList = ({ agents, openAgents, toggleAgent, onToggleStatus }: AgentsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (agents.length === 0) {
    return (
      <div className="text-center py-16">
        <Rabbit className="h-16 w-16 text-[#FF8133] mx-auto mb-4" />
        <p className="text-muted-foreground">No agents deployed yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {agents.map((agent) => (
        <Collapsible
          key={agent.id}
          open={openAgents.includes(agent.id)}
          onOpenChange={() => toggleAgent(agent.id)}
          className="relative overflow-visible"
        >
          <CollapsibleTrigger asChild>
            <div 
              className="w-full cursor-pointer relative"
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`p-6 glass-card rounded-t-lg ${!openAgents.includes(agent.id) ? 'rounded-b-lg' : 'border-b-0'} 
                              border border-[#FF8133]/10 backdrop-blur-xl transition-all duration-300 relative
                              ${hoveredId === agent.id ? 'transform scale-[1.01] shadow-lg' : 'shadow-md'}`}>
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-[#FF8133] transition-transform duration-300
                                   ${hoveredId === agent.id ? 'scale-110' : ''}`}>
                      <Rabbit className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-[#FF8133]">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.description || `${agent.strategy || 'Custom'} Trading Strategy`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open('http://agent-scan.slinky.network/', '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Explorer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/my-agents/${agent.id}/configure`);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onToggleStatus(agent.id, agent.status);
                        }}
                      >
                        {agent.status === "active" ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-colors duration-300"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if(agent.status !== 'active'){
                            toast({
                              title: "Error",
                              description: "Agent is not active",
                              variant: "destructive",
                            });
                            return;
                          }
                          navigate(`/my-agents/${agent.id}/chat`);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Interact
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.configuration?.tee && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
                          TEE
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`${
                          agent.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800"
                        }`}
                      >
                        {agent.status}
                      </Badge>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground ml-2 transition-transform duration-300 ${openAgents.includes(agent.id) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <AgentDetails 
            agent={agent} 
            isOpen={openAgents.includes(agent.id)}
            onOpenChange={() => toggleAgent(agent.id)}
          />
        </Collapsible>
      ))}
    </div>
  );
};
