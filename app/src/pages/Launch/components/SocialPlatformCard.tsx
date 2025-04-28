
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkle } from "lucide-react";

interface SocialPlatformCardProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  twitterConfig?: {
    email: string;
    password: string;
    twoFactorSecret: string;
    handle: string;
  };
  telegramConfig?: {
    botToken: string;
    allowSelectedUsers?: boolean;
    selectedUserIds?: string;
  };
  onTwitterConfigChange?: (config: any) => void;
  onTelegramConfigChange?: (config: any) => void;
  optOut: boolean;
  onOptOutChange: (optOut: boolean) => void;
}

export const SocialPlatformCard = ({ 
  selectedPlatforms, 
  onPlatformsChange,
  twitterConfig,
  telegramConfig,
  onTwitterConfigChange,
  onTelegramConfigChange,
  optOut,
  onOptOutChange
}: SocialPlatformCardProps) => {
  const platforms = [
    { 
      id: "chat", 
      label: "Chat", 
      icon: "🐦",
      description: "Talk to your agent in the chat",
      tag: "Most Popular"
    },
    // { 
    //   id: "twitter", 
    //   label: "X/Twitter", 
    //   icon: "🐦",
    //   description: "Post tweets and interact with followers",
    //   tag: "Most Popular"
    // },
    { 
      id: "telegram", 
      label: "Telegram", 
      icon: "📱",
      description: "Run a Telegram bot for your community",
      tag: "Recommended"
    },
    // { 
    //   id: "discord", 
    //   label: "Discord", 
    //   icon: "💬",
    //   description: "Manage your Discord server and engage with members",
    //   tag: "Coming Soon"
    // },
    // { 
    //   id: "lens", 
    //   label: "Lens Protocol", 
    //   icon: "🌿",
    //   description: "Decentralized social interactions on Lens Protocol",
    //   tag: "Web3 Native"
    // },
    // { 
    //   id: "farcaster", 
    //   label: "Farcaster", 
    //   icon: "📡",
    //   description: "Engage with the Farcaster community",
    //   tag: "Beta"
    // },
  ];

  const handlePlatformToggle = (platformId: string) => {
    if (optOut) return;
    
    if (selectedPlatforms.includes(platformId)) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onPlatformsChange([...selectedPlatforms, platformId]);
    }
  };

  const handleOptOutChange = (checked: boolean) => {
    onOptOutChange(checked);
    if (checked) {
      onPlatformsChange([]);
    } else {
      // Reselect chat by default when opting back in
      onPlatformsChange(["chat"]);
    }
  };

  return (
    <Card className="bg-[#151A29]/80 border border-white/10">
      <CardHeader>
        <CardTitle>Select Social Platforms</CardTitle>
        <CardDescription>
          Choose the platforms where your agent will be active.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Opt-out option */}
          <div 
            className={`bg-black flex items-center space-x-4 rounded-lg border p-4 transition-colors cursor-pointer ${
              optOut ? "bg-[#FF8133]/15 border-[#FF8133]/10" : "border-white/10 hover:bg-[#FF8133]/5"
            }`}
            onClick={() => handleOptOutChange(!optOut)}
          >
            <div className="h-4 w-4 rounded-full border border-primary relative">
              {optOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Label className="text-base font-semibold flex items-center gap-2">
                <span>✨</span>
                <span>Opt out of social platforms</span>
              </Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Skip platform selection and base model configuration
                </p>
                <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  Recommended
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 my-4 pt-4"></div>

          {platforms.map((platform) => (
            <div key={platform.id} className="space-y-4">
              <div 
                className={`bg-black flex items-center space-x-4 rounded-lg border p-4 transition-colors ${
                  optOut 
                    ? "opacity-50 cursor-not-allowed border-white/5" 
                    : "cursor-pointer hover:bg-[#FF8133]/10 " + (selectedPlatforms.includes(platform.id) ? "bg-[#FF8133]/15 border-[#FF8133]/10" : "border-white/10")
                }`}
                onClick={() => !optOut && handlePlatformToggle(platform.id)}
              >
                <div className="h-4 w-4 rounded-full border border-primary relative">
                  {selectedPlatforms.includes(platform.id) && !optOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor={platform.id} className="text-base font-semibold flex items-center gap-2">
                    <span>{platform.icon}</span>
                    <span>{platform.label}</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                    <span className="px-2.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                      {platform.tag}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPlatforms.includes(platform.id) && !optOut && platform.id === "twitter" && (
                <div className="pl-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter-email">Email</Label>
                    <Input
                      id="twitter-email"
                      type="email"
                      value={twitterConfig?.email || ""}
                      onChange={(e) => onTwitterConfigChange?.({
                        ...twitterConfig,
                        email: e.target.value
                      })}
                      placeholder="Enter Twitter email"
                      className="bg-black rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-password">Password</Label>
                    <Input
                      id="twitter-password"
                      type="password"
                      value={twitterConfig?.password || ""}
                      onChange={(e) => onTwitterConfigChange?.({
                        ...twitterConfig,
                        password: e.target.value
                      })}
                      placeholder="Enter Twitter password"
                      className="bg-black rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-2fa">2FA Secret</Label>
                    <Input
                      id="twitter-2fa"
                      type="password"
                      value={twitterConfig?.twoFactorSecret || ""}
                      onChange={(e) => onTwitterConfigChange?.({
                        ...twitterConfig,
                        twoFactorSecret: e.target.value
                      })}
                      placeholder="Enter Twitter 2FA secret"
                      className="bg-black rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter-handle">Handle</Label>
                    <Input
                      id="twitter-handle"
                      value={twitterConfig?.handle || ""}
                      onChange={(e) => onTwitterConfigChange?.({
                        ...twitterConfig,
                        handle: e.target.value
                      })}
                      placeholder="@username"
                      className="bg-black rounded-lg"
                    />
                  </div>
                </div>
              )}

              {selectedPlatforms.includes(platform.id) && !optOut && platform.id === "telegram" && (
                <div className="pl-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegram-token">Bot Token</Label>
                    <Input
                      id="telegram-token"
                      type="password"
                      value={telegramConfig?.botToken || ""}
                      onChange={(e) => onTelegramConfigChange?.({
                        ...telegramConfig,
                        botToken: e.target.value
                      })}
                      placeholder="Enter Telegram bot token"
                      className="bg-black rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can get your bot token from @BotFather on Telegram
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow-selected-users"
                      checked={telegramConfig?.allowSelectedUsers !== false}
                      onCheckedChange={(checked) => onTelegramConfigChange?.({
                        ...telegramConfig,
                        allowSelectedUsers: !!checked
                      })}
                    />
                    <label
                      htmlFor="allow-selected-users"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Should allow selected users
                    </label>
                  </div>
                  
                  {telegramConfig?.allowSelectedUsers !== false && (
                    <div className="space-y-2">
                      <Label htmlFor="selected-user-ids">Telegram User IDs (comma separated)</Label>
                      <Input
                        id="selected-user-ids"
                        value={telegramConfig?.selectedUserIds || ""}
                        onChange={(e) => onTelegramConfigChange?.({
                          ...telegramConfig,
                          selectedUserIds: e.target.value
                        })}
                        placeholder="123456789,987654321"
                        className="bg-black rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        You can get telegram user id from @userinfobot on Telegram
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
