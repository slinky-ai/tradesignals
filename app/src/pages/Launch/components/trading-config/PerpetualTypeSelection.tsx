
import React from "react";
import { Label } from "@/components/ui/label";
import { SelectionOption } from "./SelectionOption";

interface PerpetualTypeSelectionProps {
  selectedPerpetualTypes: string[];
  onPerpetualTypeChange: (perpetualTypes: string[]) => void;
}

export const PerpetualTypeSelection = ({
  selectedPerpetualTypes,
  onPerpetualTypeChange,
}: PerpetualTypeSelectionProps) => {
  const perpetualTypeOptions = [
    { 
      id: "long", 
      label: "Long", 
      icon: "📈", 
      description: "Open long positions only" 
    },
    { 
      id: "short", 
      label: "Short", 
      icon: "📉", 
      description: "Open short positions only" 
    },
    { 
      id: "both", 
      label: "Both", 
      icon: "⚖️", 
      description: "Open both long and short positions" 
    }
  ];

  const handleOptionClick = (optionId: string) => {
    const current = [...selectedPerpetualTypes];
    if (current.includes(optionId)) {
      onPerpetualTypeChange(current.filter(type => type !== optionId));
    } else {
      onPerpetualTypeChange([...current, optionId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium leading-none text-foreground mb-2 block">
        Perpetual Type
      </Label>
      <div className="flex flex-wrap gap-2">
        {perpetualTypeOptions.map((option) => (
          <SelectionOption
            key={option.id}
            id={option.id}
            label={option.label}
            icon={option.icon}
            description={option.description}
            isSelected={selectedPerpetualTypes.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
          />
        ))}
      </div>
      {selectedPerpetualTypes.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one perpetual type</p>
      )}
    </div>
  );
};
