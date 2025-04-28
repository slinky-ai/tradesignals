
import React from "react";
import { Activity, ChartBar, TrendingUp, Gauge, SlidersHorizontal } from "lucide-react";

export interface Indicator {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface Timeframe {
  value: string;
  label: string;
}

// Create icon elements as functions that return ReactNode
const createGaugeIcon = () => <Gauge className="h-4 w-4 mr-2" />;
const createTrendingUpIcon = () => <TrendingUp className="h-4 w-4 mr-2" />;
const createSlidersHorizontalIcon = () => <SlidersHorizontal className="h-4 w-4 mr-2" />;
const createChartBarIcon = () => <ChartBar className="h-4 w-4 mr-2" />;
const createActivityIcon = () => <Activity className="h-4 w-4 mr-2" />;

export const indicators: Indicator[] = [
  { id: "rsi", label: "Relative Strength Index (RSI)", icon: createGaugeIcon() },
  { id: "macd", label: "Moving Average Convergence Divergence (MACD)", icon: createTrendingUpIcon() },
  { id: "bollinger", label: "Bollinger Bands", icon: createSlidersHorizontalIcon() },
  { id: "volume", label: "Volume", icon: createChartBarIcon() },
  { id: "ema", label: "Exponential Moving Average (EMA)", icon: createActivityIcon() },
];

export const timeframes: Timeframe[] = [
  { value: "1min", label: "1 min" },
  { value: "5min", label: "5 min" },
  { value: "15min", label: "15 min" },
  { value: "45min", label: "45 min" },
  { value: "1hr", label: "1 hour" },
  { value: "4hr", label: "4 hours" },
  { value: "1day", label: "1 day" },
];
