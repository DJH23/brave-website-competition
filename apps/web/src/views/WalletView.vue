<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BATIntegration from '../components/BATIntegration.vue';
import BATPriceTicker from '../components/BATPriceTicker.vue';
import BraveFlowChart from '../components/BraveFlowChart.vue';
import Button from '../components/Button.vue';
import { useMultiChainWallet } from '../composables/useMultiChainWallet';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const { isConnected, address, batBalance, connectWallet, fetchBATBalance, disconnectWallet } = useMultiChainWallet();

const shortenAddress = computed(() => {
    if (!address.value) return '';
    const addr = address.value.toString();
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
});

watch(isConnected, (connected) => {
    if (connected) {
        fetchBATBalance();
    }
});

const disconnect = async () => {
    await disconnectWallet();
};

// Reveal on scroll for main headings
const walletHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: walletVisible } = useIntersectionObserver(walletHeadingRef, { threshold: 0.1, once: true });

const batTippingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: batTippingVisible } = useIntersectionObserver(batTippingRef, { threshold: 0.1, once: true });

// "Why This Matters" load transition visibility
const whyMattersRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: whyMattersVisible } = useIntersectionObserver(whyMattersRef, { threshold: 0.1, once: true });

// Comparison data (responsive + perspective toggle)
const perspective = ref<'users' | 'creators'>('users');

const wallets = [
    { key: 'brave', label: 'Brave Wallet' },
    { key: 'metamask', label: 'MetaMask' },
    { key: 'coinbase', label: 'Coinbase Wallet' },
    { key: 'custodial', label: 'Exchange Wallets' }
];

type Cell = { text: string; icon?: string; color?: string };
type Row = { label: string; cells: Cell[] };

const userRows: Row[] = [
    {
        label: 'Privacy protection',
        cells: [
            { text: 'No tracking', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Some analytics', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Account data', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Full KYC required', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'Built-in browser',
        cells: [
            { text: 'Native integration', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Extension required', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Extension required', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Separate app', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'Earn while browsing',
        cells: [
            { text: 'BAT Rewards', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'No', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'No', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'No', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'Multi-chain support',
        cells: [
            { text: 'Ethereum + Solana', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Ethereum only', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Multi-chain', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Limited', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Self-custody',
        cells: [
            { text: 'Full control', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Full control', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Full control', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Exchange holds keys', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    }
];

const creatorRows: Row[] = [
    {
        label: 'Direct payments',
        cells: [
            { text: 'BAT tips + auto-contribute', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Manual setup required', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Manual setup required', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'No direct tipping', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'Creator registration',
        cells: [
            { text: 'Free & simple', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Technical setup', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Technical setup', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'N/A', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'User discovery',
        cells: [
            { text: 'Verified creators list', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'No discovery', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'No discovery', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'N/A', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    },
    {
        label: 'Transaction fees',
        cells: [
            { text: 'Network fees only', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Network fees only', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Network fees only', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Exchange fees', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Privacy for supporters',
        cells: [
            { text: 'Anonymous tipping', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Public addresses', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Public addresses', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Account-based', icon: 'bi-x-circle-fill', color: 'text-red-400' }
        ]
    }
];

const currentRows = () => (perspective.value === 'users' ? userRows : creatorRows);
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 ref="walletHeadingRef"
                    class="text-5xl md:text-6xl font-bold text-gradient-blue transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !walletVisible, 'opacity-100 translate-y-0': walletVisible }">
                    <i class="bi bi-wallet2" aria-hidden="true"></i> Brave Wallet & BAT
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Your gateway to Web3, privacy, and decentralized finance.
                    No extensions needed — built right into Brave Browser.
                </p>
            </div>

        </div>

        <!-- Why This Matters (Comparison Table) -->
        <div class="max-w-7xl mx-auto mb-16">
            <h2 ref="whyMattersRef"
                class="text-3xl md:text-4xl font-bold mb-8 text-left transition-all duration-700 text-gradient-blue"
                :class="{ 'opacity-0 translate-y-8': !whyMattersVisible, 'opacity-100 translate-y-0': whyMattersVisible }">
                Why This Matters
            </h2>
            <div class="mt-12 glass rounded-2xl p-6 md:p-8">
                <!-- Perspective toggle -->
                <div class="flex items-center justify-center gap-3 mb-6">
                    <button type="button"
                        class="px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors inline-flex items-center gap-2 tracking-wide"
                        :class="perspective === 'users' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-300 hover:bg-white/5'"
                        :aria-pressed="perspective === 'users'" @click="() => { perspective = 'users' }">
                        <i class="bi bi-people text-braveBlue" aria-hidden="true"></i>
                        <span>For Users</span>
                    </button>
                    <button type="button"
                        class="px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors inline-flex items-center gap-2 tracking-wide"
                        :class="perspective === 'creators' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-300 hover:bg-white/5'"
                        :aria-pressed="perspective === 'creators'" @click="() => { perspective = 'creators' }">
                        <i class="bi bi-music-note-beamed text-braveBlue" aria-hidden="true"></i>
                        <span>For Creators</span>
                    </button>
                </div>
                <div class="overflow-x-auto overflow-y-hidden">
                    <Transition name="fade-slide" mode="out-in">
                        <div :key="perspective">
                            <!-- Desktop/tablet table -->
                            <table class="min-w-full text-left text-base hidden md:table">
                                <caption class="sr-only">Wallet comparison across platforms</caption>
                                <thead>
                                    <tr class="text-gray-400">
                                        <th scope="col" class="py-3 pr-6">Criteria</th>
                                        <th v-for="w in wallets" :key="w.key" scope="col" class="py-3 pr-6">{{ w.label
                                            }}</th>
                                    </tr>
                                </thead>
                                <tbody class="align-top">
                                    <tr v-for="row in currentRows()" :key="row.label" class="border-t border-white/10">
                                        <th scope="row" class="py-4 pr-6 font-semibold text-white">{{ row.label }}</th>
                                        <td v-for="(w, idx) in wallets" :key="w.key" class="py-4 pr-6">
                                            <span class="inline-flex items-center gap-2">
                                                <i v-if="row.cells[idx]?.icon"
                                                    :class="['bi', row.cells[idx].icon, row.cells[idx].color]"
                                                    aria-hidden="true"></i>
                                                <span>{{ row.cells[idx]?.text }}</span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Mobile stacked cards -->
                            <div class="md:hidden space-y-4">
                                <div v-for="(w, pIdx) in wallets" :key="w.key" class="glass rounded-xl p-4">
                                    <div class="text-white font-semibold mb-2 flex items-center gap-2 text-base">
                                        <i v-if="w.key === 'brave'" class="bi bi-shield-check text-braveBlue"
                                            aria-hidden="true"></i>
                                        <i v-else-if="w.key === 'metamask'" class="bi bi-fox text-orange-400"
                                            aria-hidden="true"></i>
                                        <i v-else-if="w.key === 'coinbase'" class="bi bi-wallet text-blue-400"
                                            aria-hidden="true"></i>
                                        <i v-else class="bi bi-building text-gray-400" aria-hidden="true"></i>
                                        {{ w.label }}
                                    </div>
                                    <ul class="space-y-2">
                                        <li v-for="row in currentRows()" :key="row.label"
                                            class="flex items-start justify-between gap-3 border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
                                            <span class="text-gray-400 text-sm">{{ row.label }}</span>
                                            <span class="text-white inline-flex items-center gap-2 text-base">
                                                <i v-if="row.cells[pIdx]?.icon"
                                                    :class="['bi', row.cells[pIdx].icon, row.cells[pIdx].color]"
                                                    aria-hidden="true"></i>
                                                <span>{{ row.cells[pIdx]?.text }}</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Informative Quote -->
                <div class="mt-8 pt-8 border-t border-white/10">
                    <blockquote class="relative px-10 py-8 md:px-12 md:py-8 text-center">
                        <i class="bi bi-quote text-4xl md:text-6xl text-braveBlue/80 absolute top-4 left-4 md:top-0 md:left-0"
                            aria-hidden="true"></i>
                        <p
                            class="text-lg md:text-xl text-gray-200 italic leading-relaxed max-w-4xl mx-auto relative z-10 px-4">
                            Think of a crypto wallet like your own personal bank — except you're in complete control. No
                            company can freeze your account, track your purchases, or take a cut.
                        </p>
                        <i class="bi bi-quote text-4xl md:text-6xl text-braveBlue/80 absolute bottom-4 right-4 md:bottom-0 md:right-0 rotate-180"
                            aria-hidden="true"></i>
                    </blockquote>
                </div>
            </div>
        </div>

        <!-- Why This Matters -->
        <div class="mt-12 glass rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <i class="bi bi-lightbulb text-yellow-400" aria-hidden="true"></i>
                Why Wallets Matter (Even for Beginners)
            </h2>
            <div class="space-y-4 text-gray-300">
                <p>
                    Think of a <strong class="text-braveOrange">crypto wallet</strong> like your
                    own personal bank — except <strong>you're in complete control</strong>.
                    No company can freeze your account, track your purchases, or take a cut.
                </p>
                <p>
                    <strong class="text-bravePurple">Basic Attention Token (BAT)</strong> is a
                    cryptocurrency built for the internet economy. Use it to:
                </p>
                <ul class="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Tip creators</strong> directly without ads or middlemen</li>
                    <li><strong>Earn rewards</strong> for viewing privacy-respecting ads</li>
                    <li><strong>Support websites</strong> you love automatically</li>
                    <li><strong>Trade and invest</strong> in the decentralized economy</li>
                </ul>
                <p class="text-sm text-gray-400 mt-4">
                    <i class="bi bi-shield-lock"></i> <strong>Privacy note:</strong> Brave Wallet is non-custodial,
                    meaning
                    <em>only you</em> have access to your funds. Not even Brave can see your balance.
                </p>
            </div>
        </div>
        <!-- BAT Price Ticker -->
        <div class="max-w-3xl mx-auto mb-12">
            <BATPriceTicker />
        </div>

        <!-- Wallet Connection Card -->
        <div class="max-w-3xl mx-auto mb-16">
            <div class="glass rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    Connect Your Brave Wallet
                </h2>

                <div v-if="!isConnected" class="text-center space-y-6">
                    <p class="text-gray-300">
                        Connect your Brave Wallet to see your BAT balance, tip creators,
                        and interact with Web3 features.
                    </p>
                    <Button variant="primary" size="lg" @click="connectWallet">
                        <i class="bi bi-wallet2"></i> Connect Wallet
                    </Button>
                    <p class="text-sm text-gray-400">
                        Don't have Brave?
                        <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer"
                            class="text-braveOrange hover:text-orange-300 underline">
                            Download it here
                        </a>
                    </p>
                </div>

                <div v-else class="space-y-6">
                    <!-- Wallet Info -->
                    <div class="bg-black/30 rounded-xl p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-400">Connected Address</span>
                            <span class="text-white font-mono">{{ shortenAddress }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-400">BAT Balance</span>
                            <span class="text-2xl font-bold text-orange-400">
                                {{ batBalance }} BAT
                            </span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4 justify-center">
                        <Button variant="secondary" @click="disconnect">
                            Disconnect
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- BAT Ecosystem Flow -->
        <div class="max-w-7xl mx-auto mb-16">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gradient-blue mb-4">
                    Complete BAT Ecosystem Guide
                </h2>
                <p class="text-gray-300 text-lg max-w-3xl mx-auto">
                    Explore the complete journey for both users and creators in the Brave Rewards ecosystem
                </p>
            </div>
            <BraveFlowChart />
        </div>

        <!-- BAT Tipping Demo -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="glass rounded-2xl p-8">
                <h2 ref="batTippingRef"
                    class="text-3xl font-bold text-gradient-blue mb-6 text-center transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !batTippingVisible, 'opacity-100 translate-y-0': batTippingVisible }">
                    Try BAT Tipping
                </h2>
                <p class="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                    Experience the future of creator support. Tip instantly with no fees or tracking.
                </p>
                <BATIntegration />
            </div>
        </div>

        <!-- How It Works -->
        <div class="max-w-5xl mx-auto">
            <h2 class="text-3xl font-bold text-gradient-blue mb-8 text-center">
                Getting Started with BAT
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-braveOrange mb-3"><i class="bi bi-gift"></i> Earn BAT Free</h3>
                    <p class="text-gray-300">
                        Enable Brave Rewards in your browser settings. You'll earn BAT automatically
                        by viewing privacy-respecting ads. Opt-in only — no ads if you don't want them.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-bravePurple mb-3"><i class="bi bi-credit-card"></i> Buy BAT</h3>
                    <p class="text-gray-300">
                        Purchase BAT on major exchanges like Coinbase, Binance, or Gemini.
                        Transfer to your Brave Wallet for full control and privacy.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-pink-400 mb-3"><i class="bi bi-heart-fill"></i> Auto-Contribute
                    </h3>
                    <p class="text-gray-300">
                        Set up monthly auto-contributions to support your favorite sites automatically
                        based on your browsing time. Effortless creator support.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-braveBlue mb-3"><i class="bi bi-cursor"></i> One-Click Tips</h3>
                    <p class="text-gray-300">
                        Send tips instantly from any Brave-verified site. No forms, no sign-ups.
                        Just click the BAT icon and choose your amount.
                    </p>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3 class="text-2xl font-bold text-white">
                Explore more privacy features
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
                <RouterLink to="/privacy">
                    <Button variant="primary" size="lg">
                        <i class="bi bi-shield-check"></i> Privacy Demos
                    </Button>
                </RouterLink>
                <RouterLink to="/search">
                    <Button variant="secondary" size="lg">
                        <i class="bi bi-search"></i> Try Brave Search
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 300ms var(--ease-standard, cubic-bezier(.22, .61, .36, 1)), transform 300ms var(--ease-standard, cubic-bezier(.22, .61, .36, 1));
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
