
import { Rabbit } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="relative pt-12">
      <div className="relative">
        <div className="h-2 bg-[#FF8133]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF8133] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div 
          className="absolute top-0 left-0 w-full"
          style={{ transform: `translateX(calc(${percentage}% - ${percentage > 0 ? '12px' : '0px'}))` }}
        >
          <div className="absolute -top-8">
            <Rabbit 
              className="text-[#FF8133] animate-bounce-subtle"
              size={24}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground text-center">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};
