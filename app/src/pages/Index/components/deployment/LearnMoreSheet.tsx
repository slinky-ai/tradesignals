
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AgentLearnMore } from "../AgentLearnMore";
import { Agent } from "../../types";

interface LearnMoreSheetProps {
  agent: Agent;
}

export const LearnMoreSheet = ({ agent }: LearnMoreSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 border-[#FF8133] text-[#FF8133] hover:bg-[#FF8133] hover:text-white"
        >
          Learn More
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <AgentLearnMore agent={agent} />
      </SheetContent>
    </Sheet>
  );
};
