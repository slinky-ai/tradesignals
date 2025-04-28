
import { Bot, Sparkle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { StatsOverviewProps } from "@/pages/MyAgents/types";

interface AgentsStatsProps {
  stats: StatsOverviewProps['stats'];
}

export const AgentsStats = ({ stats }: AgentsStatsProps) => {
  const agentData = [
    { name: 'Active', value: stats.active, color: '#FF8133' },
    { name: 'Inactive', value: stats.inactive, color: '#1f2937' }
  ];

  return (
    <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 border border-white/10">
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="p-3 rounded-xl bg-[#FF8133]/10">
          <Bot className="h-5 w-5 text-white animate-bounce-subtle" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">My Agents</h2>
          <p className="text-sm text-white/60">Deployment overview</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 relative">
        <div className="relative">
          <PieChart width={200} height={200}>
            <Pie
              data={agentData}
              cx={100}
              cy={100}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {agentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/60">Total</p>
          </div>
          <div className="absolute top-0 right-0">
            <Sparkle className="w-6 h-6 text-[#FF8133] animate-bounce-subtle" />
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF8133]" />
              <span className="text-sm text-white/60">Active Agents</span>
            </div>
            <span className="font-medium text-white">{stats.active}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#1f2937]" />
              <span className="text-sm text-white/60">Inactive Agents</span>
            </div>
            <span className="font-medium text-white">{stats.inactive}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
