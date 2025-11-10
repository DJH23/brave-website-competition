<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useMultiChainWallet, type ChainType } from "../composables/useMultiChainWallet";
import { useBATPrice } from "../composables/useBATPrice";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import Card from "./Card.vue";
import Button from "./Button.vue";
import BATPriceTicker from "./BATPriceTicker.vue";
import TipConfirmationModal from "./TipConfirmationModal.vue";

const {
    address,
    isConnected,
    batBalance,
    isLoading,
    error,
    connectWallet,
    fetchBATBalance,
    sendBATTip,
    activeChain,
    chainInfo
} = useMultiChainWallet();

const { batPrice } = useBATPrice();

const tipAmount = ref<string>("1");
const showWalletInfo = ref(false);
const showConfirmation = ref(false);
const lastTransactionHash = ref<string>("");

// Chain selection for connection
const selectedChain = ref<ChainType>("ethereum");

const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const searchLoading = ref(false);
const searchError = ref("");

// Reveal on scroll
const batHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: batHeadingVisible } = useIntersectionObserver(batHeadingRef, { threshold: 0.1, once: true });

watch(isConnected, async (connected) => {
    if (connected) {
        await fetchBATBalance();
    }
});

const batBalanceUSD = computed(() => {
    const balance = parseFloat(batBalance.value || "0");
    const price = batPrice.value?.usd || 0;
    return (balance * price).toFixed(2);
});

const tipAmountUSD = computed(() => {
    const amount = parseFloat(tipAmount.value || "0");
    const price = batPrice.value?.usd || 0;
    return (amount * price).toFixed(2);
});

const canSendTip = computed(() => {
    const balance = parseFloat(batBalance.value || "0");
    const amount = parseFloat(tipAmount.value || "0");
    return isConnected.value &&
        balance >= amount &&
        amount > 0 &&
        !isLoading.value;
});

const handleSendTip = async () => {
    if (!canSendTip.value) return;
    const success = await sendBATTip(tipAmount.value);
    if (success) {
        lastTransactionHash.value = "0x...";
        showConfirmation.value = true;
    }
};

const presetAmounts = [1, 5, 10, 25];

const searchBrave = async () => {
    searchLoading.value = true;
    searchError.value = "";
    searchResults.value = [];
    try {
        const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(searchQuery.value)}`);
        if (!response.ok) throw new Error("Backend search API error");
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        searchResults.value = (data.results || []).map((r: { title: string, url: string, description: string }) => ({
            title: r.title,
            url: r.url,
            description: r.description
        }));
        if (!searchResults.value.length) searchError.value = "No results found.";
    } catch (err) {
        if (typeof err === "object" && err && "message" in err) {
            searchError.value = (err as { message?: string }).message || "Search failed.";
        } else {
            searchError.value = "Search failed.";
        }
    } finally {
        searchLoading.value = false;
    }
};
</script>

<template>
    <TipConfirmationModal :is-open="showConfirmation" :tip-amount="tipAmount" :transaction-hash="lastTransactionHash"
        @close="() => { showConfirmation = false }" />

    <section class="py-12 px-6">
        <div class="max-w-7xl mx-auto">
            <h2 ref="batHeadingRef" class="text-4xl font-bold mb-4 text-gradient-rainbow transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !batHeadingVisible, 'opacity-100 translate-y-0': batHeadingVisible }">
                BAT & Brave Wallet Integration
            </h2>
            <p class="text-neutral-300 mb-8">
                Connect your Brave Wallet, MetaMask (Ethereum), or Phantom (Solana) to tip with real BAT tokens.<br>
                <a href="https://etherscan.io/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef" target="_blank"
                    rel="noopener noreferrer" class="underline text-braveOrange hover:text-bravePurple">View BAT on
                    Etherscan</a>
                &nbsp;|&nbsp;
                <a href="https://wallet-docs.brave.com/" target="_blank" rel="noopener noreferrer"
                    class="underline text-braveBlue hover:text-bravePurple">Brave Wallet Documentation</a>
            </p>

            <div class="mb-8">
                <BATPriceTicker />
            </div>

            <Button variant="secondary" size="sm" class="mb-6" @click="() => { showWalletInfo = true }">
                What is Brave Wallet?
            </Button>

            <div v-if="showWalletInfo" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                @click.self="() => { showWalletInfo = false }">
                <div class="glass-strong rounded-xl p-8 max-w-md w-full border border-bravePurple shadow-2xl relative">
                    <button class="absolute top-3 right-3 text-neutral-400 hover:text-white text-2xl leading-none"
                        @click="() => { showWalletInfo = false }" aria-label="Close info">
                        ×
                    </button>
                    <h3 class="text-2xl font-bold mb-3 text-gradient-purple">Brave Wallet Features</h3>
                    <ul class="list-disc pl-5 text-neutral-300 mb-3 space-y-1">
                        <li>Built into Brave Browser—no extensions required</li>
                        <li>Supports BAT, Ethereum, and other crypto assets</li>
                        <li>Private, secure, and easy to use</li>
                        <li>Send, receive, and manage tokens</li>
                        <li>Earn BAT via Brave Ads (opt-in)</li>
                        <li>Connect to dApps seamlessly</li>
                    </ul>
                    <a href="https://wallet-docs.brave.com/" target="_blank" rel="noopener noreferrer"
                        class="underline text-braveBlue hover:text-bravePurple">Read the full documentation</a>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-2">
                <Card title="Connect Your Wallet" variant="highlight">
                    <div v-if="!isConnected" class="text-center py-6">
                        <div class="text-6xl mb-4">���</div>
                        <p class="text-neutral-300 mb-6">
                            Connect your wallet to start tipping with BAT (Ethereum or Solana)
                        </p>
                        <!-- Chain selector -->
                        <div class="inline-flex items-center gap-2 mb-4" role="group" aria-label="Select blockchain">
                            <button type="button" @click="() => { selectedChain = 'ethereum' }"
                                :aria-pressed="selectedChain === 'ethereum'"
                                :class="['px-3 py-1 rounded-md text-sm font-medium', selectedChain === 'ethereum' ? 'bg-white/15 text-white' : 'text-neutral-300 hover:bg-white/5']">
                                Ethereum
                            </button>
                            <button type="button" @click="() => { selectedChain = 'solana' }"
                                :aria-pressed="selectedChain === 'solana'"
                                :class="['px-3 py-1 rounded-md text-sm font-medium', selectedChain === 'solana' ? 'bg-white/15 text-white' : 'text-neutral-300 hover:bg-white/5']">
                                Solana
                            </button>
                        </div>
                        <Button variant="primary"
                            @click="() => { connectWallet(selectedChain); }"
                            :disabled="isLoading">
                            {{ isLoading ? '⏳ Connecting...' : `🔗 Connect ${selectedChain === 'solana' ? 'Solana' :
                                'Ethereum'}` }}
                        </Button>
                        <p class="text-xs text-neutral-500 mt-4">
                            {{ selectedChain === 'solana' ? 'Solana via Brave Wallet or Phantom' : 'Ethereum via Web3Modal & ethers.js' }}
                        </p>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p class="text-red-600 text-sm">{{ error }}</p>
                        </div>

                        <div class="p-4 bg-gradient-to-br from-bravePurple/20 to-braveOrange/20 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-neutral-400">Your BAT Balance ({{ chainInfo?.name }})</span>
                                <span class="text-green-600 text-sm">● Connected</span>
                            </div>
                            <div class="text-3xl font-bold text-braveOrange">
                                {{ isLoading ? '...' : parseFloat(batBalance).toFixed(2) }} BAT
                            </div>
                            <div class="text-sm text-neutral-400 mt-1">
                                ≈ ${{ batBalanceUSD }} USD
                            </div>
                        </div>

                        <div class="p-3 glass rounded-lg">
                            <div class="text-xs text-neutral-400 mb-1">Connected Address</div>
                            <div class="font-mono text-xs text-neutral-300 truncate">
                                {{ address }}
                            </div>
                        </div>

                        <Button size="sm" variant="secondary" @click="fetchBATBalance" :disabled="isLoading"
                            class="w-full">
                            ��� Refresh Balance
                        </Button>
                    </div>
                </Card>

                <Card title="Support This Project">
                    <p class="text-neutral-300 mb-4">
                        Enjoy this privacy-first creator hub? Send a tip with BAT to support development.
                    </p>

                    <div v-if="isConnected" class="space-y-4">
                        <div>
                            <label class="text-sm text-neutral-400 block mb-2">Tip Amount (BAT)</label>
                            <div class="flex gap-2 mb-3">
                                <button v-for="amount in presetAmounts" :key="amount"
                                    @click="() => { tipAmount = amount.toString() }" :class="[
                                        'px-4 py-2 rounded-lg transition-all',
                                        tipAmount === amount.toString()
                                            ? 'bg-bravePurple text-white neon-glow'
                                            : 'bg-neutral-800 hover:bg-neutral-700',
                                    ]">
                                    {{ amount }}
                                </button>
                            </div>
                            <input v-model="tipAmount" type="number" step="0.1" min="0" placeholder="Custom amount"
                                class="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-bravePurple focus:outline-none" />
                        </div>

                        <div class="p-4 glass rounded-lg">
                            <div class="flex justify-between mb-2">
                                <span class="text-sm">You're sending</span>
                                <span class="font-semibold">{{ tipAmount }} BAT</span>
                            </div>
                            <div class="flex justify-between text-sm text-neutral-400">
                                <span>Value in USD</span>
                                <span>≈ ${{ tipAmountUSD }}</span>
                            </div>
                        </div>

                        <Button variant="primary" @click="handleSendTip" :disabled="!canSendTip" class="w-full">
                            <span v-if="isLoading">⏳ Processing...</span>
                            <span v-else>��� Send {{ tipAmount }} BAT Tip</span>
                        </Button>
                    </div>

                    <div v-else class="text-center py-6">
                        <p class="text-neutral-400 mb-4">
                            {{ isConnected ? 'Switch to Ethereum Mainnet to send tips' : 'Connect your wallet to send tips' }}
                        </p>
                        <Button v-if="!isConnected" variant="secondary" @click="() => connectWallet(selectedChain)">
                            Connect Wallet
                        </Button>
                    </div>
                </Card>
            </div>

            <div class="mt-12 grid gap-6 md:grid-cols-3">
                <Card hoverable>
                    <i class="bi-lightning-charge-fill text-3xl text-braveOrange mb-3"></i>
                    <h3 class="text-lg font-semibold mb-2 text-gradient-purple">Earn BAT</h3>
                    <p class="text-sm text-neutral-400">
                        Get paid in BAT for viewing privacy-respecting ads in Brave Browser.
                    </p>
                </Card>

                <Card hoverable>
                    <div class="text-3xl mb-3">���</div>
                    <h3 class="text-lg font-semibold mb-2 text-gradient-orange">Tip Creators</h3>
                    <p class="text-sm text-neutral-400">
                        Support your favorite websites and creators directly with BAT tips.
                    </p>
                </Card>

                <Card hoverable>
                    <div class="text-3xl mb-3">���</div>
                    <h3 class="text-lg font-semibold mb-2 text-gradient-blue">Privacy First</h3>
                    <p class="text-sm text-neutral-400">
                        All BAT transactions are private and don't require personal data.
                    </p>
                </Card>
            </div>

        </div>
    </section>
</template>
