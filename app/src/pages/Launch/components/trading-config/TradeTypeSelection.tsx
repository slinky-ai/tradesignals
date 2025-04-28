
import React from "react";
import { Label } from "@/components/ui/label";
import { SelectionOption } from "./SelectionOption";

interface TradeTypeSelectionProps {
  selectedTradeTypes: string[];
  onTradeTypeChange: (tradeTypes: string[]) => void;
}

export const TradeTypeSelection = ({
  selectedTradeTypes,
  onTradeTypeChange,
}: TradeTypeSelectionProps) => {
  const tradeTypeOptions = [
    { 
      id: "spot", 
      label: "Spot", 
      icon: "💰", 
      description: "Trade directly on spot markets",
      tag: "Most Popular"
    },
    { 
      id: "perpetual", 
      label: "Perpetual", 
      icon: "⚡", 
      description: "Trade perpetual futures contracts",
      tag: "Advanced"
    }
  ];

  const handleOptionClick = (optionId: string) => {
    const current = [...selectedTradeTypes];
    if (current.includes(optionId)) {
      onTradeTypeChange(current.filter(type => type !== optionId));
    } else {
      onTradeTypeChange([...current, optionId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium leading-none text-foreground mb-2 block">
        Trade Type
      </Label>
      <div className="flex flex-wrap gap-2">
        {tradeTypeOptions.map((option) => (
          <SelectionOption
            key={option.id}
            id={option.id}
            label={option.label}
            icon={option.icon}
            description={option.description}
            isSelected={selectedTradeTypes.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
            tag={option.tag}
          />
        ))}
      </div>
      {selectedTradeTypes.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one trade type</p>
      )}
    </div>
  );
};
