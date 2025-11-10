import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/vue";
import { solana } from "@web3modal/solana/chains";

// ============================================================================
// ETHEREUM / EVM CONFIGURATION
// ============================================================================

// BAT Token Contract Address (Ethereum Mainnet ERC-20)
export const BAT_TOKEN_ADDRESS = "0x0D8775F648430679A709E98d2b0Cb6250d2887EF";

// BAT Token ABI (minimal interface for balance and transfer)
export const BAT_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

// Ethereum recipient address for tips (domain owner address)
export const TIP_RECIPIENT_ADDRESS_ETH =
  "0xa885b6ee5cb0bfab570a7ae2d4dd4405b0f39c69";

// ============================================================================
// SOLANA CONFIGURATION
// ============================================================================

// BAT SPL Token Mint Address on Solana
export const BAT_SPL_MINT_ADDRESS =
  "EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz";

// Solana recipient address for tips (CHANGE THIS TO YOUR ACTUAL RECIPIENT ADDRESS)
// Currently set to same as wallet for testing - YOU MUST CHANGE THIS!
export const TIP_RECIPIENT_ADDRESS_SOLANA =
  "1mWFauW7TmVVLWcSMojUFFqgoJJEYcJKUcyM3x1KccE";

// Solana RPC endpoint - using Helius with API key for reliable transactions
export const SOLANA_RPC_ENDPOINTS = [
  "https://mainnet.helius-rpc.com/?api-key=bb447e38-0879-4a4b-8781-8cd48897c775", // Helius (Fairyweed account - 100k requests/day)
  "https://solana.public-rpc.com", // Public RPC fallback
  "https://api.mainnet-beta.solana.com", // Official Solana RPC fallback
];
export const SOLANA_RPC_URL = SOLANA_RPC_ENDPOINTS[0]; // Primary endpoint

// ============================================================================
// WEB3MODAL CONFIGURATION
// ============================================================================

// Project ID from WalletConnect Cloud
const projectId = "df3ca29aad8ad7e6d5fde6193a7cb6c0";

// Metadata for your dApp
const metadata = {
  name: "Privacy-First Creator Hub",
  description:
    "Brave-inspired creator platform with multi-chain BAT tipping (Ethereum + Solana)",
  url: "https://djh23.brave",
  icons: ["https://djh23.brave/logo.svg"],
};

// Ethereum configuration
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: false,
  rpcUrl: "https://eth.llamarpc.com",
  defaultChainId: 1,
});

// Solana configuration
export const solanaConfig = {
  metadata,
  chains: [solana],
  projectId,
};

// Export configuration functions for lazy initialization
export function createEthereumModal() {
  return createWeb3Modal({
    ethersConfig,
    chains: [
      {
        chainId: 1,
        name: "Ethereum",
        currency: "ETH",
        explorerUrl: "https://etherscan.io",
        rpcUrl: "https://eth.llamarpc.com",
      },
    ],
    projectId,
    enableAnalytics: false,
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#7C3AED",
      "--w3m-border-radius-master": "8px",
    },
  });
}

// Backward compatibility export (points to Ethereum recipient)
export const TIP_RECIPIENT_ADDRESS = TIP_RECIPIENT_ADDRESS_ETH;
