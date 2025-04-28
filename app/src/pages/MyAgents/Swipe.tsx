
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronLeft } from "lucide-react";
import { io } from "socket.io-client";
import { getTradeSignals, getAgent } from "@/integrations/api/server";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { API_SOCKET_URL } from "@/config"
import TradeForm, { PlaceTradeFormValues } from "@/components/TradeForm";
import SignalCard from "@/components/SignalCard";
import { sortSignalsByTimestampWithOrder } from "../AgentChat/components/trading/utils/signalUtils";

const Swipe: React.FC = () => {
  let { agentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const signalsFromState = location.state?.signals;

  const scrollToSignalId = location.state?.scrollToSignalId;
  const currentIndexFromState = location.state?.currentIndex;
  const initialPlaceTradeSignal = location.state?.placeTradeSignal;

  if (!agentId) {
    return (
      <div className="text-center p-8 text-muted-foreground">Invalid agent ID</div>
    );
  }

  const idx = agentId.indexOf("-");
  const appId = agentId.slice(0, idx);
  agentId = agentId.slice(idx + 1);

  const [agent, setAgent] = useState<any | null>(null);
  const [signals, setSignals] = useState<any[]>(signalsFromState || []);
  const [currentIndex, setCurrentIndex] = useState<number>(
    currentIndexFromState ?? 0
  );
  const [signalsLoadedOnce, setSignalsLoadedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeAnimation, setSwipeAnimation] = useState<"left" | "right" | null>(
    null
  );
  const [showNoMoreModal, setShowNoMoreModal] = useState(false);
  const [placeTradeSignal, setPlaceTradeSignal] = useState(initialPlaceTradeSignal ?? null);

  const socketRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (signals.length > 0) {
      setIsLoading(false);
    }
  }, [signals]);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!agentId) return;

      setIsLoading(true);
      try {
        const data = await getAgent(appId, agentId);
        setAgent(data);

        if (!data) {
          toast({
            title: "Error",
            description: "Failed to load agent details",
            variant: "destructive",
          });
          navigate("/my-agents");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load agent details",
          variant: "destructive",
        });
        navigate("/my-agents");
      }
    };

    fetchAgentDetails();
  }, [agentId, appId, navigate, toast]);

  useEffect(() => {
    if (!agentId) return;

    if (signalsFromState && signalsFromState.length > 0) {
      setIsLoading(false);
      setSignalsLoadedOnce(true);
      return;
    }

    if (signalsLoadedOnce && signals.length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchSignals = async () => {
      setIsLoading(true);
      try {
        const data = await getTradeSignals({
          agentId: agentId,
          appId: appId,
          page: 1,
          limit: 50,
        });
        if (data && data.signals && data.signals.length > 0) {
          const sortedSignals = sortSignalsByTimestampWithOrder(data.signals, false);
          setSignals(sortedSignals);
          setSignalsLoadedOnce(true);
          if (scrollToSignalId) {
            const index = sortedSignals.findIndex(
              (sig) => sig.id === scrollToSignalId || sig.internal_id === scrollToSignalId
            );
            setCurrentIndex(index !== -1 ? index : 0);
          } else {
            setCurrentIndex(currentIndexFromState ?? 0);
          }
        } else {
          setSignals([]);
          setCurrentIndex(0);
          // console.log("No signals found from API.");
        }
      } catch (error) {
        console.error("Error fetching trading signals:", error);
        setSignals([]);
        setCurrentIndex(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignals();
  }, [agentId, appId, scrollToSignalId, signalsLoadedOnce, signals.length]);

  useEffect(() => {
    if (!agentId) return;

    socketRef.current = io(API_SOCKET_URL, {
      transports: ["websocket"],
      auth: { agentId },
    });

    socketRef.current.on("connect", () => {
      console.log("Realtime socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", (reason: string) => {
      console.log("Realtime socket disconnected:", reason);
    });

    socketRef.current.on("message", (msg: any) => {
      setSignals((prevSignals) => {
        const exists = prevSignals.find((s) => s.id === msg.id);
        if (exists) {
          return sortSignalsByTimestampWithOrder(
            prevSignals.map((s) => (s.id === msg.id ? msg : s)),
            false
          )
        } else {
          return sortSignalsByTimestampWithOrder([...prevSignals, msg], false);
        }
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [agentId]);

  const currentSignal = signals[currentIndex];
  const prevSignal = currentIndex > 0 ? signals[currentIndex - 1] : null;
  const nextSignal = currentIndex < signals.length - 1 ? signals[currentIndex + 1] : null;

  const onAnimationEnd = () => {
    if (!currentSignal) return;
    if (swipeAnimation) {
      if (swipeAnimation === "right") {
        setPlaceTradeSignal(currentSignal);
        setSwipeAnimation(null);
        navigate(`/my-agents/${appId}-${agentId}/place-trade`, {
          state: { currentSignal, currentIndex, signals, appId, agentId },
          replace: false,
        });
      } else if (swipeAnimation === "left") {
        if (currentIndex < signals.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setShowNoMoreModal(true);
        }
        setSwipeAnimation(null);
      }
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (swipeAnimation) return;
    setSwipeAnimation(direction);
  };

  const initialFormValues: PlaceTradeFormValues | null = currentSignal
    ? {
        tradeType: 'Perpetual',
        exchangeType: "Binance",
        tradingPair: currentSignal?.ticker || "N/A",
        orderType: "Limit",
        buySellToggle:
          currentSignal?.type?.toLowerCase() === "PERPETUAL".toLowerCase()
            ? currentSignal?.data?.direction === "Long"
              ? "Buy"
              : "Sell"
            : currentSignal?.data?.direction === "Long"
            ? "Buy"
            : "Sell",
        amount: 0,
        limitPrice:
          typeof currentSignal?.data?.entry === "number"
            ? currentSignal.data.entry
            : 0,
        total: 0,
        slippageTolerance: undefined,
        leverage: 1,
        takeProfit: undefined,
        stopLoss: undefined,
        marginType: "Cross",
        reduceOnly: false,
        postOnly: false,
      }
    : null;

  const onSubmitPlaceTrade = (values: PlaceTradeFormValues) => {
    alert(
      `Trade placed for ${values.tradingPair} - Type: ${values.tradeType}, Exchange: ${values.exchangeType}, Order: ${values.orderType}, ${values.buySellToggle}, Qty: ${values.amount}, Price: ${values.limitPrice}, Total: ${values.total}.`
    );
  };

  return (
    <div
      ref={containerRef}
      className="container mx-auto max-w-md min-h-[100dvh] px-4 py-6 md:py-8 flex flex-col relative bg-transparent select-none"
    >
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/20 -mx-4 px-4 py-3 border-b border-white/10 mb-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/my-agents`)}
            className="flex items-center gap-2 h-10 bg-black/40 border-white/10 text-white hover:text-[#FF8133] hover:bg-[#FF8133]/10 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Agents</span>
          </Button>
          
          <div>
            <span className="text-sm text-muted-foreground">
              {signals.length > 0 ? 
                `${currentIndex + 1} / ${signals.length}` : 
                "0 / 0"}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FF8133] to-[#FFA500] bg-clip-text text-transparent">
          Trade Signals
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {signals.length} {signals.length === 1 ? 'signal' : 'signals'} available
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-16 md:mt-24 gap-2 text-muted-foreground font-semibold text-lg bg-background">
          <Loader2 className="animate-spin h-6 w-6" />
          <span>Loading signals...</span>
        </div>
      ) : placeTradeSignal ? (
        <div className="mt-4 md:mt-6">
          <TradeForm
            initialValues={initialFormValues!}
            onSubmit={(values) => {
              onSubmitPlaceTrade(values);
              setPlaceTradeSignal(null);
              navigate(`/my-agents/${appId}-${agentId}/swipe`, {
                state: { currentIndex, scrollToSignalId: currentSignal?.id },
              });
            }}
            onCancel={() => {
              setPlaceTradeSignal(null);
              navigate(`/my-agents/${appId}-${agentId}/swipe`, {
                state: { currentIndex, scrollToSignalId: currentSignal?.id },
              });
            }}
          />
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center text-muted-foreground mt-16 md:mt-24 text-lg font-semibold">
          No Trading Signals Available
        </div>
      ) : (
        <div
          className="relative w-full flex justify-center items-center max-w-md mx-auto mt-6"
          style={{ height: "min(580px, 70vh)" }}
        >
          {prevSignal && (
            <Card
              className="absolute left-0 top-1/2 w-full max-w-[320px] md:max-w-[340px] -translate-y-1/2 rounded-xl bg-[#0C0C0C]/40 border border-white/10 shadow-lg backdrop-blur-sm transform-gpu"
              style={{
                filter: "blur(4px)",
                backgroundColor: "rgba(13, 25, 44, 0.2)",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                transform: "rotateY(-15deg) translateX(-10px)",
                zIndex: 10,
                transition: "transform 0.4s ease, opacity 0.4s ease",
                opacity: swipeAnimation ? 0 : 0.8,
              }}
              data-signal-id={prevSignal.id}
            >
              <SignalCard signal={prevSignal} />
            </Card>
          )}

          {currentSignal && (
            <div className="relative">
              <Card
                className={`
                  relative
                  z-20
                  w-full
                  max-w-[320px]
                  md:max-w-[340px]
                  rounded-xl
                  bg-[#151A29]/90
                  border border-white/20
                  shadow-2xl
                  transition-transform
                  duration-400
                  ease-in-out
                  width-[90%]
                  ${swipeAnimation === "left" ? "animate-swipe-left" : ""}
                  ${swipeAnimation === "right" ? "animate-swipe-right" : ""}
                `}
                onAnimationEnd={onAnimationEnd}
                data-signal-id={currentSignal.id}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                }}
              >
                <SignalCard signal={currentSignal} />
              </Card>
              
              {!isLoading && signals.length > 0 && !placeTradeSignal && (
                <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-between px-4">
                  <button
                    onClick={() => handleSwipe("left")}
                    aria-label="Swipe Left"
                    className="flex items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#666666] hover:bg-[#444444] hover:text-white w-12 h-12 md:w-14 md:h-14 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-[#444444]/30 hover:shadow-xl hover:scale-110 hover:border-[#666666]/50"
                    title="Dismiss Signal"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    aria-label="Swipe Right"
                    className="flex items-center justify-center rounded-full border border-white/20 bg-black/70 text-[#F97316] hover:bg-[#D46312] hover:text-white w-12 h-12 md:w-14 md:h-14 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-[#D46312]/30 hover:shadow-xl hover:scale-110 hover:border-[#F97316]/50"
                    title="Save Signal"
                  >
                    <ChevronLeft size={22} className="rotate-180" />
                  </button>
                </div>
              )}
            </div>
          )}

          {nextSignal && (
            <Card
              className="absolute right-0 top-1/2 w-full max-w-[320px] md:max-w-[340px] -translate-y-1/2 rounded-xl bg-[#0C0C0C]/40 border border-white/10 shadow-lg backdrop-blur-sm transform-gpu"
              style={{
                filter: "blur(4px)",
                backgroundColor: "rgba(13, 25, 44, 0.2)",
                transformStyle: "preserve-3d",
                transformOrigin: "right center",
                transform: "rotateY(15deg) translateX(10px)",
                zIndex: 10,
                transition: "transform 0.4s ease, opacity 0.4s ease",
                opacity: swipeAnimation ? 0 : 0.8,
              }}
              data-signal-id={nextSignal.id}
            >
              <SignalCard signal={nextSignal} />
            </Card>
          )}
        </div>
      )}

      <Dialog open={showNoMoreModal} onOpenChange={setShowNoMoreModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No More Signals</DialogTitle>
          </DialogHeader>
          <DialogDescription>No more signals, wait for new.</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowNoMoreModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Swipe;
