
import React from "react";
import { Label } from "@/components/ui/label";
import { Indicator } from "./indicatorData";

interface IndicatorItemProps {
  indicator: Indicator;
  isSelected: boolean;
  onIndicatorToggle: (indicatorId: string) => void;
  children?: React.ReactNode;
}

export const IndicatorItem = ({
  indicator,
  isSelected,
  onIndicatorToggle,
  children
}: IndicatorItemProps) => {
  return (
    <div className="space-y-4">
      <div 
        className={`bg-black flex flex-col rounded-lg border p-4 transition-colors ${
          isSelected ? `bg-[#FEC6A1]/10 border-[#FEC6A1]/30` : "border-white/5 hover:bg-white/5"
        }`}
      >
        <div 
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => onIndicatorToggle(indicator.id)}
        >
          <div className="h-4 w-4 rounded-full border border-white/50 relative">
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FEC6A1]" />
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {indicator.icon}
            <Label htmlFor={indicator.id} className="text-base font-medium cursor-pointer">
              {indicator.label}
            </Label>
          </div>
        </div>

        {/* Render children (timeframe selector) if indicator is selected */}
        {isSelected && children}
      </div>
    </div>
  );
};
