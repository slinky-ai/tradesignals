
export interface FormData {
  name: string;
  baseModel: any;
  strategy: string;
  chain: string;
  customRpc?: string;
  environment: string;
  socialPlatforms?: string[];
  socialPlatformsOptOut?: boolean;
  assetPairs?: string[];
  tradingConfig?: {
    tradeSignalType: string[]; // AI Signals, Algorithmic Signals, Both
    tradeType: string[]; // Spot, Perpetual
    perpetualType?: string[]; // Long, Short (only when tradeType includes "perpetual")
  };
  indicators?: Array<{
    assetId: string;
    id: string;
    timeframe: string[];
  }>;
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
  characterDetails?: {
    bio: string[];
    lore: string[];
    knowledge: string[];
    messageExamples: Array<any>;
    style: {
      all: string[];
      chat: string[];
      post: string[];
    };
    topics: string[];
    adjectives: string[];
    postExamples: string[]; // Added this property
  };
  selectedProvider?: string;
  characterFile?: string;
}

export interface AgentData {
  name: string;
  status: string;
  configuration: {
    llmChoice: string;
    environment: string;
    chain: string;
    customRpc?: string;
    tee: boolean;
    socialPlatforms?: string[];
    assetPairs?: string[];
    indicators?: Array<{
      assetId: string;
      id: string;
      timeframe: string[];
    }>;
    characterDetails?: {
      bio: string[];
      lore: string[];
      knowledge: string[];
      messageExamples: Array<any>;
      style: {
        all: string[];
        chat: string[];
        post: string[];
      };
      topics: string[];
      adjectives: string[];
      postExamples: string[]; // Added this property
    };
    provider?: string;
  };
  user_id: string;
  wallet_address: string;
  config_id: string;
  llm_config: {
    provider: string;
    tokens_used: number;
    tokens_limit: number;
  };
  operator: {
    name: string;
    address: string;
  };
  blockchains: string[];
  strategy: string;
  trading_parameters: any;
  description: string;
}
