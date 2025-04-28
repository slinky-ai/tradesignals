
import { config } from "process";
import { FormData } from "../types/agentTypes";

const getTGGroupIds = (telegramConfig: any) => {
  return telegramConfig.botToken && telegramConfig?.allowSelectedUsers
      ? telegramConfig?.selectedUserIds?.split(",").map(id => id.trim())
      : []
}

export const deploymentSteps = [
  "Initializing Memory Chain",
  "Spinning Up Agent",
  "Summoning Aliens",
  "Assigning Operator",
  "Reasoning Existence",
  "Deploying Autonomous Agent"
];

export const getAgentLinks = (formData: FormData) => {
  let tradingConfig = formData.tradingConfig;

  return {
    telegram: {
      allowSelectedUsers: 
        formData.telegramConfig.botToken 
        && !!formData.telegramConfig.allowSelectedUsers,
      allowedUserIds: getTGGroupIds(formData.telegramConfig) 
    }, //formData.telegramConfig?.username || "",  // TODO
    twitter: formData.twitterConfig?.handle || "",
    type: formData.socialPlatformsOptOut ?? true ? "trade_analysis_bot" : "",
    socialPlatformsOptOut: formData.socialPlatformsOptOut || false,
    trading_signals_config: {
      assetPairs: formData.assetPairs,
      ...tradingConfig
    }
  };
}

export const getAgentClients = (formData: FormData): string[] => {
  const clients: string[] = [];
  if(formData.socialPlatforms && formData.socialPlatforms.includes("telegram")) {
    clients.push("telegram");
  }
  if(formData.socialPlatforms && formData.socialPlatforms.includes("twitter")) {
    clients.push("twitter");
  }
  return clients;
};

export const getAgentSettings = (formData: FormData): { settings: any, secrets: any } => {
  const settings: any = {};
  const secrets: any = {};
  
  // LLM API keys
  if(formData.baseModel?.provider === "openai" && formData.baseModel.apiKey) {
    secrets["OPENAI_API_KEY"] = formData.baseModel.apiKey;
  } else if(formData.baseModel?.provider === "anthropic" && formData.baseModel.apiKey) {
    secrets["ANTHROPIC_API_KEY"] = formData.baseModel.apiKey;
  }

  // Social platform credentials
  if(formData.socialPlatforms && formData.socialPlatforms.includes("telegram")) {
    secrets["TELEGRAM_BOT_TOKEN"] = formData.telegramConfig?.botToken;
  }
  if(formData.socialPlatforms && formData.socialPlatforms.includes("twitter")) {
    secrets["TWITTER_USERNAME"] = formData.twitterConfig?.handle;
    secrets["TWITTER_EMAIL"] = formData.twitterConfig?.email;
    secrets["TWITTER_PASSWORD"] = formData.twitterConfig?.password;
    secrets["TWITTER_2FA_SECRET"] = formData.twitterConfig?.twoFactorSecret;
  }
  
  settings["secrets"] = secrets;
  let tradingConfig = formData.tradingConfig;
  settings["trading_signals_config"] = {
    assetPairs: formData.assetPairs || ["BTC/USDT"],
    ...tradingConfig
  }
  return { settings, secrets };
};

export const getAgentTags = (formData: FormData): string[] => {
  const tags = ['ASSISTANT'];
  
  if(formData.socialPlatforms && formData.socialPlatforms.includes("telegram")) {
    tags.push('TELEGRAM');
  }
  if(formData.socialPlatforms && formData.socialPlatforms.includes("twitter")) {
    tags.push('X/TWITTER');
  }
  
  return tags;
};

// Helper function to transform message examples to the expected format
export const transformMessageExamples = (messageExamples: Array<any>): any[] => {
  return messageExamples;
  return messageExamples.map(example => [
    {
      user: "{{user1}}",
      content: {
        text: example.user
      }
    },
    {
      user: "Dobby",
      content: {
        text: example.character
      }
    }
  ]);
};

// Helper function to transform post examples to the expected format
export const transformPostExamples = (postExamples: string[]): string[] => {
  return postExamples.filter(post => post.trim() !== "");
};

export const prepareAgentData = (formData: FormData, walletAddress: string, description: string, tradingParameters: any, configId: string): any => {
  const normalizedWalletAddress = walletAddress.toLowerCase();
  const chain = formData.chain || 'ethereum';
  const clients = getAgentClients(formData);
  const { settings } = getAgentSettings(formData);
  
  // Include trading configuration data
  const tradingConfig = formData.tradingConfig || { 
    tradeSignalType: ["ai"], 
    tradeType: ["spot"] 
  };
  
  // Transform character details if they exist
  let characterDetails = { ...formData.characterDetails };
  if (characterDetails?.messageExamples) {
    characterDetails.messageExamples = transformMessageExamples(characterDetails.messageExamples);
  }
  if (characterDetails?.postExamples) {
    characterDetails.postExamples = transformPostExamples(characterDetails.postExamples);
  }

  const tgClientConfig = {
    shouldOnlyJoinInAllowedGroups: 
      formData.telegramConfig.botToken 
      && !!formData?.telegramConfig?.allowSelectedUsers,
    allowedGroupIds: getTGGroupIds(formData.telegramConfig)
  };
  
  return {
    name: formData.name,
    status: "active",
    configuration: {
      llmChoice: formData.baseModel,
      environment: formData.environment === "verifiable" ? "verifiable" : "non-verifiable",
      chain: chain,
      tee: formData.environment === "verifiable",
      socialPlatforms: formData.socialPlatforms || ["chat"],
      socialPlatformsOptOut: formData.socialPlatformsOptOut || false,
      assetPairs: formData.assetPairs || ["BTC/USDT"],
      tradingConfig: tradingConfig,
      indicators: formData.indicators || [],
      characterDetails: { 
        name: formData.name,
        description,
        username: formData.name.trim(),
        clients,
        clientConfig: {
          telegram: tgClientConfig
        },
        modelProvider: formData.baseModel?.provider,
        settings,
        plugins: [],
        tags: getAgentTags(formData),
        ...(characterDetails || {})
      }
    },
    user_id: normalizedWalletAddress,
    wallet_address: normalizedWalletAddress,
    config_id: configId,
    llm_config: {
      provider: formData.baseModel,
      tokens_used: 0,
      tokens_limit: 1000000
    },
    operator: {
      name: "Default Operator",
      address: normalizedWalletAddress
    },
    blockchains: formData.chain ? [chain] : [],
    strategy: formData.strategy,
    trading_parameters: {
      ...tradingParameters,
      tradingConfig: tradingConfig,
      assetPairs: formData.assetPairs || ["BTC/USDT"]
    },
    description
  };
};
