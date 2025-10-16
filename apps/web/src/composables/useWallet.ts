import { ref, computed } from "vue";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/vue";
import {
  BAT_TOKEN_ADDRESS,
  BAT_TOKEN_ABI,
  TIP_RECIPIENT_ADDRESS,
} from "../config/web3";

export function useWallet() {
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const batBalance = ref<string>("0");
  const isLoading = ref(false);
  const error = ref<string>("");

  // Check if on Ethereum Mainnet
  const isCorrectNetwork = computed(() => chainId.value === 1);

  // Connect wallet
  const connectWallet = async () => {
    try {
      await open();
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      error.value = "Failed to connect wallet";
    }
  };

  // Fetch BAT balance
  const fetchBATBalance = async () => {
    if (!isConnected.value || !address.value || !walletProvider.value) {
      batBalance.value = "0";
      return;
    }

    try {
      isLoading.value = true;
      error.value = "";

      const ethersProvider = new BrowserProvider(walletProvider.value);
      const batContract = new Contract(
        BAT_TOKEN_ADDRESS,
        BAT_TOKEN_ABI,
        ethersProvider
      );

      const balance = await batContract.balanceOf(address.value);
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
    if (!isConnected.value || !address.value || !walletProvider.value) {
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

      const ethersProvider = new BrowserProvider(walletProvider.value);
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

  return {
    address,
    chainId,
    isConnected,
    isCorrectNetwork,
    batBalance,
    isLoading,
    error,
    connectWallet,
    fetchBATBalance,
    sendBATTip,
  };
}
