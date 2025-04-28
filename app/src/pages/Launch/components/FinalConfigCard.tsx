
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FinalConfigCardProps {
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
}

export const FinalConfigCard = ({ selectedStrategy, onStrategyChange }: FinalConfigCardProps) => {
  return (
    <Card className="bg-[#151A29]/90 border border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-white">Trading Parameters</CardTitle>
        <CardDescription className="text-gray-400">
          Choose your preferred trading strategy and risk tolerance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StrategyCard 
            id="degen"
            title="Degen Trader"
            description="Aggressive trading with high risk tolerance. Aims for maximum gains with less concern for drawdowns."
            riskLevel="High Risk"
            riskColor="text-red-500 bg-red-500/10"
            isSelected={selectedStrategy === "degen"}
            onClick={() => onStrategyChange("degen")}
          />

          <StrategyCard 
            id="conviction"
            title="Conviction Trader"
            description="Takes calculated risks based on strong market signals and thorough analysis."
            riskLevel="Medium Risk"
            riskColor="text-yellow-500 bg-yellow-500/10"
            isSelected={selectedStrategy === "conviction"}
            onClick={() => onStrategyChange("conviction")}
          />

          <StrategyCard 
            id="conservative"
            title="Conservative"
            description="Prioritizes capital preservation with strict risk management and moderate returns."
            riskLevel="Low Risk"
            riskColor="text-green-500 bg-green-500/10"
            isSelected={selectedStrategy === "conservative"}
            onClick={() => onStrategyChange("conservative")}
          />

          <StrategyCard 
            id="swing"
            title="Swing Trader"
            description="Captures medium to long-term market moves with balanced risk-reward ratios."
            riskLevel="Medium Risk"
            riskColor="text-blue-500 bg-blue-500/10"
            isSelected={selectedStrategy === "swing"}
            onClick={() => onStrategyChange("swing")}
          />

          <StrategyCard 
            id="momentum"
            title="Momentum Trader"
            description="Follows market trends and momentum with dynamic position sizing."
            riskLevel="Medium-High Risk"
            riskColor="text-purple-500 bg-purple-500/10"
            isSelected={selectedStrategy === "momentum"}
            onClick={() => onStrategyChange("momentum")}
          />

          <StrategyCard 
            id="arbitrage"
            title="Arbitrage"
            description="Exploits price differences across markets with quick execution."
            riskLevel="Low-Medium Risk"
            riskColor="text-cyan-500 bg-cyan-500/10"
            isSelected={selectedStrategy === "arbitrage"}
            onClick={() => onStrategyChange("arbitrage")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StrategyCardProps {
  id: string;
  title: string;
  description: string;
  riskLevel: string;
  riskColor: string;
  isSelected: boolean;
  onClick: () => void;
}

const StrategyCard = ({ 
  id, 
  title, 
  description, 
  riskLevel, 
  riskColor,
  isSelected,
  onClick
}: StrategyCardProps) => (
  <div 
    className={`relative rounded-lg p-5 cursor-pointer transition-all duration-200 h-full flex ${
      isSelected 
        ? 'bg-black border-[#FF8133] border-2' 
        : 'bg-black/30 border border-white/10 hover:border-white/30'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start mr-3 mt-1">
      <div className={`w-5 h-5 rounded-full border ${isSelected ? 'border-[#FF8133]' : 'border-gray-500'} flex items-center justify-center`}>
        {isSelected && <div className="w-3 h-3 rounded-full bg-[#FF8133]"></div>}
      </div>
    </div>
    
    <div className="space-y-3 flex-1">
      <h3 className="font-bold text-xl text-white">{title}</h3>
      
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${riskColor}`}>
        {riskLevel}
      </div>
      
      <p className="text-gray-400 text-sm">
        {description}
      </p>
    </div>
  </div>
);
