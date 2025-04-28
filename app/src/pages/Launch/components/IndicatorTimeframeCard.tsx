
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { IndicatorItem } from "./indicators/IndicatorItem";
import { TimeframeSelector } from "./indicators/TimeframeSelector";
import { indicators } from "./indicators/indicatorData";

interface IndicatorTimeframeCardProps {
  selectedIndicators: Array<{
    assetId: string;
    id: string;
    timeframe: string[];
  }>;
  onIndicatorsChange: (indicators: Array<{
    assetId: string;
    id: string;
    timeframe: string[];
  }>) => void;
  selectedAssetId?: string;
}

export const IndicatorTimeframeCard = ({
  selectedIndicators,
  onIndicatorsChange,
  selectedAssetId = "global"
}: IndicatorTimeframeCardProps) => {
  const handleIndicatorToggle = (indicatorId: string) => {
    const indicatorExists = selectedIndicators.some(
      ind => ind.assetId === selectedAssetId && ind.id === indicatorId
    );
    
    if (indicatorExists) {
      onIndicatorsChange(
        selectedIndicators.filter(ind => !(ind.assetId === selectedAssetId && ind.id === indicatorId))
      );
    } else {
      onIndicatorsChange([
        ...selectedIndicators, 
        { assetId: selectedAssetId, id: indicatorId, timeframe: ["1hr"] }
      ]);
    }
  };

  const handleTimeframeToggle = (indicatorId: string, timeframeValue: string) => {
    const indicator = selectedIndicators.find(
      ind => ind.assetId === selectedAssetId && ind.id === indicatorId
    );
    
    if (!indicator) return;
    
    const updatedTimeframes = indicator.timeframe.includes(timeframeValue)
      ? indicator.timeframe.filter(t => t !== timeframeValue)
      : [...indicator.timeframe, timeframeValue];
    
    // Ensure we always have at least one timeframe selected
    if (updatedTimeframes.length === 0) {
      return;
    }
    
    const updatedIndicators = selectedIndicators.map(ind => 
      (ind.assetId === selectedAssetId && ind.id === indicatorId) 
        ? { ...ind, timeframe: updatedTimeframes } 
        : ind
    );
    
    onIndicatorsChange(updatedIndicators);
  };

  const isIndicatorSelected = (indicatorId: string) => {
    return selectedIndicators.some(
      ind => ind.assetId === selectedAssetId && ind.id === indicatorId
    );
  };

  // Filter indicators for the current asset
  const assetIndicators = selectedIndicators.filter(ind => ind.assetId === selectedAssetId);

  return (
    <Card className="bg-[#151A29]/80 border border-white/10">
      <CardHeader>
        <CardTitle>Select Technical Indicators</CardTitle>
        <CardDescription>
          Choose technical indicators and set timeframes for your trading agent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-base mb-3 block">Technical Indicators</Label>
            <div className="space-y-4">
              {indicators.map((indicator) => (
                <IndicatorItem
                  key={indicator.id}
                  indicator={indicator}
                  isSelected={isIndicatorSelected(indicator.id)}
                  onIndicatorToggle={handleIndicatorToggle}
                >
                  {isIndicatorSelected(indicator.id) && (
                    <TimeframeSelector
                      indicatorId={indicator.id}
                      selectedIndicators={assetIndicators}
                      onTimeframeToggle={handleTimeframeToggle}
                    />
                  )}
                </IndicatorItem>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
