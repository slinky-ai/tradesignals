import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Coins, DollarSign, CircleDollarSign } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formatNumberInput } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_SLIPPAGE = "0.1%";

const spotOrderTypes = ["Limit", "Market"] as const;
const perpetualOrderTypes = [
  "Market",
  "Limit",
  "Stop",
  "Stop-Limit",
  "Conditional",
] as const;
const exchangeOptions = ["Binance", "DEX"] as const;
const slippageOptions = ["0.1%", "0.5%", "1%", "2%"] as const;
const marginTypes = ["Cross", "Isolated"] as const;

type SpotOrderType = typeof spotOrderTypes[number];
type PerpetualOrderType = typeof perpetualOrderTypes[number];
export type OrderType = SpotOrderType | PerpetualOrderType;

export const placeTradeSchema = z.object({
  tradeType: z.enum(["Spot", "Perpetual"]),
  exchangeType: z.enum(exchangeOptions),
  tradingPair: z.string(),
  orderType: z.enum([...spotOrderTypes, ...perpetualOrderTypes]),
  buySellToggle: z.string(),
  buySellToggle1: z.string().optional(),
  amount: z.number().min(0.0001, "Amount must be greater than 0"),
  limitPrice: z.number().min(0.0001, "Price must be greater than 0").optional(),
  total: z.number().min(0).optional(),
  slippageTolerance: z.string().optional(),
  leverage: z.number().min(1).max(100).optional(),
  takeProfit: z.number().optional(),
  stopLoss: z.number().optional(),
  marginType: z.enum(marginTypes).optional(),
  reduceOnly: z.boolean().optional(),
  postOnly: z.boolean().optional(),
});

export type PlaceTradeFormValues = z.infer<typeof placeTradeSchema>;

interface TradeFormProps {
  initialValues?: Partial<PlaceTradeFormValues>;
  onSubmit: (values: PlaceTradeFormValues) => void;
  onCancel?: () => void;
  showTitle?: boolean;
}

const TradeForm: React.FC<TradeFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  showTitle = true,
}) => {
  const defaultValues: PlaceTradeFormValues = {
    exchangeType: "Binance",
    orderType: "Limit",
    buySellToggle: "Buy",
    amount: 0,
    limitPrice: 0,
    total: 0,
    slippageTolerance: "0.1%",
  };

  const form = useForm<PlaceTradeFormValues>({
    resolver: zodResolver(placeTradeSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      form.reset({ ...defaultValues, ...initialValues });
    }
  }, [initialValues]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        let amount = Number(values.amount);
        let price = Number(values.limitPrice);
        if (!amount || amount < 0) amount = 0;
        if (!price || price < 0) price = 0;
        const newTotal = amount * price;
        if (newTotal !== form.getValues("total")) {
          form.setValue("total", newTotal);
        }
      } catch {
        form.setValue("total", 0);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const tradeType = form.watch("tradeType");
  const orderTypes = tradeType === "Perpetual" ? perpetualOrderTypes : spotOrderTypes;
  const buySellOptions = tradeType === "Perpetual" ? ["Buy", "Sell"] : ["Buy", "Sell"];
  const showLimitPrice = ["Limit", "Stop", "Stop-Limit"].includes(form.watch("orderType")) ||
    (tradeType === "Spot" && form.watch("orderType") === "Limit");

  const exchangeIcons = {
    Binance: <Coins className="h-4 w-4" />,
    Kucoin: <DollarSign className="h-4 w-4" />,
    DEX: <CircleDollarSign className="h-4 w-4" />
  };

  const exchangeColors = {
    Binance: "data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400",
    Kucoin: "data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400",
    DEX: "data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Primary Trading Options Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="tradeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Trade Type</FormLabel>
                  <Tabs
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="w-full bg-black/40 border border-white/10">
                      <TabsTrigger value="Spot" className="w-full">Spot</TabsTrigger>
                      <TabsTrigger value="Perpetual" className="w-full">Perpetual</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exchangeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Exchange</FormLabel>
                  <Tabs
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="w-full bg-black/40 border border-white/10">
                      {exchangeOptions.map((ex) => (
                        <TabsTrigger 
                          key={ex} 
                          value={ex} 
                          className={`w-full flex items-center gap-2 ${exchangeColors[ex]}`}
                        >
                          {/* {exchangeIcons[ex]} */}
                          {ex}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradingPair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Trading Pair</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      className="h-10 bg-black/40 border-white/10 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="buySellToggle"
            render={({ field }) => { 
              return (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">
                  {tradeType === "Perpetual" ? "Position" : "Side"}
                </FormLabel>
                <Tabs
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  className="w-full"
                >
                <TabsList className="w-full bg-black/40 border border-white/10">
                  {buySellOptions.map((opt) => {
                    return (
                      <TabsTrigger
                        key={opt}
                        value={opt}
                        className={`w-full ${
                          opt.toLowerCase() === "buy" || opt.toLowerCase() === "long"
                            ? "data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                            : "data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                        }`}
                      >
                      {tradeType === 'Perpetual' 
                        ? (opt === 'Buy' ? 'Long' : 'Short')
                        : (opt === 'Buy' ? 'Buy' : 'Sell')
                      }
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}}
          />

          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">Order Type</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-10 bg-black/40 border-white/10">
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {orderTypes.map((ot) => (
                        <SelectItem key={ot} value={ot}>
                          {ot}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Trade Amount Section */}
        <div className="space-y-4 rounded-lg bg-white/5 p-4 border border-white/10">
          <h3 className="text-sm font-medium text-gray-200">Trade Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      min={0}
                      value={field.value}
                      onChange={(e) => {
                        const formattedValue = formatNumberInput(e.target.value);
                        field.onChange(Number(formattedValue));
                      }}
                      className="h-10 bg-black/40 border-white/10"
                    />
                  </FormControl>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.01"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full h-1.5 mt-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#FF8133]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {showLimitPrice && (
              <FormField
                control={form.control}
                name="limitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">Limit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        min={0}
                        value={field.value.toFixed(4)}
                        onChange={(e) => {
                          const formattedValue = formatNumberInput(e.target.value);
                          field.onChange(Number(formattedValue));
                        }}
                        className="h-10 bg-black/40 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


            {/* <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      value={field.value}
                      className="h-10 bg-black/40 border-white/10 cursor-not-allowed"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>

        {/* Advanced Trading Options */}
        {tradeType === "Perpetual" && (
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <h3 className="text-sm font-medium text-gray-200 mb-4">Advanced Options</h3>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400 flex justify-between">
                        <span>Leverage ({field.value}x)</span>
                        <div className="flex space-x-2">
                          <span className="text-xs text-gray-500">1x</span>
                          <span className="text-xs text-gray-500">100x</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type="range"
                            min={1}
                            max={100}
                            step={1}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-[#FF8133]"
                          />
                          <div className="absolute inset-x-0 top-full flex justify-between mt-1">
                            <span className="text-xs text-gray-500">1x</span>
                            <span className="text-xs text-gray-500">100x</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marginType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400">Margin Type</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-9 bg-black/40 border-white/10">
                          <SelectValue placeholder="Select margin type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {marginTypes.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400">Take Profit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          value={field.value.toFixed(4)}
                          className="h-9 bg-black/40 border-white/10"
                          onChange={(e) => {
                            const formattedValue = formatNumberInput(e.target.value);
                            field.onChange(Number(formattedValue));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400">Stop Loss</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          value={field.value.toFixed(4)}
                          className="h-9 bg-black/40 border-white/10"
                          onChange={(e) => {
                            const formattedValue = formatNumberInput(e.target.value);
                            field.onChange(Number(formattedValue));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row gap-6 pt-1">
                <FormField
                  control={form.control}
                  name="reduceOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/10 bg-black/40 data-[state=checked]:bg-[#FF8133] data-[state=checked]:text-white hover:bg-[#FF8133]/10 transition-colors"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-200 leading-none hover:cursor-pointer">
                        Reduce-only
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postOnly"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/10 bg-black/40 data-[state=checked]:bg-[#FF8133] data-[state=checked]:text-white hover:bg-[#FF8133]/10 transition-colors"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-200 leading-none hover:cursor-pointer">
                        Post-only
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-white/10 hover:bg-[#FF8133]/10 hover:text-[#FF8133] transition-all duration-300"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-[#FF8133]/10 text-[#FF8133] hover:bg-[#FF8133]/20 transition-all duration-300"
          >
            Place Trade
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TradeForm;
