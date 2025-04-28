
import React from "react";
import { Label } from "@/components/ui/label";

interface AssetPair {
  id: string;
  label: string;
  icon: string;
  description: string;
  tag: string;
  change: string;
  trend: "up" | "down";
}

interface AssetPairItemProps {
  pair: AssetPair;
  isSelected: boolean;
  onAssetPairToggle: (pairId: string) => void;
  onAssetExpand: (pairId: string) => void;
  isExpanded: boolean;
  children?: React.ReactNode;
}

export const AssetPairItem = ({
  pair,
  isSelected,
  onAssetPairToggle,
  onAssetExpand,
  isExpanded,
  children
}: AssetPairItemProps) => {
  return (
    <div className="space-y-4">
      <div 
        className={`bg-black flex items-center space-x-4 rounded-lg border p-4 hover:bg-[#FF8133]/10 transition-colors cursor-pointer ${
          isSelected ? "bg-[#FF8133]/15 border-[#FF8133]/10" : "border-white/10"
        }`}
        onClick={() => onAssetPairToggle(pair.id)}
      >
        <div className="h-4 w-4 rounded-full border border-primary relative">
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <Label htmlFor={pair.id} className="text-base font-semibold flex items-center gap-2">
            <span>{pair.icon}</span>
            <span>{pair.label}</span>
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {pair.description}
            </p>
            <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {pair.tag}
            </span>
          </div>
        </div>
      </div>
      
      {isSelected && children}
    </div>
  );
};
