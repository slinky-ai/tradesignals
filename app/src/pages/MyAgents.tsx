import { useState, useEffect } from "react";
import { StatsOverview } from "./MyAgents/components/StatsOverview";
import { WalletPrompt } from "./MyAgents/components/WalletPrompt";
import { MyAgentsProps } from "./MyAgents/types";
import { useToast } from "@/hooks/use-toast";
import { getAgents, resetAgent } from "@/integrations/api/server";
import { Settings, PlayCircle, PauseCircle, ExternalLink, MessageCircle, Edit, Save, X, Check, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FLEEK_CODE } from "@/config";

const MyAgents = ({ walletAddress }: MyAgentsProps) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [deployedAgents, setDeployedAgents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<{
    name?: string;
    description?: string;
    strategy?: string;
    provider?: string;
  }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAgents = async () => {
    if (!walletAddress) return;
    
    console.log('=== Fetching Agents ===');
    console.log('Wallet address (raw):', walletAddress);
    console.log('Wallet address (lowercase):', walletAddress.toLowerCase());
    
    setIsLoading(true);
    
    try {
      const { agents: data } = await getAgents({ walletAddress: walletAddress.toLowerCase() });

      // console.log('Raw agents data from DB:', JSON.stringify(data, null, 2));

      if (data) {
        const formattedAgents = data.map(agent => {
          // Convert agent.status to a boolean first, then to "active" or "inactive" string
          const statusBoolean = agent.status === true || agent.status === 1;
          const status = statusBoolean ? "active" : "inactive";
          
          const defaultLLMConfig = {
            provider: "slinky",
            tokens_used: 0,
            tokens_limit: 1000000
          };

          let llmConfig;
          if (agent.llm_config && typeof agent.llm_config === 'object' && !Array.isArray(agent.llm_config)) {
            const config = agent.llm_config as Record<string, unknown>;
            llmConfig = {
              provider: String(config.provider || defaultLLMConfig.provider),
              tokens_used: Number(config.tokens_used || defaultLLMConfig.tokens_used),
              tokens_limit: Number(config.tokens_limit || defaultLLMConfig.tokens_limit)
            };
          } else {
            llmConfig = defaultLLMConfig;
          }

          let parsedConfiguration: { tee?: boolean; chain?: string } = {};
          if (agent.configuration && typeof agent.configuration === 'object' && !Array.isArray(agent.configuration)) {
            const config = agent.configuration as Record<string, unknown>;
            if (typeof config.tee === 'boolean') {
              parsedConfiguration.tee = config.tee;
            }
            if (typeof config.chain === 'string') {
              parsedConfiguration.chain = config.chain;
            }
          }

          const defaultOperator = {
            name: "Default Operator",
            address: agent.creator || ""
          };

          let parsedOperator = defaultOperator;
          if (agent.operator && typeof agent.operator === 'object' && !Array.isArray(agent.operator)) {
            const op = agent.operator as Record<string, unknown>;
            if (typeof op.name === 'string' && typeof op.address === 'string') {
              parsedOperator = {
                name: op.name,
                address: op.address
              };
            }
          }

          const parsedTradingParameters = agent.trading_parameters && typeof agent.trading_parameters === 'object'
            ? agent.trading_parameters as Record<string, any>
            : {};
          
          return {
            id: agent.agentid,
            appId: agent.appid,
            name: agent.agentname || "-",
            description: agent.description || '',
            status,
            deployedAt: agent.createdat,
            framework: "ElizaOS",
            plugins: [],
            operator: parsedOperator,
            blockchains: agent.blockchains || ['All Chains'],
            walletAddress,
            llmConfig,
            configuration: parsedConfiguration,
            strategy: agent.strategy || "spot",
            trading_parameters: parsedTradingParameters,
            type: agent.agent_type || "ANALYSIS",
            links: agent.links
          };
        });

        // console.log('Formatted agents:', JSON.stringify(formattedAgents, null, 2));
        setDeployedAgents(formattedAgents);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to fetch agents. Please try again later.');
      setDeployedAgents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [walletAddress]);

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    let agent = deployedAgents.find(agent => agent.id === agentId);

    if (!agent) return;
    
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    try {
      const result = await resetAgent({ 
        agentId: agentId,
        appId: agent.appId,
        action: newStatus === "active" ? "start" : "stop", 
        character: { name: agent.name }, type: agent.appId
      });
      console.log('Agent status update result:', result);
      if(result) {
        setDeployedAgents(prev => 
          prev.map(agent => 
            agent.id === agentId 
              ? { ...agent, status: newStatus }
              : agent
          )
        );
  
        toast({
          title: `Agent ${newStatus === "active" ? "resumed" : "stopped"}`,
          description: `Agent has been successfully ${newStatus === "active" ? "resumed" : "stopped"}.`,
        });
  
      } else {
        toast({
          title: "Error",
          description: "Failed to update agent status. Please try again.",
          variant: "destructive",
        });
      }
      

    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChatClick = (agent: any) => {
    if(agent.appId === FLEEK_CODE) {
      toast({
        title: "Agent Chat",
        description: "Not supported yet",
        variant: "destructive",
      })
      return;
    }
    if(agent.status === 'inactive') {
      toast({
        title: "Agent Inactive",
        description: "Restart the agent to continue chat",
        variant: "destructive",
      })
      return;
    }
    navigate(`/my-agents/${agent.appId}-${agent.id}/swipe`);
  };

  const handleConfigureClick = (agentId: string) => {
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
      setIsEditing(false);
    } else {
      setSelectedAgentId(agentId);
      setIsEditing(false);
      
      const agent = deployedAgents.find(a => a.id === agentId);
      if (agent) {
        setEditingConfig({
          name: agent.name,
          description: agent.description,
          strategy: agent.strategy,
          provider: agent.llmConfig.provider
        });
      }
    }
  };

  const handleExplorerClick = (agentId: string) => {
    window.open(`/agent-explorer/${agentId}`, "_blank");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!selectedAgentId) return;
    
    try {
      setDeployedAgents(prev => 
        prev.map(agent => 
          agent.id === selectedAgentId 
            ? { 
                ...agent, 
                name: editingConfig.name || agent.name,
                description: editingConfig.description || agent.description,
                strategy: editingConfig.strategy || agent.strategy,
                llmConfig: {
                  ...agent.llmConfig,
                  provider: editingConfig.provider || agent.llmConfig.provider
                }
              }
            : agent
        )
      );
      
      setIsEditing(false);
      
      toast({
        title: "Settings saved",
        description: "Agent configuration has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving agent config:', error);
      toast({
        title: "Error",
        description: "Failed to save agent configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    
    if (selectedAgentId) {
      const agent = deployedAgents.find(a => a.id === selectedAgentId);
      if (agent) {
        setEditingConfig({
          name: agent.name,
          description: agent.description,
          strategy: agent.strategy,
          provider: agent.llmConfig.provider
        });
      }
    }
  };

  const handleAdvancedConfig = () => {
    if (selectedAgentId) {
      navigate(`/my-agents/${selectedAgentId}/configure`);
    }
  };

  if (!walletAddress) {
    return <WalletPrompt />;
  }

  const stats = {
    total: deployedAgents.length,
    active: deployedAgents.filter((a) => a.status === "active").length,
    inactive: deployedAgents.filter((a) => a.status === "inactive").length,
  };

  const shortenAddress = (address: string): string => {
    if (!address || address.length < 10) return address || "0x000...000";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getChainName = (chainName: string) => {
    return chainName || "All Chains";
  };

  const selectedAgent = selectedAgentId 
    ? deployedAgents.find(agent => agent.id === selectedAgentId) 
    : null;

  console.log("deployed agents -----------", deployedAgents);
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">My Deployed Agents</h1>
        <p className="text-white/60">
          Monitor and manage your deployed AI Agents
        </p>
      </div>

      <StatsOverview stats={stats} />
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p>Error: {error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#151A29]/80 rounded-lg p-6 h-64 animate-pulse">
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {deployedAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deployedAgents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className={`bg-[#151A29]/80 backdrop-blur-lg border overflow-hidden h-full flex flex-col shadow-sm
                    ${selectedAgentId === agent.id 
                      ? 'border-[#FF8133]/70 shadow-[0_0_10px_rgba(255,129,51,0.3)]' 
                      : 'border-white/10'} 
                    transition-all duration-300 hover:shadow-md hover:border-[#FF8133]/20`}
                >
                  <CardContent className="p-5 flex-1">
                    <div className="flex items-start mb-4">
                      <div className="p-3 bg-[#FF8133]/20 rounded-lg mr-3 shadow-inner self-center">
                        <Bot className="w-7 h-7 text-[#FF8133] drop-shadow-md animate-bounce-subtle"  />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 pr-2">
                            <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
                            <div className={`mt-1 px-2 py-0.5 inline-block rounded-full text-xs font-medium ${
                              agent.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {agent.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4 bg-[black]/30 p-2 rounded-lg border border-[#242B3D]/50">
                      <p className="text-gray-300 line-clamp-3 text-sm">
                        {agent.description || `Your Personal Assistant`}
                        {/* {agent.description || `${agent.strategy || 'Custom'} Trading Strategy`} */}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-start">
                        <span className="text-gray-400 min-w-16 text-xs font-medium">Chain:</span>
                        <div className="flex flex-wrap gap-1">
                          {(agent.blockchains).map((chain: string, i: number) => (
                            <span 
                              key={i} 
                              className="bg-[black]/50 text-xs py-0.5 px-2 rounded-full text-gray-300 border border-[#242B3D] flex items-center gap-1"
                            >
                              {getChainName(chain)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-400 min-w-16 text-xs font-medium">Address:</span>
                        <span className="font-mono text-gray-300 text-xs bg-[black]/30 px-2 py-0.5 rounded-md">
                          {shortenAddress(agent.operator?.address || agent.walletAddress)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-400 min-w-16 text-xs font-medium">Type:</span>
                        <span 
                          className="bg-gradient-to-r from-[#FF8133]/30 to-[#FF8133]/10 text-[#FF8133] text-xs py-0.5 px-2 rounded-full font-medium border border-[#FF8133]/20"
                        >
                          {/* {agent.type?.replace(/_/g, ' ') || "ASSISTANT"} */}
                          ASSISTANT
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-white/10 p-0 bg-[#151A29]/80">
                    <div className="grid grid-cols-4 w-full">
                      <Button 
                        variant="sleek" 
                        size="sm" 
                        className={`rounded-none text-center flex flex-col items-center justify-center py-2 h-auto
                        ${selectedAgentId === agent.id ? 'bg-[#FF8133]/20 text-white' : ''} 
                        border-r border-white/10`}
                        onClick={
                          () => console.log("Configure clicked")
                          // handleConfigureClick(agent.id)
                        }
                      >
                        <Settings className="w-4 h-4 mb-1" />
                        <span className="text-xs">Configure</span>
                      </Button>
                      
                      <Button 
                        variant="sleek" 
                        size="sm" 
                        className="rounded-none text-center flex flex-col items-center justify-center py-2 h-auto border-r border-white/10"
                        onClick={() => toggleAgentStatus(agent.id, agent.status)}
                      >
                        {agent.status === "active" ? (
                          <>
                            <PauseCircle className="w-4 h-4 mb-1" />
                            <span className="text-xs">Stop</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mb-1" />
                            <span className="text-xs">Start</span>
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="sleek" 
                        size="sm" 
                        className="rounded-none text-center flex flex-col items-center justify-center py-2 h-auto border-r border-white/10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open('http://agent-scan.slinky.network/', '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mb-1" />
                        <span className="text-xs">Explorer</span>
                      </Button>
                      
                      <Button 
                        variant="sleek" 
                        size="sm" 
                        className="rounded-none text-center flex flex-col items-center justify-center py-2 h-auto"
                        onClick={() =>  handleChatClick(agent) }
                      >
                        <MessageCircle className="w-4 h-4 mb-1" />
                        <span className="text-xs">Chat</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 md:p-8 bg-[#151A29]/80 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-1">No Deployed Agents Yet</h3>
              <p className="text-sm text-gray-400">
                Deploy your first agent to get started with automated trading and market analysis.
              </p>
            </div>
          )}
          
          {selectedAgent && (
            <div className="mt-8 bg-[#151A29]/80 rounded-xl border border-[#242B3D] shadow-lg overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between bg-[#151A29]/80 px-6 py-4 border-b border-[#242B3D]">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-[#FF8133]/20 to-[#FF8133]/5 rounded-lg shadow-inner">
                    <Bot className="w-7 h-7 text-[#FF8133] drop-shadow-md" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Agent Configuration: {selectedAgent.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#FF8133]/30 text-[#FF8133] hover:bg-[#FF8133]/10"
                        onClick={handleSaveClick}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#FF8133]/30 text-[#FF8133] hover:bg-[#FF8133]/10"
                      onClick={handleEditClick}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-gray-300"
                    onClick={() => setSelectedAgentId(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[#FF8133] mb-4 font-medium flex items-center">
                        <span className="mr-2">📋</span> Basic Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="agent-name" className="text-gray-400 text-sm mb-1 block">Agent Name</Label>
                          {isEditing ? (
                            <Input
                              id="agent-name"
                              value={editingConfig.name}
                              onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                              className="bg-[#242B3D]/30 border-[#242B3D] text-white"
                            />
                          ) : (
                            <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white">
                              {selectedAgent.name}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="agent-description" className="text-gray-400 text-sm mb-1 block">Description</Label>
                          {isEditing ? (
                            <Textarea
                              id="agent-description"
                              value={editingConfig.description}
                              onChange={(e) => setEditingConfig({ ...editingConfig, description: e.target.value })}
                              className="bg-[#242B3D]/30 border-[#242B3D] text-white min-h-[80px]"
                            />
                          ) : (
                            <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white min-h-[80px]">
                              {selectedAgent.description || `${selectedAgent.strategy || 'Custom'} Trading Strategy`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[#FF8133] mb-4 font-medium flex items-center">
                        <span className="mr-2">⚙️</span> Strategy
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="trading-strategy" className="text-gray-400 text-sm mb-1 block">Trading Strategy</Label>
                          {isEditing ? (
                            <div className="space-y-2">
                              <RadioGroup 
                                defaultValue={editingConfig.strategy}
                                onValueChange={(value) => setEditingConfig({ ...editingConfig, strategy: value })}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="spot" id="strategy-spot" className="text-[#FF8133]" />
                                  <Label htmlFor="strategy-spot" className="text-white">Spot</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="leverage" id="strategy-leverage" className="text-[#FF8133]" />
                                  <Label htmlFor="strategy-leverage" className="text-white">Leverage</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="custom" id="strategy-custom" className="text-[#FF8133]" />
                                  <Label htmlFor="strategy-custom" className="text-white">Custom</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          ) : (
                            <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white">
                              {selectedAgent.strategy || "Custom Strategy"}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="llm-provider" className="text-gray-400 text-sm mb-1 block">LLM Provider</Label>
                          {isEditing ? (
                            <div className="space-y-2">
                              <RadioGroup 
                                defaultValue={editingConfig.provider}
                                onValueChange={(value) => setEditingConfig({ ...editingConfig, provider: value })}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="slinky" id="provider-slinky" className="text-[#FF8133]" />
                                  <Label htmlFor="provider-slinky" className="text-white">Slinky</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="openai" id="provider-openai" className="text-[#FF8133]" />
                                  <Label htmlFor="provider-openai" className="text-white">OpenAI</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="anthropic" id="provider-anthropic" className="text-[#FF8133]" />
                                  <Label htmlFor="provider-anthropic" className="text-white">Anthropic</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          ) : (
                            <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white">
                              {selectedAgent.llmConfig.provider}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[#FF8133] mb-4 font-medium flex items-center">
                        <span className="mr-2">🔧</span> Advanced Settings
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-400 text-sm mb-1 block">Framework</Label>
                          <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white">
                            {selectedAgent.framework}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-gray-400 text-sm mb-1 block">Token Usage</Label>
                          <div className="bg-[#242B3D]/30 px-3 py-2 rounded-md border border-[#242B3D] text-white">
                            {selectedAgent.llmConfig.tokens_used} / {selectedAgent.llmConfig.tokens_limit} tokens
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 border-[#FF8133]/30 text-[#FF8133] hover:bg-[#FF8133]/10"
                          onClick={handleAdvancedConfig}
                        >
                          Advanced Configuration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAgents;
