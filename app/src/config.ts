
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api/v1/api/v1';
export const API_SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL || 'https://test-api2.slinky.build';

export const ELIZA_CODE = "110";
export const FLEEK_CODE = "113";

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'local';

export const NETWORK_CONFIG_COW_SWAP_API = {
    BSC: {
        chainId: 56,
        apiUrl: 'https://api.cow.fi/bsc/api/v1',
        name: 'BSC'
    },
    POLYGON: {
        chainId: 137,
        apiUrl: 'https://api.cow.fi/mainnet/api/v1',
        name: 'Polygon'
    }
};

export const NETWORK_API_MAP_0X = {
    ethereum: 'https://api.0x.org',
    bsc: 'https://bsc.api.0x.org',
    polygon: 'https://polygon.api.0x.org',
    avalanche: 'https://avalanche.api.0x.org',
    fantom: 'https://fantom.api.0x.org',
    celo: 'https://celo.api.0x.org',
    optimism: 'https://optimism.api.0x.org',
    arbitrum: 'https://arbitrum.api.0x.org',
};

export const API_HOSTS_0X = {
    1: 'https://api.0x.org',              // Ethereum
    56: 'https://bsc.api.0x.org',         // BNB Chain
    137: 'https://polygon.api.0x.org',    // Polygon
    10: 'https://optimism.api.0x.org',
    42161: 'https://arbitrum.api.0x.org',
    43114: 'https://avalanche.api.0x.org',
  };