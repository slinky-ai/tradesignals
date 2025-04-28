
import React from "react";
import { Label } from "@/components/ui/label";
import { Gauge, TrendingUp, SlidersHorizontal, ChartBar, Activity } from "lucide-react";

interface Indicator {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface IndicatorSelectorProps {
  assetId: string;
  selectedIndicators: Array<{ assetId: string; id: string; timeframe: string[] }>;
  onIndicatorToggle: (assetId: string, indicatorId: string) => void;
  children?: (indicatorId: string) => React.ReactNode;
}

export const IndicatorSelector = ({
  assetId,
  selectedIndicators,
  onIndicatorToggle,
  children
}: IndicatorSelectorProps) => {
  const indicators: Indicator[] = [
    { id: "rsi", label: "Relative Strength Index (RSI)", icon: <Gauge className="h-4 w-4 mr-2" /> },
    { id: "macd", label: "Moving Average Convergence Divergence (MACD)", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
    { id: "bollinger", label: "Bollinger Bands", icon: <SlidersHorizontal className="h-4 w-4 mr-2" /> },
    { id: "volume", label: "Volume", icon: <ChartBar className="h-4 w-4 mr-2" /> },
    { id: "ema", label: "Exponential Moving Average (EMA)", icon: <Activity className="h-4 w-4 mr-2" /> },
  ];

  const isIndicatorSelected = (indicatorId: string) => {
    return selectedIndicators.some(ind => ind.id === indicatorId);
  };

  return (
    <div className="pl-8 space-y-4">
      <div className="text-sm font-medium mb-2">Add Indicators</div>
      
      {indicators.map((indicator) => {
        const selected = isIndicatorSelected(indicator.id);
        return (
          <div key={indicator.id} className="space-y-4">
            <div 
              className={`bg-black flex items-center space-x-4 rounded-lg border p-4 hover:bg-[#FF8133]/10 transition-colors cursor-pointer ${
                selected ? "bg-[#FF8133]/15 border-[#FF8133]/10" : "border-white/10"
              }`}
              onClick={() => onIndicatorToggle(assetId, indicator.id)}
            >
              <div className="h-4 w-4 rounded-full border border-primary relative">
                {selected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <Label className="text-sm font-medium flex items-center gap-1">
                  {indicator.icon}
                  {indicator.label}
                </Label>
              </div>
            </div>

            {/* Render timeframe selector if the indicator is selected */}
            {selected && children && children(indicator.id)}
          </div>
        );
      })}
    </div>
  );
};
