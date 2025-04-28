export const requestNetworkSwitch = async (network: { chainId: number, name: string, symbol: any, rpc: any }) => {
    let chainIdHex;

    try {
        chainIdHex = `0x${network.chainId.toString(16)}`;

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });

        return true;
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: chainIdHex,
                        chainName: network.name,
                        nativeCurrency: {
                            name: network.symbol,
                            symbol: network.symbol,
                            decimals: 18
                        },
                        rpcUrls: [network.rpc]
                    }],
                });
                return true;
            } catch (addError) {
                throw new Error(`Failed to add ${network.name} network`);
            }
        }
        throw new Error(`Failed to switch to ${network.name} network`);
    }
};