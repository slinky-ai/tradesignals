
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface GroupedCellProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const GroupedCell: React.FC<GroupedCellProps> = ({ 
  title, 
  className, 
  children,
  highlight = false,
  icon
}) => {
  return (
    <div className={cn(
      "space-y-1", 
      highlight && "bg-primary/5 p-2 rounded-md border border-primary/10",
      className
    )}>
      {title && (
        <div className={cn(
          "text-xs flex items-center gap-1.5",
          highlight ? "text-primary/80" : "text-gray-400"
        )}>
          {icon && icon}
          {title}
        </div>
      )}
      <div className={cn(
        highlight && "font-medium"
      )}>
        {children}
      </div>
    </div>
  );
};
