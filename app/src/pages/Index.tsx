
import { AgentCard } from "./Index/components/AgentCard";
import { Header } from "./Index/components/Header";
import { agents } from "./Index/data/agents";

interface IndexProps {
  walletAddress: string;
}

const Index = ({ walletAddress }: IndexProps) => {
  return (
    <div className="min-h-screen bg-[#0B0F1C] relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 relative">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <div 
              key={agent.id} 
              className="animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transform: `rotate(${Math.random() * 1 - 0.5}deg)`
              }}
            >
              <AgentCard 
                agent={agent} 
                walletAddress={walletAddress}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
