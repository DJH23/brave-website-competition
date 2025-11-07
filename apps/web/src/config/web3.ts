import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/vue";

// BAT Token Contract Address (Ethereum Mainnet)
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

// Recipient address for tips (replace with your actual address)
export const TIP_RECIPIENT_ADDRESS =
  "0x0000000000000000000000000000000000000000";

// Project ID from WalletConnect Cloud
const projectId = "df3ca29aad8ad7e6d5fde6193a7cb6c0";

// Metadata for your dApp
const metadata = {
  name: "Privacy-First Creator Hub",
  description: "Brave-inspired creator platform with BAT tipping",
  url: "https://djh23.brave",
  icons: ["https://djh23.brave/logo.svg"],
};

// Create Web3Modal configuration
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: false,
  rpcUrl: "https://eth.llamarpc.com",
  defaultChainId: 1,
});

// Create and export the modal instance
export const web3Modal = createWeb3Modal({
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
