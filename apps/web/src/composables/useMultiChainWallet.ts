import { ref, computed, watch, shallowRef } from "vue";
import { useSolanaWallet } from "./useSolanaWallet";

export type ChainType = "ethereum" | "solana" | null;

// Lazy import type for useWallet
type UseWalletReturn = {
  address: any;
  chainId: any;
  isConnected: any;
  isCorrectNetwork: any;
  batBalance: any;
  isLoading: any;
  error: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  fetchBATBalance: () => Promise<void>;
  sendBATTip: (amount: string) => Promise<boolean>;
};

/**
 * Unified multi-chain wallet composable
 * Auto-detects connected wallet type and routes to appropriate handler
 */
export function useMultiChainWallet() {
  const activeChain = ref<ChainType>(null);

  // Lazy-initialize wallet handlers - use shallowRef for reactivity
  const ethWallet = shallowRef<UseWalletReturn | null>(null);
  const solWallet = shallowRef<ReturnType<typeof useSolanaWallet> | null>(null);

  // Get or initialize Ethereum wallet (dynamic import to prevent Web3Modal loading)
  const getEthWallet = async () => {
    if (!ethWallet.value) {
      const walletModule = await import("./useWallet");
      ethWallet.value = walletModule.useWallet();
    }
    return ethWallet.value;
  };

  // Get or initialize Solana wallet
  const getSolWallet = () => {
    if (!solWallet.value) {
      solWallet.value = useSolanaWallet();
    }
    return solWallet.value;
  };

  // Determine which chain is active based on connection status
  const detectActiveChain = () => {
    if (ethWallet.value?.isConnected.value) {
      activeChain.value = "ethereum";
    } else if (solWallet.value?.isConnected.value) {
      activeChain.value = "solana";
    } else {
      activeChain.value = null;
    }
  };

  // Watch for connection changes (only if wallets are initialized)
  watch(
    [
      () => ethWallet.value?.isConnected.value || false,
      () => solWallet.value?.isConnected.value || false,
    ],
    detectActiveChain,
    { immediate: true }
  );

  // Unified interface that routes to active chain
  const address = computed(() => {
    if (activeChain.value === "ethereum")
      return ethWallet.value?.address.value || null;
    if (activeChain.value === "solana")
      return solWallet.value?.address.value || null;
    return null;
  });

  const isConnected = computed(() => {
    return !!(
      ethWallet.value?.isConnected.value || solWallet.value?.isConnected.value
    );
  });

  const batBalance = computed(() => {
    if (activeChain.value === "ethereum")
      return ethWallet.value?.batBalance.value || "0";
    if (activeChain.value === "solana")
      return solWallet.value?.batBalance.value || "0";
    return "0";
  });

  const isLoading = computed(() => {
    return !!(
      ethWallet.value?.isLoading.value || solWallet.value?.isLoading.value
    );
  });

  const error = computed(() => {
    if (activeChain.value === "ethereum")
      return ethWallet.value?.error.value || "";
    if (activeChain.value === "solana")
      return solWallet.value?.error.value || "";
    return "";
  });

  // Connect to preferred chain (no silent fallback to the other chain)
  const connectWallet = async (preferredChain?: ChainType) => {
    if (preferredChain === "solana") {
      const wallet = getSolWallet();
      await wallet.connectWallet();
      activeChain.value = "solana"; // Set active chain
      return;
    }

    // Default to Ethereum Web3Modal (supports multiple EVM wallets)
    const wallet = await getEthWallet();
    await wallet.connectWallet();
    activeChain.value = "ethereum"; // Set active chain
  };

  // Explicit connect helpers (for separate buttons if desired)
  const connectEthereum = async () => {
    const wallet = await getEthWallet();
    await wallet.connectWallet();
    activeChain.value = "ethereum"; // Set active chain
  };

  const connectSolana = async () => {
    const wallet = getSolWallet();
    await wallet.connectWallet();
    activeChain.value = "solana"; // Set active chain
  };

  // Disconnect from active wallet
  const disconnectWallet = async () => {
    if (activeChain.value === "solana" && solWallet.value) {
      await solWallet.value.disconnectWallet();
    }
    // Ethereum disconnect is handled by Web3Modal
    activeChain.value = null;
  };

  // Fetch balance from active chain
  const fetchBATBalance = async () => {
    if (activeChain.value === "ethereum" && ethWallet.value) {
      await ethWallet.value.fetchBATBalance();
    } else if (activeChain.value === "solana" && solWallet.value) {
      await solWallet.value.fetchBATBalance();
    }
  };

  // Send tip on active chain
  const sendBATTip = async (amount: string): Promise<boolean> => {
    if (activeChain.value === "ethereum" && ethWallet.value) {
      return await ethWallet.value.sendBATTip(amount);
    } else if (activeChain.value === "solana" && solWallet.value) {
      return await solWallet.value.sendBATTip(amount);
    }
    return false;
  };

  // Check if on correct network (for Ethereum)
  const isCorrectNetwork = computed(() => {
    if (activeChain.value === "ethereum" && ethWallet.value) {
      return ethWallet.value.isCorrectNetwork.value;
    }
    // Solana doesn't have network switching in the same way
    return true;
  });

  // Get chain-specific info
  const chainInfo = computed(() => {
    if (activeChain.value === "ethereum" && ethWallet.value) {
      return {
        name: "Ethereum",
        chainId: ethWallet.value.chainId.value,
        currency: "ETH",
        explorerUrl: "https://etherscan.io",
      };
    } else if (activeChain.value === "solana") {
      return {
        name: "Solana",
        chainId: null,
        currency: "SOL",
        explorerUrl: "https://solscan.io",
      };
    }
    return null;
  });

  // Expose wallet getters for advanced use cases
  const ethereumWallet = computed(() => ethWallet.value);
  const solanaWalletGetter = computed(() => solWallet.value);

  return {
    // Multi-chain interface
    activeChain: computed(() => activeChain.value),
    address,
    isConnected,
    batBalance,
    isLoading,
    error,
    isCorrectNetwork,
    chainInfo,

    // Actions
    connectWallet,
    disconnectWallet,
    fetchBATBalance,
    sendBATTip,
    connectEthereum,
    connectSolana,

    // Direct access to chain-specific wallets
    ethereumWallet,
    solanaWallet: solanaWalletGetter,
  };
}
