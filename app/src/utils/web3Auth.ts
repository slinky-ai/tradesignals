
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';

export const generateNonce = () => {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const signMessage = async (message: string) => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return { signature, address };
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

export const verifySignature = (message: string, signature: string, address: string) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

export const hasValidCredentials = () => {
  const token = localStorage.getItem('web3_jwt');
  const walletAddress = localStorage.getItem('wallet_address');
  
  if (!token || !walletAddress) {
    return false;
  }
  
  // We could add token expiration checking here if needed
  return true;
};

export const autoConnectWallet = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      
      if (accounts.length > 0) {
        const storedWalletAddress = localStorage.getItem('wallet_address');
        
        // If the connected wallet matches our stored address
        if (storedWalletAddress && accounts[0].toLowerCase() === storedWalletAddress.toLowerCase()) {
          return accounts[0];
        }
      }
    } catch (error) {
      console.error("Error auto-connecting wallet:", error);
    }
  }
  return null;
};

// Helper function to register a wallet address in Supabase auth system
const registerWalletInSupabase = async (walletAddress: string) => {
  try {
    // First check if the user already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${walletAddress.toLowerCase()}@wallet.auth`,
      password: 'placeholder_password', // This won't work but helps us check if user exists
    });
    
    // If error is "Invalid login credentials" but not "Email not confirmed", 
    // it means user exists but password is wrong (which is expected)
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      console.log('User already exists in Supabase');
      return;
    }
    
    // If user was somehow able to sign in or there was a different error, log and return
    if (signInData?.user || (signInError && !signInError.message.includes('Invalid login credentials'))) {
      console.log('User exists or different error occurred:', signInError?.message);
      return;
    }
    
    // Create a user in Supabase with the wallet address as the email
    // We generate a random password since it won't be used for login
    const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const { data, error } = await supabase.auth.signUp({
      email: `${walletAddress.toLowerCase()}@wallet.auth`,
      password: randomPassword,
      options: {
        data: {
          wallet_address: walletAddress,
        }
      }
    });
    
    if (error) {
      console.error('Error registering wallet in Supabase:', error);
    } else {
      console.log('Successfully registered wallet in Supabase');
    }
    
  } catch (error) {
    console.error('Error in registerWalletInSupabase:', error);
  }
};

export const loginWithWeb3 = async (): Promise<{ token: string; address: string }> => {
  // First check if we already have valid credentials
  if (hasValidCredentials()) {
    console.log('Using existing credentials');
    const address = localStorage.getItem('wallet_address') as string;
    const token = localStorage.getItem('web3_jwt') as string;
    
    try {
      // Validate the stored wallet is still accessible
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        // If the current connected account matches our stored address
        if (accounts.length > 0 && accounts[0].toLowerCase() === address.toLowerCase()) {
          return { token, address };
        }
        console.log('Stored wallet no longer matches connected account, re-authenticating');
      }
    } catch (error) {
      console.warn('Error validating stored credentials:', error);
      // Continue with re-authentication
    }
  }

  const nonce = generateNonce();
  const { signature, address } = await signMessage(nonce);
  
  if (!verifySignature(nonce, signature, address)) {
    throw new Error('Invalid signature');
  }

  // Register the wallet in Supabase auth system
  await registerWalletInSupabase(address);

  const { data, error } = await supabase.functions.invoke('generate-web3-jwt', {
    body: { wallet_address: address }
  });

  if (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }

  const token = data.token;
  
  // Store the JWT in local storage for future use
  localStorage.setItem('web3_jwt', token);
  localStorage.setItem('wallet_address', address);
  
  // Store the timestamp of when the wallet was connected
  localStorage.setItem('wallet_connected_at', Date.now().toString());
  
  return { token, address };
};
