
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";
import { AssetPairItem } from "./asset-selection/AssetPairItem";
import { IndicatorSelector } from "./asset-selection/IndicatorSelector";
import { TimeframeSelector } from "./asset-selection/TimeframeSelector";
import { assetPairs } from "./asset-selection/assetData";

interface AssetPairSelectionCardProps {
  selectedAssetPairs: string[];
  onAssetPairsChange: (pairs: string[]) => void;
  selectedIndicators?: Array<{
    assetId: string;
    id: string;
    timeframe: string[];
  }>;
  onIndicatorsChange?: (indicators: Array<{
    assetId: string;
    id: string;
    timeframe: string[];
  }>) => void;
}

export const AssetPairSelectionCard = ({ 
  selectedAssetPairs, 
  onAssetPairsChange,
  selectedIndicators = [],
  onIndicatorsChange = () => {}
}: AssetPairSelectionCardProps) => {
  const [expandedAssets, setExpandedAssets] = useState<{ [key: string]: boolean }>({});

  const handleAssetPairToggle = (pairId: string) => {
    if (selectedAssetPairs.includes(pairId)) {
      // When deselecting an asset pair, also remove its indicators
      if (selectedIndicators.some(ind => ind.assetId === pairId)) {
        onIndicatorsChange(selectedIndicators.filter(ind => ind.assetId !== pairId));
      }
      onAssetPairsChange(selectedAssetPairs.filter(p => p !== pairId));
    } else {
      onAssetPairsChange([...selectedAssetPairs, pairId]);
    }
  };

  const handleAssetExpand = (pairId: string) => {
    setExpandedAssets(prev => ({
      ...prev,
      [pairId]: !prev[pairId]
    }));
  };

  const handleIndicatorToggle = (assetId: string, indicatorId: string) => {
    const indicatorExists = selectedIndicators.some(
      ind => ind.assetId === assetId && ind.id === indicatorId
    );
    
    if (indicatorExists) {
      onIndicatorsChange(selectedIndicators.filter(
        ind => !(ind.assetId === assetId && ind.id === indicatorId)
      ));
    } else {
      onIndicatorsChange([
        ...selectedIndicators, 
        { assetId, id: indicatorId, timeframe: ["1hr"] }
      ]);
    }
  };

  const handleTimeframeToggle = (assetId: string, indicatorId: string, timeframeValue: string) => {
    const indicator = selectedIndicators.find(
      ind => ind.assetId === assetId && ind.id === indicatorId
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
      (ind.assetId === assetId && ind.id === indicatorId)
        ? { ...ind, timeframe: updatedTimeframes } 
        : ind
    );
    
    onIndicatorsChange(updatedIndicators);
  };

  // Get indicators for a specific asset pair
  const getAssetIndicators = (assetId: string) => {
    return selectedIndicators.filter(ind => ind.assetId === assetId);
  };

  return (
    <Card className="bg-[#151A29]/80 border border-white/10">
      <CardHeader>
        <CardTitle>Select Asset Pairs & Indicators</CardTitle>
        <CardDescription>
          Choose the asset pairs your agent will monitor and add technical indicators with timeframes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assetPairs.map((pair) => (
            <AssetPairItem
              key={pair.id}
              pair={pair}
              isSelected={selectedAssetPairs.includes(pair.id)}
              onAssetPairToggle={handleAssetPairToggle}
              onAssetExpand={handleAssetExpand}
              isExpanded={!!expandedAssets[pair.id]}
            >
              {selectedAssetPairs.includes(pair.id) && (
                <IndicatorSelector
                  assetId={pair.id}
                  selectedIndicators={getAssetIndicators(pair.id)}
                  onIndicatorToggle={(_, indicatorId) => handleIndicatorToggle(pair.id, indicatorId)}
                >
                  {(indicatorId) => (
                    <TimeframeSelector
                      indicatorId={indicatorId}
                      selectedIndicators={getAssetIndicators(pair.id)}
                      onTimeframeToggle={(indicatorId, timeframeValue) => 
                        handleTimeframeToggle(pair.id, indicatorId, timeframeValue)
                      }
                    />
                  )}
                </IndicatorSelector>
              )}
            </AssetPairItem>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
