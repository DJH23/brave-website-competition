# Multi-Chain BAT Tipping Support

## Overview

The wallet system now supports **both Ethereum and Solana** for BAT tipping, with automatic chain detection based on the connected wallet.

## Supported Chains

### Ethereum (EVM)

- **Network**: Ethereum Mainnet (Chain ID: 1)
- **BAT Token**: ERC-20 at `0x0D8775F648430679A709E98d2b0Cb6250d2887EF`
- **Recipient Address**: `0xa885b6ee5cb0bfab570a7ae2d4dd4405b0f39c69` (djh23.brave domain owner)
- **Wallets Supported**: MetaMask, WalletConnect, Coinbase Wallet, Brave Wallet, and more via Web3Modal

### Solana

- **Network**: Solana Mainnet-Beta
- **BAT Token**: SPL Token with mint `EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz`
- **Recipient Address**: `CFaA4Pv9ECnWomWPFMArQADvZZkiCvK6E6VyvFQMENfd`
- **Wallets Supported**: Phantom, Solflare, and other Solana wallets

## Architecture

### Configuration (`apps/web/src/config/web3.ts`)

- Defines both Ethereum and Solana constants (token addresses, recipient addresses, RPC URLs)
- Exports `solanaConfig` for Solana-specific initialization
- Maintains backward compatibility with existing `TIP_RECIPIENT_ADDRESS` export

### Composables

#### `useWallet.ts` (Ethereum/EVM)

- Original Ethereum-focused wallet composable
- Handles ERC-20 BAT token operations
- Uses Web3Modal with ethers.js

#### `useSolanaWallet.ts` (NEW)

- Solana-specific wallet operations
- Handles SPL token operations via `@solana/spl-token`
- Connects to Phantom and other Solana wallets
- Auto-detects wallet availability

#### `useMultiChainWallet.ts` (NEW - Unified Interface)

- **Auto-detects connected chain** (Ethereum vs Solana)
- Routes operations to appropriate wallet handler
- Provides unified API for components
- Exposes `activeChain` computed property

## Usage

### Basic Usage (Auto-Detection)

```typescript
import { useMultiChainWallet } from "@/composables/useMultiChainWallet";

const {
  activeChain, // 'ethereum' | 'solana' | null
  address, // Connected wallet address
  isConnected, // Boolean
  batBalance, // String (formatted)
  connectWallet, // async () => void
  sendBATTip, // async (amount: string) => boolean
  chainInfo, // Chain metadata
} = useMultiChainWallet();

// Connect (shows wallet options automatically)
await connectWallet();

// Send tip (routes to correct chain automatically)
await sendBATTip("10"); // 10 BAT
```

### Preferred Chain Connection

```typescript
// Force Solana connection
await connectWallet("solana");

// Force Ethereum connection (default)
await connectWallet("ethereum");
```

### Direct Chain Access

```typescript
const { ethereumWallet, solanaWallet } = useMultiChainWallet();

// Access Ethereum-specific features
console.log(ethereumWallet.chainId.value);
console.log(ethereumWallet.isCorrectNetwork.value);

// Access Solana-specific features
console.log(solanaWallet.isWalletAvailable.value);
```

## How It Works

1. **User Clicks "Connect Wallet"**

   - Default: Shows Web3Modal (Ethereum wallets)
   - If Phantom/Solana wallet detected and preferred: Connects to Solana

2. **Auto-Detection**

   - `useMultiChainWallet` watches connection states
   - Sets `activeChain` to 'ethereum' or 'solana'
   - Routes all subsequent operations to correct handler

3. **Balance Fetching**

   - Ethereum: Reads ERC-20 `balanceOf()` via ethers.js
   - Solana: Reads SPL token account balance via `@solana/web3.js`

4. **Tipping**
   - Ethereum: ERC-20 `transfer()` to `0xa885b6ee5cb0bfab570a7ae2d4dd4405b0f39c69`
   - Solana: SPL token transfer to `CFaA4Pv9ECnWomWPFMArQADvZZkiCvK6E6VyvFQMENfd`

## Migration Guide

### For Existing Components Using `useWallet`

**Option 1: Keep using `useWallet` (Ethereum only)**

```typescript
// No changes needed - continues to work for Ethereum
import { useWallet } from "@/composables/useWallet";
```

**Option 2: Upgrade to multi-chain support**

```typescript
// Replace import
- import { useWallet } from '@/composables/useWallet';
+ import { useMultiChainWallet } from '@/composables/useMultiChainWallet';

// Update destructuring (API is nearly identical)
- const { address, isConnected, ... } = useWallet();
+ const { address, isConnected, activeChain, ... } = useMultiChainWallet();

// Add chain indicator in UI (optional)
<div v-if="activeChain">
  Connected to: {{ chainInfo.name }}
</div>
```

## Dependencies Added

```json
{
  "@web3modal/solana": "^5.1.11",
  "@solana/web3.js": "latest",
  "@solana/spl-token": "latest"
}
```

## Testing

### Ethereum Testing

1. Connect MetaMask or Brave Wallet
2. Switch to Ethereum Mainnet
3. Ensure you have some BAT tokens
4. Try tipping

### Solana Testing

1. Install Phantom wallet extension
2. Switch to Solana Mainnet
3. Ensure you have BAT SPL tokens (mint: `EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz`)
4. Try tipping

## Troubleshooting

### "Please install a Solana wallet"

- Install Phantom or another Solana wallet extension

### "Switch to Ethereum Mainnet"

- Your EVM wallet is on the wrong network
- Switch to Ethereum Mainnet (Chain ID: 1)

### "Insufficient BAT balance"

- You need BAT tokens on the connected chain
- For Ethereum: ERC-20 BAT
- For Solana: SPL BAT (specific mint address)

### Balance shows 0 but I have tokens

- **Ethereum**: Make sure you're on Mainnet (not testnet)
- **Solana**: Verify the token mint address matches `EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz`

## Future Enhancements

- [ ] Add explicit chain switcher UI
- [ ] Support bridging guidance (Ethereum ↔ Solana)
- [ ] Add more Solana wallet support (Solflare, Glow)
- [ ] Display transaction history
- [ ] Show gas/transaction fees before confirmation
- [ ] Add multi-recipient support

## References

- Ethereum BAT Contract: https://etherscan.io/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef
- Solana BAT Mint: https://solscan.io/token/EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz
- djh23.brave Domain: Links to both Ethereum and Solana addresses
