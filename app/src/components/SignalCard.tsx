
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { getTokenIcon } from "@/pages/AgentChat/components/portfolio/utils/portfolioUtils";
import {removeLastCOrT } from "@/pages/AgentChat/components/trading/utils/signalUtils";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  signal: any;
  className?: string;
  onAnimationEnd?: () => void;
  dataSignalId?: string | number;
}

const cryptoGradients = {
  BTCUSD: "bg-gradient-to-br from-[#92400E] via-[#F97316] to-[#92400E]", // Softer orange theme
  BTCUSDC: "bg-gradient-to-br from-[#92400E] via-[#F97316] to-[#92400E]", // Softer orange theme
  BTCUSDT: "bg-gradient-to-br from-[#92400E] via-[#F97316] to-[#92400E]", // Softer orange theme

  ETHUSD: "bg-gradient-to-br from-[#483699] via-[#9b87f5] to-[#483699]", // Softer purple theme
  ETHUSDC: "bg-gradient-to-br from-[#483699] via-[#9b87f5] to-[#483699]", // Softer purple theme
  ETHUSDT: "bg-gradient-to-br from-[#483699] via-[#9b87f5] to-[#483699]", // Softer purple theme

  SOLUSD: "bg-gradient-to-br from-[#075985] via-[#0EA5E9] to-[#075985]", // Softer blue theme
  SOLUSDC: "bg-gradient-to-br from-[#075985] via-[#0EA5E9] to-[#075985]", // Softer blue theme
  SOLUSDT: "bg-gradient-to-br from-[#075985] via-[#0EA5E9] to-[#075985]", // Softer blue theme

  XRPUSD: "bg-gradient-to-br from-[#363B3E] via-[#8E9196] to-[#363B3E]", // Softer gray theme
  XRPUSDC: "bg-gradient-to-br from-[#363B3E] via-[#8E9196] to-[#363B3E]", // Softer gray theme
  XRPUSDT: "bg-gradient-to-br from-[#363B3E] via-[#8E9196] to-[#363B3E]", // Softer gray theme

  DOGE: "bg-gradient-to-br from-[#8B7E34] via-[#C3A634] to-[#8B7E34]", // Softer yellow-gold theme
};

const getRandomGradient = () => {
  const gradientKeys = Object.keys(cryptoGradients);
  const randomKey = gradientKeys[Math.floor(Math.random() * gradientKeys.length)];
  return cryptoGradients[randomKey as keyof typeof cryptoGradients];
};


const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  className = "",
  onAnimationEnd,
  dataSignalId,
}) => {
  if (!signal) return null;

  const isLong = signal?.data?.direction === "Long";
  const ticker = signal?.ticker || "N/A";
  const tokenSymbol = ticker.split('/')[0] || 'N/A';
  
  // Extract token name for gradient
  const gradientToken = tokenSymbol.toUpperCase();
  const gradientClass = cryptoGradients[gradientToken as keyof typeof cryptoGradients]

  let parseUnits;
  if(tokenSymbol.includes("BTC") || tokenSymbol.includes("ETH")) {
    parseUnits = 2
  } else {
    parseUnits = 4
  }
  
  return (
    <div
      className={`${className} w-full`}
      onAnimationEnd={onAnimationEnd}
      data-signal-id={dataSignalId}
    >
      <div className={cn(
        "p-3 md:p-5",
        "rounded-[14px] md:rounded-[14px]", 
        "relative overflow-hidden", 
        "h-[430px] md:h-[520px]", 
        gradientClass,
        "border-1 border-white/20 shadow-2xl backdrop-blur-lg",
        "transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
      )}>
        {/* Enhanced background overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col justify-between text-white">
          {/* Top section with tighter spacing */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                {/* Asset name & indicator */}
                <div className="flex items-center gap-2">
                  {tokenSymbol !== 'N/A' && (
                    <img 
                      src={getTokenIcon(tokenSymbol)} 
                      alt={`${tokenSymbol} icon`} 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">{removeLastCOrT(ticker)}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        className="bg-white/20 text-white hover:bg-white/30 transition-colors font-medium text-xs md:text-sm"
                      >
                        {signal?.indicator || "N/A"}
                      </Badge>
                      <div className="flex items-center text-xs text-white/50">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(signal?.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced direction badge */}
            <div className="flex justify-center mt-2 mb-3">
              <Badge 
                className={cn(
                  "text-lg md:text-xl px-8 py-2 rounded-xl font-bold tracking-wider uppercase",
                  isLong 
                    ? "bg-green-500/40 text-green-100 border border-green-500/50 shadow-lg shadow-green-500/20" 
                    : "bg-red-600/40 text-red-100 border border-red-500/50 shadow-lg shadow-red-500/20"
                )}
              >
                <span className="flex items-center gap-2">
                  {isLong 
                    ? <TrendingUp className="w-5 h-5 md:w-6 md:h-6" /> 
                    : <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />}
                  {isLong ? "LONG" : "SHORT"}
                </span>
              </Badge>
            </div>

            {/* Enhanced stats containers */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="backdrop-blur-sm bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
                <p className="text-white/50 text-xs md:text-sm mb-1 font-medium">Win Rate</p>
                <p className="text-white font-bold text-xl md:text-2xl">
                  {typeof signal?.data?.winRate === "number" ? `${signal?.data?.winRate.toFixed(0)}%` : "38%"}
                </p>
              </div>
              <div className="backdrop-blur-sm bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 flex flex-col justify-center items-center">
                <p className="text-white/50 text-xs md:text-sm mb-1 font-medium">Profit Factor</p>
                <p className="text-white font-bold text-xl md:text-2xl">
                  {signal?.data?.profitFactor || "1.4"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom section with refined spacing */}
          <div className="space-y-5">
            {/* Pattern name with balanced spacing */}
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center mb-4">
              {signal?.data?.pattern || "Rising Wedge"}
            </h2>

            {/* Enhanced Entry/Target/Stop/Current grid */}
            <div className="grid grid-cols-1 gap-4 rounded-xl overflow-hidden backdrop-blur-sm bg-black/30 p-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Entry */}
                <div className="flex flex-col items-center">
                  <p className="text-white/50 text-xs md:text-sm mb-2 font-medium">Entry</p>
                  <p className="text-white font-bold text-xl md:text-md">
                    {typeof signal?.entry === "number"
                      ? signal.entry.toFixed(parseUnits)
                      : Number(signal.entry).toFixed(parseUnits) }
                  </p>
                </div>

                {/* Target */}
                <div className="flex flex-col items-center">
                  <p className="text-white/50 text-xs md:text-sm mb-2 font-medium">Target</p>
                  <p className="text-green-400 font-bold text-xl md:text-md">
                    {typeof signal?.data?.t1 === "number"
                      ? signal?.data?.t1.toFixed(parseUnits)
                      : Number(signal?.data?.t1).toFixed(parseUnits) }
                  </p>
                </div>

                {/* Stop Loss */}
                <div className="flex flex-col items-center">
                  <p className="text-white/50 text-xs md:text-sm mb-2 font-medium">Stop Loss</p>
                  <p className="text-red-400 font-bold text-xl md:text-md">
                    {signal?.stop ? Number(signal.stop).toFixed(parseUnits) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Current Price Row */}
              <div className="pt-3 mt-2 border-t border-white/10">
                <div className="flex flex-col items-center">
                  <p className="text-white/50 text-xs md:text-sm mb-2 font-medium">Current</p>
                  <p className="text-white font-bold text-xl md:text-md">
                    {typeof signal?.price === "number"
                      ? signal.price.toFixed(parseUnits)
                      : Number(signal.price).toFixed(parseUnits) }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
