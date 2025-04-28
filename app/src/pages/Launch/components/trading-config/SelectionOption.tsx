
import React from "react";
import { Label } from "@/components/ui/label";

interface SelectionOptionProps {
  id: string;
  label: string;
  icon: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  tag?: string;
}

export const SelectionOption = ({
  id,
  label,
  icon,
  description,
  isSelected,
  onClick,
  className,
  disabled = false,
  tag
}: SelectionOptionProps) => {
  return (
    <div 
      key={id} 
      className={`bg-black 
        flex flex-none items-center space-x-4 rounded-lg border p-4 transition-colors 
        ${disabled 
          ? "opacity-20 cursor-not-allowed border-white/5" 
          : "cursor-pointer " + (isSelected 
              // ? "bg-[#FF8133]/15 border-[#FF8133]/10 " 
              ? "bg-[#FF8133]/15 border-[#FF8133]/10 " 
              // ? "border-[#FF8133]/50 hover:bg-[#FF8133]/5"
              : "border-white/10 hover:bg-[#FF8133]/5")}
        ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="h-4 w-4 rounded-full border border-primary relative">
        {isSelected && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <Label htmlFor={id} className="text-base font-semibold flex items-center gap-2">
          <span>{icon}</span>
          <span>{label}</span>
        </Label>
        <div className="flex items-center gap-2">
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
          {tag && (
            <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
