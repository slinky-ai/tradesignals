
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TradeForm, { PlaceTradeFormValues } from "@/components/TradeForm";
import { makeTestTrade, testCancelTrades, testCloseAllTrades, testOpenTrades } from "@/integrations/api/server";

const PlaceTrade: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    currentSignal, 
    currentIndex = 0, 
    signals = [],
    appId,
    agentId
  } = location.state || {};


  const handleBack = (data: any) => {
    navigate(`/my-agents/${appId}-${agentId}/swipe`, {
      state: data
    });

    /*
      { currentIndex, signals, scrollToSignalId: currentSignal?.id 
      }
     */
  };

  useEffect(() => {
    if (!currentSignal) {
      navigate("/my-agents");
    }
  }, [currentSignal, navigate]);

  const initialFormValues: PlaceTradeFormValues | null = currentSignal
    ? {
        tradeType: "Perpetual", //currentSignal.type === "PERPETUAL" ? "Perpetual" : "Spot",
        exchangeType: "Binance",
        tradingPair: currentSignal?.ticker || "N/A",
        orderType: "Limit", // default to Limit for now
        buySellToggle:
        currentSignal?.type?.toLowerCase() === "PERPETUAL".toLowerCase()
            ? currentSignal?.data?.direction === "Long"
              ? "Buy"
              : "Sell"
            : currentSignal?.data?.direction === "Long"
            ? "Buy"
            : "Sell",
        amount: 10,
        limitPrice: Number(currentSignal.entry),
        total: 10 * currentSignal.entry,
        slippageTolerance: undefined,
        leverage: 5,
        takeProfit: Number(currentSignal.data?.t1) ,
        stopLoss: Number(currentSignal.stop),
        marginType: "Cross",
        reduceOnly: false,
        postOnly: false,
      }
    : null;

  const onSubmitPlaceTrade = async (values: PlaceTradeFormValues) => {
    // we nedd signal.selected, trade values, isModified, trade details 

    if (!window.ethereum?.selectedAddress) {
      throw new Error('Wallet not connected');
    }
    const payload = {
      exchange: values.exchangeType.toLowerCase(),
      tradeSignal:  {
        id: currentSignal.id,
        symbol: "XRPUSDC", //"DOGEUSDTM", // todo
        side:  currentSignal?.data?.direction === "Long" ? 'buy' : 'sell',           
        amount: values.amount,
        entry: values.limitPrice,
        stopLoss: values.stopLoss,
        takeProfit: values.takeProfit,
        leverage: values.leverage
      }
    };

    let creds = {
      apiKey: import.meta.env.VITE_KUCOIN_API_KEY || "",
      secret: import.meta.env.VITE_KUCOIN_API_SECRET || "",
      password: import.meta.env.VITE_KUCOIN_PASSPHRASE || ""
    }
    let binanceCreds = {
      apiKey: import.meta.env.VITE_BINANCE_API_KEY || "",
      secret: import.meta.env.VITE_BINANCE_API_SECRET || "",
    }

    // if(values.exchangeType === "Kucoin") {
    //   await testCancelTrades({ 
    //       walletAddress: window.ethereum?.selectedAddress,
    //       exchange: values.exchangeType.toLowerCase()
    //     }, creds
    //   )
    //   await testCloseAllTrades({
    //       walletAddress: window.ethereum?.selectedAddress,
    //       exchange: values.exchangeType.toLowerCase()
    //     }, creds
    //   );
    //   await makeTestTrade(payload, creds);
    //   await testOpenTrades({
    //       walletAddress: window.ethereum?.selectedAddress,
    //       exchange: values.exchangeType.toLowerCase()
    //     }, creds
    //   );
    //   return;
    // } else 
    if(values.exchangeType === 'Binance') {
      console.log("making binance trade , ", payload);
      await makeTestTrade(payload, binanceCreds);
      return;

    }

    if(values.exchangeType === "DEX") {
      //
    }
    handleBack({
      currentIndex, placeTradeSignal: null
    })
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-4xl mx-auto p-6 pt-4 bg-[#151A29]/80 border border-white/10 rounded-lg shadow-lg text-white">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() =>
                handleBack({
                  currentIndex,
                  signals,
                  scrollToSignalId: currentSignal?.id 
                })
              }
              className="flex items-center gap-2 h-10 bg-black/40 border-white/10 text-white hover:text-[#FF8133] hover:bg-[#FF8133]/10 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              {/* <span className="text-sm">Back to Signals</span> */}
            </Button>
            <h1 className="text-2xl font-semibold text-white">Place Trade</h1>
          </div>
        </header>

        {initialFormValues ? (
          <TradeForm
            initialValues={initialFormValues}
            onSubmit={onSubmitPlaceTrade}
            onCancel={() =>
              handleBack({
                currentIndex, placeTradeSignal: null
              })
            }
            showTitle={false}
          />
        ) : (
          <div className="text-center text-muted-foreground mt-24 text-lg font-semibold">
            No Trading Signal Data Provided
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceTrade;
