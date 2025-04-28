
import React from "react";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

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
  const timeframes = [
    { value: "1min", label: "1 min" },
    { value: "5min", label: "5 min" },
    { value: "15min", label: "15 min" },
    { value: "45min", label: "45 min" },
    { value: "1hr", label: "1 hour" },
    { value: "4hr", label: "4 hours" },
    { value: "1day", label: "1 day" },
  ];

  const isTimeframeSelected = (indicatorId: string, timeframeValue: string) => {
    const indicator = selectedIndicators.find(ind => ind.id === indicatorId);
    return indicator?.timeframe.includes(timeframeValue) || false;
  };

  return (
    <div className="pl-8 space-y-2">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Select timeframes:
        </Label>
        <div className="flex flex-wrap gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={`${indicatorId}-${timeframe.value}`}
              onClick={() => onTimeframeToggle(indicatorId, timeframe.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all
                ${isTimeframeSelected(indicatorId, timeframe.value) 
                  ? `bg-[#FF8133]/10 text-white` 
                  : "bg-black border border-white/10 text-white/70 hover:bg-white/5"}
              `}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
