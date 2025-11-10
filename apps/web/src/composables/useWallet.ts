import { ref, computed, shallowRef } from "vue";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  BAT_TOKEN_ADDRESS,
  BAT_TOKEN_ABI,
  TIP_RECIPIENT_ADDRESS,
} from "../config/web3";

// Manual wallet state management (no Web3Modal hooks)
const connectedAddress = ref<string | null>(null);
const connectedChainId = ref<number | null>(null);
const walletProviderRef = shallowRef<any>(null);
let web3ModalInstance: any = null;

/**
 * Dynamically load and open Web3Modal connection dialog
 * This is the ONLY way Web3Modal code should be loaded
 */
async function openWeb3ModalConnection() {
  if (!web3ModalInstance) {
    // Dynamically import Web3Modal creator
    const { createEthereumModal } = await import("../config/web3");
    web3ModalInstance = createEthereumModal();

    // Subscribe to connection events manually
    web3ModalInstance.subscribeProvider((state: any) => {
      if (state.address) {
        connectedAddress.value = state.address;
      }
      if (state.chainId) {
        connectedChainId.value = state.chainId;
      }
      if (state.provider) {
        walletProviderRef.value = state.provider;
      }
      if (!state.isConnected) {
        connectedAddress.value = null;
        connectedChainId.value = null;
        walletProviderRef.value = null;
      }
    });
  }

  // Open the modal to let user connect
  await web3ModalInstance.open();
}

export function useWallet() {
  const batBalance = ref<string>("0");
  const isLoading = ref(false);
  const error = ref<string>("");

  // Check if on Ethereum Mainnet
  const isCorrectNetwork = computed(() => {
    return connectedChainId.value === 1;
  });

  // Connect wallet
  const connectWallet = async () => {
    try {
      await openWeb3ModalConnection();
      // Close modal after connection to keep user on page
      setTimeout(() => {
        if (web3ModalInstance && connectedAddress.value) {
          web3ModalInstance.close();
        }
      }, 1000);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      error.value = "Failed to connect wallet";
    }
  };

  // Fetch BAT balance
  const fetchBATBalance = async () => {
    if (!connectedAddress.value || !walletProviderRef.value) {
      batBalance.value = "0";
      return;
    }

    try {
      isLoading.value = true;
      error.value = "";

      const ethersProvider = new BrowserProvider(walletProviderRef.value);
      const batContract = new Contract(
        BAT_TOKEN_ADDRESS,
        BAT_TOKEN_ABI,
        ethersProvider
      );

      const balance = await batContract.balanceOf(connectedAddress.value);
      const decimals = await batContract.decimals();

      batBalance.value = formatUnits(balance, decimals);
    } catch (err) {
      console.error("Failed to fetch BAT balance:", err);
      error.value = "Failed to fetch BAT balance";
      batBalance.value = "0";
    } finally {
      isLoading.value = false;
    }
  };

  // Send BAT tip
  const sendBATTip = async (amount: string): Promise<boolean> => {
    if (!connectedAddress.value || !walletProviderRef.value) {
      error.value = "Wallet not connected";
      return false;
    }

    if (!isCorrectNetwork.value) {
      error.value = "Please switch to Ethereum Mainnet";
      return false;
    }

    try {
      isLoading.value = true;
      error.value = "";

      const ethersProvider = new BrowserProvider(walletProviderRef.value);
      const signer = await ethersProvider.getSigner();
      const batContract = new Contract(
        BAT_TOKEN_ADDRESS,
        BAT_TOKEN_ABI,
        signer
      );

      const decimals = await batContract.decimals();
      const amountInWei = parseUnits(amount, decimals);

      // Send transaction
      const tx = await batContract.transfer(TIP_RECIPIENT_ADDRESS, amountInWei);

      // Wait for confirmation
      await tx.wait();

      // Refresh balance
      await fetchBATBalance();

      return true;
    } catch (err: any) {
      console.error("Failed to send BAT tip:", err);

      if (err.code === "ACTION_REJECTED") {
        error.value = "Transaction was rejected";
      } else if (err.message?.includes("insufficient funds")) {
        error.value = "Insufficient BAT balance";
      } else {
        error.value = "Transaction failed";
      }

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (web3ModalInstance) {
      await web3ModalInstance.disconnect();
    }
    connectedAddress.value = null;
    connectedChainId.value = null;
    walletProviderRef.value = null;
    batBalance.value = "0";
  };

  return {
    address: computed(() => connectedAddress.value),
    chainId: computed(() => connectedChainId.value),
    isConnected: computed(() => !!connectedAddress.value),
    isCorrectNetwork,
    batBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    fetchBATBalance,
    sendBATTip,
  };
}
