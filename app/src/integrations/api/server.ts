import axios from 'axios';
import forge from 'node-forge';
import { ELIZA_CODE } from '@/config';

const getApiUrl = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('get_api_url');

    if (error) {
        console.error('Error fetching API URL:', error);
        throw error;
    }

    if (!data) {
        throw new Error('API URL is null or undefined');
    }

    const urlObj = new URL(data);
    const cleanedUrl = `${urlObj.origin}${urlObj.pathname}`;
    return cleanedUrl;
};

let cachedApiUrl: string | null = null;

export const getData = async () => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get('/data');
        console.log('Data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const deployAgent = async (data: any) => {
    try {
        const axiosInstance = await getAxiosInstance();
        
        const response = await axiosInstance.post('/agent', {
          type: data.type,
          creator: data.walletAddress || data.creator,
          character: data.character,
          provider: data.provider || data.configuration?.provider || ELIZA_CODE,
          links: data.links
        });
        console.log('Data posted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        return { success: false, message: error instanceof Error ? error.message : String(error) };
    }
};

export const resetAgent = async (data: any) => {

    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.post(`/agents/${data.agentId}/reset`, {
            type: data.type,
            action: data.action,
            character: data.character
        });
        console.log('Agent', response.data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        return null;
    }
};

export const getAgents = async (data: any) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get('/agents', {
            params: {
                creator: data.walletAddress
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
};

export const getFeaturedAgents = async () => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get('/agents/featured');
        return response.data;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
};

export const getAgent = async (appId: string, agentId: string) => {
    try {
        console.log('=== Fetching Agent Details ===', agentId, appId);
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get('/agent', {
            params: {
                appId, agentId
            }
        });
        console.log('Agent fetched:', response.data);
        return response.data?.agent;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const handleSendMessage = async (agentId: string, message: string) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.post(`/agents/${agentId}/message`, {
            message,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const getAgentMessages = async (agentId: string, roomId: string) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/agents/${agentId}/${roomId}/memories`);
        return response.data?.memories;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const getAgentMessagesNew = async (agentId: string) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/agents/${agentId}/new_memories`);
        return response.data?.memories;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const getTradeSignals = async ({agentId, appId, page = 1, limit = 20}) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/trading_signals`, {
            params: {
                agentId, 
                appId,
                page,
                limit
            },
        });
        console.log('Trade signals fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const getRelevantTradeSignals = async (signal) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/trading_signal/${signal.id}`, {
            params: {
                indicator: signal.indicator
            }
        });
        console.log('Trade relevant signals fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const getBackTestingResults = async (signal) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/signals/result/${signal.id}`, {
            params: {}
        });
        console.log('Trade relevant signals fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching agent:', error);
        return null;
    }
};

export const makeTestTrade = async (data, creds) => {
    try {
        const credentials = await getEncryptCredentials({
            apiKey: creds.apiKey,
            secret: creds.secret,
            password: creds.password,
        });
        const axiosInstance = await getAxiosInstance();

        const response = await axiosInstance.post(`/test/trade`, {
            ...data, credentials
        });
        return response.data;
    } catch (error) {
        console.error('Error makeTestTrade:', error);
        return null;
    }
};

export const testOpenTrades = async (data, creds) => {
    try {
        const credentials = await getEncryptCredentials({
            apiKey: creds.apiKey,
            secret: creds.secret,
            password: creds.password,
        });
        const axiosInstance = await getAxiosInstance();

        const response = await axiosInstance.post(`/test/trades/open`, {
            ...data, credentials
        });
        return response.data;
    } catch (error) {
        console.error('Error makeTestTrade:', error);
        return null;
    }
};

export const getEncryptCredentials = async (data) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.get(`/test/key`);
        const publicKeyPem = response.data;
        const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        const jsonStr = JSON.stringify(data);
        const encryptedBytes = publicKey.encrypt(jsonStr, 'RSA-OAEP');
        return forge.util.encode64(encryptedBytes);
    } catch (error) {
        console.error('Error getEncryptCredentials:', error);
        return null;
    }
};