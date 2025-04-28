
import React from "react";
import { Clock } from "lucide-react";
import { timeframes } from "./indicatorData";

interface TimeframeSelectorProps {
  indicatorId: string;
  selectedIndicators: Array<{ assetId: string; id: string; timeframe: string[] }>;
  onTimeframeToggle: (indicatorId: string, timeframeValue: string) => void;
}

export const TimeframeSelector = ({
  indicatorId,
  selectedIndicators,
  onTimeframeToggle
}: TimeframeSelectorProps) => {
  // Get the timeframes for this specific indicator
  const selectedTimeframes = selectedIndicators.find(ind => ind.id === indicatorId)?.timeframe || [];
  
  return (
    <div className="mt-3 ml-8 border-t border-white/10 pt-3">
      <div className="flex items-center mb-2">
        <Clock className="h-3.5 w-3.5 mr-1.5 text-white/70" />
        <span className="text-xs text-white/70">Select timeframes:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeframes.map((timeframe) => (
          <button
            key={`${indicatorId}-${timeframe.value}`}
            onClick={() => onTimeframeToggle(indicatorId, timeframe.value)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all
              ${selectedTimeframes.includes(timeframe.value) 
                ? `bg-[#FEC6A1] text-black` 
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"}
            `}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
};
