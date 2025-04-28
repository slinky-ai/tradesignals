
import { Bot, Activity, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatsOverviewProps } from "../types";

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 border border-white/10">
        <div className="flex items-center space-x-4 relative">
            <div className="p-3 bg-[#FF8133]/20 rounded-lg mr-3 shadow-inner self-center">
              <Bot className="w-7 h-7 text-[#FF8133] animate-bounce-subtle" />
            </div>
          <div>
            <p className="text-sm text-white/60">Total Agents</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 border border-white/10">
        <div className="flex items-center space-x-4 relative">
          <div className="p-3 rounded-xl bg-green-500/80">
            <Activity className="h-6 w-6 text-white animate-bounce-subtle" />
          </div>
          <div>
            <p className="text-sm text-white/60">Active Agents</p>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 border border-white/10">
        <div className="flex items-center space-x-4 relative">
          <div className="p-3 rounded-xl bg-red-500/80">
            <Pause className="h-6 w-6 text-white animate-bounce-subtle" />
          </div>
          <div>
            <p className="text-sm text-white/60">Inactive Agents</p>
            <p className="text-2xl font-bold text-white">{stats.inactive}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
