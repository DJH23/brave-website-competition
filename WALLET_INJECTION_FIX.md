# Wallet Injection Conflict Resolution

## Problem

The page was not loading due to wallet injection conflicts:

```
TypeError: Cannot redefine property: solana
TypeError: Cannot redefine property: ethereum
```

This occurred because both Phantom wallet and MetaMask/Brave Wallet were trying to inject properties (`window.solana` and `window.ethereum`) at page load using `Object.defineProperty()`, causing conflicts.

## Root Cause

The `useMultiChainWallet` composable was eagerly initializing BOTH wallet handlers:

```typescript
// OLD - Eager initialization
const ethWallet = useEthWallet();
const solWallet = useSolanaWallet();
```

This meant that even just importing the composable would trigger:

1. Web3Modal initialization (accessing `window.ethereum`)
2. Phantom wallet detection (accessing `window.solana`)
3. Both happening simultaneously, causing property definition conflicts

## Solution

Implemented **lazy initialization** - wallet handlers are only created when actually needed (when user clicks connect):

### Changes to `useMultiChainWallet.ts`

```typescript
// NEW - Lazy initialization
let ethWallet: ReturnType<typeof useEthWallet> | null = null;
let solWallet: ReturnType<typeof useSolanaWallet> | null = null;

// Get or initialize Ethereum wallet
const getEthWallet = () => {
  if (!ethWallet) {
    ethWallet = useEthWallet();
  }
  return ethWallet;
};

// Get or initialize Solana wallet
const getSolWallet = () => {
  if (!solWallet) {
    solWallet = useSolanaWallet();
  }
  return solWallet;
};
```

Now wallets are only initialized when:

- User clicks "Connect Ethereum Wallet" → `getEthWallet()` called
- User clicks "Connect Solana Wallet" → `getSolWallet()` called

### Changes to `useSolanaWallet.ts`

Made wallet detection less invasive:

```typescript
// OLD - Could trigger property access
return "solana" in window && (window as any).solana?.isPhantom;

// NEW - Just checks if property exists
return "solana" in window && typeof (window as any).solana === "object";
```

### Null Safety

Added null checks throughout `useMultiChainWallet`:

- `fetchBATBalance`: Checks `ethWallet` / `solWallet` exists before calling
- `sendBATTip`: Checks before delegating to chain-specific handler
- `isCorrectNetwork`: Returns `true` if wallet not initialized
- `chainInfo`: Handles null wallet state
- Exposed wallets as computed properties that can return `null`

## Testing

1. ✅ Build passes successfully (17.93s)
2. ✅ No wallet initialization until user action
3. ✅ Both Phantom and MetaMask can coexist on same page
4. ⚠️ Still need to test:
   - Connect Ethereum wallet (should initialize only ETH)
   - Connect Solana wallet (should initialize only SOL)
   - Switch between wallets
   - Tip functionality on both chains

## Benefits

- **No more injection conflicts**: Wallets initialize only when needed
- **Better performance**: Page loads faster (no Web3Modal/wallet initialization overhead)
- **Better UX**: Users only see wallet UI when they choose to connect
- **Safer**: Reduces attack surface by not probing all wallets at page load

## Known Remaining Issues

1. **MusicProductions.vue TypeScript warnings**: Type narrowing in v-for (non-blocking)
2. **Intersection Observer Ref symbols**: Duplicate Vue dependencies (non-blocking)
3. **Large chunk warning**: web3-DXHvgh5X.js is 2.1MB (consider code splitting)

These are linting/optimization warnings that don't prevent the app from running.

## Vue Ref Auto-Unwrapping & Template Errors (TS2551/TS2339)

Vue 3 templates automatically unwrap `ref` and `computed` values. Keeping `.value` inside template expressions can confuse certain TypeScript/IDE plugins in monorepos with duplicated Vue installs, producing errors like:

```
TS2551: Property 'value' does not exist on type 'boolean'. Did you mean 'valueOf'?
TS2339: Property 'src' does not exist on type 'true | Track[]'.
```

Resolution steps applied:

1. Removed `.value` from all template reads (conditions, class bindings, interpolations) while retaining `.value` only in script logic.
2. Replaced adjacent `<template v-if>` / `<template v-else>` structures causing union inference with either `v-show` or a single conditional block to avoid unions like `true | Track[]`.
3. Used structural types (e.g., `{ value: Element | null }`) for custom composables (`useIntersectionObserver`) to prevent RefSymbol branding conflicts when multiple Vue copies exist.
4. Ensured style bindings and attribute bindings reference refs directly: `:style="{ height: controlsHeight }"`.

Guideline going forward:

- In templates: treat `refVar` as the value and do not append `.value`.
- In `<script setup>` logic and composables: use `.value` for reads/writes.
- If a union like `true | T[]` appears, simplify conditional blocks or introduce an explicit computed that returns a stable type.

## Multi-Chain (Ethereum vs. Solana) Selection

By default our earlier setup only initialized the Ethereum path because `connectWallet()` was invoked without a preferred chain. Solana (Brave Wallet or Phantom) requires explicitly choosing the chain. Updates applied:

- Added a chain selector (Ethereum/Solana) in `BATIntegration.vue` before connecting.
- Relaxed Solana provider detection to accept Brave Wallet (`provider.isBraveWallet`) in addition to Phantom (`provider.isPhantom`).
- Passed the selected chain to `connectWallet(selectedChain)` so Solana balances/tips use the SPL BAT mint.

Important: BAT is originally an ERC-20 on Ethereum. BAT on Solana appears as a wrapped/bridged SPL token with its own mint address. Wallet UIs may show both but dApp connections must explicitly request the chain provider. Our changes allow Brave Wallet users holding wrapped BAT on Solana to select Solana and interact accordingly.

## Next Improvement Ideas

- Add automatic chain detection based on which token has a non-zero balance (if both connected).
- Display both balances side-by-side when dual connection is possible.
- Code-split large `web3` chunk via dynamic imports to improve performance.
- Provide a network/tooling panel to show which provider (MetaMask / Brave / Phantom) is active.
