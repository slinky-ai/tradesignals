
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ExchangeApiCredentials {
  apiKey: string;
  apiSecret: string;
}

const supportedExchanges = ["Binance", "Kucoin"];

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [exchangeCredentials, setExchangeCredentials] = useState<Record<string, ExchangeApiCredentials>>({});
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  // Load stored wallet address and API keys from localStorage as a simple persistence
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet_address");
    if (storedWallet) setWalletAddress(storedWallet);

    const storedCreds = localStorage.getItem("exchangeCredentials");
    if (storedCreds) {
      try {
        const parsed = JSON.parse(storedCreds);
        setExchangeCredentials(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleCredentialChange = (
    exchange: string,
    field: keyof ExchangeApiCredentials,
    value: string
  ) => {
    setExchangeCredentials((prev) => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        [field]: value,
      },
    }));
  };

  const toggleEditMode = (exchange: string) => {
    setEditMode((prev) => ({
      ...prev,
      [exchange]: !prev[exchange],
    }));
  };

  const saveCredentials = (exchange: string) => {
    // Persist credentials in localStorage for illustration
    localStorage.setItem("exchangeCredentials", JSON.stringify(exchangeCredentials));
    setEditMode((prev) => ({ ...prev, [exchange]: false }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      <header>
        <h1 className="text-4xl font-bold text-[#FF8133] mb-1">Settings</h1>
        <p className="text-gray-400">Customize your account preferences</p>
      </header>

      <Card className="bg-[#0c0c0d] border border-[#151517] p-6 space-y-8 rounded-lg">
        <section>
          <h2 className="font-semibold text-white text-lg mb-4">Wallet</h2>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Connected Wallet Address</label>
            <input
              type="text"
              readOnly
              value={walletAddress || "Not connected"}
              className="w-full rounded-md bg-[#1c1c24] border border-[#2a2a33] text-white py-2.5 px-3 text-sm cursor-not-allowed"
            />
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-white text-lg mb-4">API Keys</h2>
          <Tabs defaultValue={supportedExchanges[0]}>
            <TabsList className="border-b border-[#2a2a33] mb-6">
              {supportedExchanges.map((exchange) => (
                <TabsTrigger
                  key={exchange}
                  value={exchange}
                  className="text-white"
                >
                  {exchange}
                </TabsTrigger>
              ))}
            </TabsList>
            {supportedExchanges.map((exchange) => {
              const creds = exchangeCredentials[exchange] || { apiKey: "", apiSecret: "" };
              const isEditing = editMode[exchange] || false;
              return (
                <TabsContent key={exchange} value={exchange} className="space-y-6">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">API Key</label>
                    <input
                      type="text"
                      value={creds.apiKey}
                      onChange={(e) => handleCredentialChange(exchange, "apiKey", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full rounded-md bg-[#1c1c24] border border-[#2a2a33] text-white py-2.5 px-3 text-sm ${
                        !isEditing ? "cursor-not-allowed opacity-60" : "focus:outline-none focus:ring-2 focus:ring-[#ff8133]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">API Secret</label>
                    <input
                      type="password"
                      value={creds.apiSecret}
                      onChange={(e) => handleCredentialChange(exchange, "apiSecret", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full rounded-md bg-[#1c1c24] border border-[#2a2a33] text-white py-2.5 px-3 text-sm ${
                        !isEditing ? "cursor-not-allowed opacity-60" : "focus:outline-none focus:ring-2 focus:ring-[#ff8133]"
                      }`}
                    />
                  </div>

                  <div>
                    {!isEditing && (
                      <Button variant="default" size="sm" onClick={() => toggleEditMode(exchange)}>
                        Edit
                      </Button>
                    )}
                    {isEditing && (
                      <>
                        <Button variant="default" size="sm" onClick={() => saveCredentials(exchange)} className="mr-2">
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleEditMode(exchange)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>
      </Card>
    </div>
  );
};

export default Settings;
