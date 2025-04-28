
import { Activity, Calendar, Clock, Sparkle, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ActivitySectionProps {
  createdAt: string | null;
}

export const ActivitySection = ({ createdAt }: ActivitySectionProps) => {
  return (
    <Card className="relative p-6 overflow-hidden bg-[#151A29]/80 backdrop-blur-xl border border-white/10">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 right-0 transform -translate-y-1/2">
        <Star className="w-24 h-24 text-[#FF8133]/10" />
      </div>
      <div className="absolute bottom-0 left-0">
        <Sparkle className="w-16 h-16 text-[#FF8133]/10" />
      </div> */}

      <div className="flex items-center gap-4 mb-6 relative">
        <div className="p-3 rounded-xl bg-[#FF8133]/10">
          <Activity className="h-5 w-5 text-white animate-bounce-subtle" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Activity</h2>
          <p className="text-sm text-white/60">Recent updates</p>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <Calendar className="h-4 w-4 text-[#FF8133]" />
            <p className="text-sm text-white/60">Member Since</p>
          </div>
          <p className="font-medium text-white">{createdAt || 'Loading...'}</p>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <Clock className="h-4 w-4 text-[#FF8133]" />
            <p className="text-sm text-white/60">Last Active</p>
          </div>
          <p className="font-medium text-white">2 hours ago</p>
        </div>
      </div>
    </Card>
  );
};
