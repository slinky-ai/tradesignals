
import React from "react";
import { Label } from "@/components/ui/label";
import { SelectionOption } from "./SelectionOption";

interface AssetSelectionProps {
  selectedAssets: string[];
  onAssetSelectionChange: (assets: string[]) => void;
}

export const AssetSelection = ({
  selectedAssets,
  onAssetSelectionChange,
}: AssetSelectionProps) => {
  const availableAssets = [
    "BTC/USDT",
    "ETH/USDT",
    "SOL/USDT",
    "XRP/USDT",
    "DOGE/USDT",
    "SHIB/USDT",
  ];

  const handleAssetToggle = (asset: string) => {
    if (selectedAssets.includes(asset)) {
      onAssetSelectionChange(selectedAssets.filter((a) => a !== asset));
    } else {
      onAssetSelectionChange([...selectedAssets, asset]);
    }
  };

  const getAssetIcon = (asset: string) => {
    const icons: Record<string, string> = {
      "BTC/USDT": "₿",
      "ETH/USDT": "Ξ",
      "SOL/USDT": "◎",
      "XRP/USDT": "✗",
      "DOGE/USDT": "Ð",
      "SHIB/USDT": "🐕",
    };
    return icons[asset] || "💱";
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium leading-none text-foreground mb-2 block">
        Select Assets to Trade
      </Label>
      <div className="flex flex-wrap gap-2">
        {availableAssets.map((asset) => (
          <SelectionOption
            key={asset}
            id={asset}
            label={asset}
            icon={getAssetIcon(asset)}
            description={`Trade ${asset.split('/')[0]} against ${asset.split('/')[1]}`}
            isSelected={selectedAssets.includes(asset)}
            onClick={() => handleAssetToggle(asset)}
          />
        ))}
      </div>
      {selectedAssets.length === 0 && (
        <p className="text-sm text-red-500">Please select at least one asset</p>
      )}
    </div>
  );
};
