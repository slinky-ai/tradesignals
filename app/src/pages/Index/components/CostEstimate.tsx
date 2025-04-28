
interface CostEstimateProps {
  basePrice: number;
  llmPrice?: number;
  operators?: string[];
}

export const CostEstimate = ({ basePrice, llmPrice, operators }: CostEstimateProps) => {
  const operatorMultiplier = operators?.length || 1;
  const totalCost = (llmPrice !== undefined ? basePrice + llmPrice : basePrice) * operatorMultiplier;

  return (
    <div className="absolute top-4 right-[48px] bg-green-100 rounded-full px-3 py-1.5 shadow-sm border border-green-200">
      <span className="text-sm font-semibold text-green-800">${totalCost}</span>
    </div>
  );
};
