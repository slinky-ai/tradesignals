
import React from "react";
import { Label } from "@/components/ui/label";
import { SelectionOption } from "./SelectionOption";

interface SignalTypeSelectionProps {
  selectedSignalTypes: string[];
  onSignalTypeChange: (signalTypes: string[]) => void;
}

export const SignalTypeSelection = ({
  selectedSignalTypes,
  onSignalTypeChange,
}: SignalTypeSelectionProps) => {
  const signalTypeOptions = [
    { 
      id: "ai", 
      label: "AI Signals", 
      icon: "✨", 
      description: "Trade using AI-generated Signals" 
    },
    { 
      id: "algorithmic", 
      label: "Algorithmic Signals", 
      icon: "📊", 
      description: "Trade using Algorithmic Signals" 
    },
    { 
      id: "both", 
      label: "Both", 
      icon: "🔄", 
      description: "Combine AI & Algorithmic Signals" 
    }
  ];

  const handleOptionClick = (optionId: string) => {
    const current = [...selectedSignalTypes];
    if (current.includes(optionId)) {
      onSignalTypeChange(current.filter(type => type !== optionId));
    } else {
      onSignalTypeChange([...current, optionId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium leading-none text-foreground mb-2 block">
        How do you want to trade?
      </Label>
      <div className="flex flex-wrap gap-2">
        {signalTypeOptions.map((option) => (
          <SelectionOption
            key={option.id}
            id={option.id}
            label={option.label}
            icon={option.icon}
            description={option.description}
            isSelected={selectedSignalTypes.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
            // className="w-120 h-25"
          />
        ))}
      </div>
      {selectedSignalTypes.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one signal type</p>
      )}
    </div>
  );
};
