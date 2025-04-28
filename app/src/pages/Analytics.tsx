
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AgentMetricsCard } from "./Analytics/components/AgentMetricsCard";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const [agentMetrics, setAgentMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([
    { name: "Jan", value: 100 },
    { name: "Feb", value: 120 },
    { name: "Mar", value: 150 },
    { name: "Apr", value: 180 },
    { name: "May", value: 220 },
    { name: "Jun", value: 250 },
  ]);

  useEffect(() => {
    const fetchAgentMetrics = async () => {
      const { data: agents, error } = await supabase
        .from('deployed_agents')
        .select(`
          id,
          name,
          compute_metrics,
          tee_proofs
        `);

      if (error) {
        console.error('Error fetching agent metrics:', error);
        return;
      }

      if (agents) {
        setAgentMetrics(agents);
      }
      setIsLoading(false);
    };

    fetchAgentMetrics();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Analytics Overview</h1>
        <p className="text-secondary-foreground">Track your agents' performance and security status</p>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <p className="text-muted-foreground">Loading agent metrics...</p>
          ) : agentMetrics.length > 0 ? (
            agentMetrics.map((agent) => (
              <AgentMetricsCard
                key={agent.id}
                metrics={{
                  name: agent.name,
                  computeMetrics: agent.compute_metrics,
                  teeProofs: agent.tee_proofs
                }}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No agent metrics available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
