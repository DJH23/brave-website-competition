import { ref, computed } from "vue";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  BAT_SPL_MINT_ADDRESS,
  TIP_RECIPIENT_ADDRESS_SOLANA,
  SOLANA_RPC_URL,
  SOLANA_RPC_ENDPOINTS,
} from "../config/web3";

export function useSolanaWallet() {
  const address = ref<string | null>(null);
  const isConnected = ref(false);
  const batBalance = ref<string>("0");
  const isLoading = ref(false);
  const error = ref<string>("");
  const solanaProvider = ref<any>(null);

  // Solana connection with fallback retry logic
  let currentRpcIndex = 0;
  let connection = new Connection(SOLANA_RPC_URL, "confirmed");

  // Helper to get connection with fallback
  const getConnection = () => {
    if (currentRpcIndex >= SOLANA_RPC_ENDPOINTS.length) {
      currentRpcIndex = 0; // Reset to primary
    }
    const endpoint = SOLANA_RPC_ENDPOINTS[currentRpcIndex];
    console.log(`[useSolanaWallet] Using RPC endpoint: ${endpoint}`);
    return new Connection(endpoint, "confirmed");
  };

  // Helper to retry with next RPC endpoint
  const retryWithNextRPC = async <T>(
    operation: (conn: Connection) => Promise<T>
  ): Promise<T> => {
    let lastError: any;

    for (let i = 0; i < SOLANA_RPC_ENDPOINTS.length; i++) {
      try {
        connection = getConnection();
        return await operation(connection);
      } catch (err: any) {
        console.warn(
          `[useSolanaWallet] RPC attempt ${i + 1} failed:`,
          err.message
        );
        lastError = err;
        currentRpcIndex++;

        // Don't retry if it's a user rejection or insufficient balance
        if (
          err.message?.includes("User rejected") ||
          err.message?.includes("insufficient")
        ) {
          throw err;
        }
      }
    }

    throw lastError;
  };

  // Check if a Solana wallet provider is available (Phantom or Brave Wallet)
  const isWalletAvailable = computed(() => {
    if (typeof window === "undefined") return false;
    try {
      const w = window as any;
      const provider = w?.solana;
      return (
        !!provider &&
        (provider.isPhantom === true ||
          provider.isBraveWallet === true ||
          typeof provider.connect === "function")
      );
    } catch {
      return false;
    }
  });

  // Connect to Solana wallet
  const connectWallet = async () => {
    console.log("[useSolanaWallet] connectWallet called");

    if (!isWalletAvailable.value) {
      error.value =
        "No Solana wallet detected. Please ensure Brave Wallet has Solana enabled or install Phantom.";
      console.error("[useSolanaWallet] No Solana provider available");
      return;
    }

    try {
      const provider = (window as any).solana;
      if (!provider) {
        error.value = "Solana wallet not detected";
        console.error("[useSolanaWallet] window.solana is null");
        return;
      }

      console.log("[useSolanaWallet] Provider found:", {
        isPhantom: provider.isPhantom,
        isBraveWallet: provider.isBraveWallet,
        hasConnect: typeof provider.connect === "function",
      });

      isLoading.value = true;
      const resp = await provider.connect({ onlyIfTrusted: false });
      solanaProvider.value = provider;
      address.value = resp.publicKey.toString();
      isConnected.value = true;

      console.log("[useSolanaWallet] Connected successfully:", address.value);

      // Don't auto-fetch balance to avoid RPC rate limits
      // Balance will be fetched on-demand when needed
    } catch (err: any) {
      console.error("Failed to connect Solana wallet:", err);

      // Handle specific error cases
      if (err.code === 4001 || err.message?.includes("User rejected")) {
        error.value = "Connection cancelled. Please try again when ready.";
        console.log("[useSolanaWallet] User rejected the connection request");
      } else if (err.message?.includes("wallet is locked")) {
        error.value = "Please unlock your Solana wallet and try again.";
      } else {
        error.value =
          "Failed to connect Solana wallet. Please try again or check wallet settings.";
      }

      // Clear any partial connection state
      solanaProvider.value = null;
      address.value = null;
      isConnected.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (solanaProvider.value) {
      await solanaProvider.value.disconnect();
    }
    address.value = null;
    isConnected.value = false;
    batBalance.value = "0";
    solanaProvider.value = null;
  };

  // Fetch BAT SPL token balance
  const fetchBATBalance = async () => {
    if (!isConnected.value || !address.value) {
      batBalance.value = "0";
      return;
    }

    try {
      isLoading.value = true;
      error.value = "";

      const walletPublicKey = new PublicKey(address.value);
      const mintPublicKey = new PublicKey(BAT_SPL_MINT_ADDRESS);

      // Get the associated token account for this wallet
      const tokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        walletPublicKey
      );

      // Get token account balance
      const balance = await connection.getTokenAccountBalance(tokenAccount);

      // SPL tokens typically have 18 decimals for BAT
      batBalance.value = balance.value.uiAmountString || "0";
    } catch (err: any) {
      console.error("Failed to fetch BAT balance:", err);

      // If token account doesn't exist, balance is 0
      if (err.message?.includes("could not find account")) {
        batBalance.value = "0";
      } else if (
        err.message?.includes("403") ||
        err.message?.includes("Access forbidden")
      ) {
        // RPC rate limit - don't show error, just set balance to unknown
        console.warn("[useSolanaWallet] RPC rate limited, balance unavailable");
        batBalance.value = "?";
        error.value = ""; // Clear error, rate limits are temporary
      } else {
        error.value = "Failed to fetch BAT balance";
        batBalance.value = "0";
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Send BAT SPL token tip
  const sendBATTip = async (amount: string): Promise<boolean> => {
    if (!isConnected.value || !address.value || !solanaProvider.value) {
      error.value = "Wallet not connected";
      return false;
    }

    try {
      isLoading.value = true;
      error.value = "";

      console.log("[useSolanaWallet] Creating transaction for", amount, "BAT");

      const result = await retryWithNextRPC(async (conn) => {
        const walletPublicKey = new PublicKey(address.value!);
        const recipientPublicKey = new PublicKey(TIP_RECIPIENT_ADDRESS_SOLANA);
        const mintPublicKey = new PublicKey(BAT_SPL_MINT_ADDRESS);

        console.log("[useSolanaWallet] Wallet:", walletPublicKey.toBase58());
        console.log(
          "[useSolanaWallet] Recipient:",
          recipientPublicKey.toBase58()
        );
        console.log("[useSolanaWallet] BAT Mint:", mintPublicKey.toBase58());

        // Warn if sending to self (for testing purposes)
        if (walletPublicKey.toBase58() === recipientPublicKey.toBase58()) {
          console.warn(
            "[useSolanaWallet] ⚠️  WARNING: Sending BAT to yourself! Update TIP_RECIPIENT_ADDRESS_SOLANA in web3.ts config."
          );
        }

        // Get the associated token accounts
        const fromTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          walletPublicKey
        );

        const toTokenAccount = await getAssociatedTokenAddress(
          mintPublicKey,
          recipientPublicKey
        );

        console.log(
          "[useSolanaWallet] From token account:",
          fromTokenAccount.toBase58()
        );
        console.log(
          "[useSolanaWallet] To token account:",
          toTokenAccount.toBase58()
        );

        // Convert amount to smallest unit (typically 18 decimals for BAT)
        const decimals = 18; // BAT on Solana uses 18 decimals
        const amountInSmallestUnit = BigInt(
          Math.floor(parseFloat(amount) * Math.pow(10, decimals))
        );

        console.log(
          "[useSolanaWallet] Amount in smallest unit:",
          amountInSmallestUnit.toString()
        );

        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          walletPublicKey,
          amountInSmallestUnit,
          [],
          TOKEN_PROGRAM_ID
        );

        console.log("[useSolanaWallet] Transfer instruction created");

        // Get recent blockhash
        const { blockhash } = await conn.getLatestBlockhash();

        // Create transaction
        const transaction = new Transaction({
          recentBlockhash: blockhash,
          feePayer: walletPublicKey,
        }).add(transferInstruction);

        console.log(
          "[useSolanaWallet] Transaction created with",
          transaction.instructions.length,
          "instruction(s)"
        );
        console.log("[useSolanaWallet] Transaction details:", transaction);

        // Sign and send transaction
        const { signature } = await solanaProvider.value.signAndSendTransaction(
          transaction
        );

        // Wait for confirmation
        await conn.confirmTransaction(signature, "confirmed");

        return signature;
      });

      console.log("[useSolanaWallet] Transaction successful:", result);

      // Refresh balance
      await fetchBATBalance();

      return true;
    } catch (err: any) {
      console.error("Failed to send BAT tip:", err);

      if (err.message?.includes("User rejected")) {
        error.value = "Transaction was rejected";
      } else if (err.message?.includes("insufficient")) {
        error.value = "Insufficient BAT balance";
      } else if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        error.value =
          "RPC authentication failed. Using free endpoint with limited transaction support.";
      } else {
        error.value = "Transaction failed. Please try again.";
      }

      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    address,
    isConnected,
    isWalletAvailable,
    batBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    fetchBATBalance,
    sendBATTip,
  };
}
