
export const getStrategyDescription = (strategy: string): string => {
  const descriptions: Record<string, string> = {
    'CEX Spot Trading': 'Automatically executes spot trades on centralized exchanges using advanced algorithms and real-time market data analysis',
    'Grid Trading': 'Implements a grid trading strategy that places multiple buy and sell orders at regular price intervals to profit from market volatility',
    'DCA Trading': 'Executes Dollar Cost Averaging strategy by making regular purchases at set intervals to reduce impact of volatility',
    'Signal-based Trading': 'Uses technical indicators and market signals to identify and execute trading opportunities',
    'Momentum Trading': 'Capitalizes on market momentum by identifying and trading strong price trends'
  };
  return descriptions[strategy] || 'Custom trading strategy';
};

export const getTradingParameters = (strategy: string) => {
  const baseParams = {
    maxTradeSize: 1000,
    stopLoss: 5,
    takeProfit: 10,
    leverageEnabled: false,
    riskLevel: "medium",
  };

  const strategySpecificParams: Record<string, any> = {
    'Grid Trading': {
      ...baseParams,
      gridLevels: 5,
      gridSpacing: 2,
    },
    'DCA Trading': {
      ...baseParams,
      interval: "daily",
      purchaseAmount: 100,
    },
    'Signal-based Trading': {
      ...baseParams,
      indicators: ["RSI", "MACD", "MA"],
      timeframe: "4h",
    },
    'Momentum Trading': {
      ...baseParams,
      momentumPeriod: 14,
      trendStrengthThreshold: 25,
    },
  };

  return strategySpecificParams[strategy] || baseParams;
};
