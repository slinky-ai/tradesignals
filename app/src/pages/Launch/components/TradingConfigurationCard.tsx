
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalTypeSelection } from "./trading-config/SignalTypeSelection";
import { TradeTypeSelection } from "./trading-config/TradeTypeSelection";
import { PerpetualTypeSelection } from "./trading-config/PerpetualTypeSelection";
import { AssetSelection } from "./trading-config/AssetSelection";

interface TradingConfigurationCardProps {
  tradingConfig: {
    tradeSignalType: string[];
    tradeType: string[];
    perpetualType?: string[];
  };
  selectedAssets: string[];
  onTradingConfigChange: (config: any) => void;
  onAssetSelectionChange: (assets: string[]) => void;
}

export const TradingConfigurationCard = ({
  tradingConfig,
  selectedAssets,
  onTradingConfigChange,
  onAssetSelectionChange,
}: TradingConfigurationCardProps) => {
  const handleSignalTypeChange = (value: string[]) => {
    onTradingConfigChange({ ...tradingConfig, tradeSignalType: value });
  };

  const handleTradeTypeChange = (value: string[]) => {
    const newConfig = { ...tradingConfig, tradeType: value };
    
    // Handle perpetual type logic
    if (!value.includes("perpetual")) {
      delete newConfig.perpetualType;
    } else if (!newConfig.perpetualType || newConfig.perpetualType.length === 0) {
      newConfig.perpetualType = ["long"];
    }
    
    onTradingConfigChange(newConfig);
  };

  const handlePerpetualTypeChange = (value: string[]) => {
    onTradingConfigChange({ ...tradingConfig, perpetualType: value });
  };

  return (
    <Card className="bg-[#151A29]/80 border border-white/10">
      <CardHeader>
        <CardTitle>Trading Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your agent's trading parameters
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signal Type Selection */}
        <SignalTypeSelection 
          selectedSignalTypes={tradingConfig.tradeSignalType}
          onSignalTypeChange={handleSignalTypeChange}
        />

        {/* Trade Type Selection */}
        <TradeTypeSelection 
          selectedTradeTypes={tradingConfig.tradeType}
          onTradeTypeChange={handleTradeTypeChange}
        />

        {/* Long/Short Selection (only show if Perpetual is selected) */}
        {tradingConfig.tradeType.includes("perpetual") && (
          <PerpetualTypeSelection 
            selectedPerpetualTypes={tradingConfig.perpetualType || []}
            onPerpetualTypeChange={handlePerpetualTypeChange}
          />
        )}

        {/* Asset Selection */}
        <AssetSelection 
          selectedAssets={selectedAssets}
          onAssetSelectionChange={onAssetSelectionChange}
        />
      </CardContent>
    </Card>
  );
};
