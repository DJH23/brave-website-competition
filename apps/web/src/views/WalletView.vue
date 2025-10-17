<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BATIntegration from '../components/BATIntegration.vue';
import BATPriceTicker from '../components/BATPriceTicker.vue';
import Button from '../components/Button.vue';
import { useWallet } from '../composables/useWallet';
import { useWeb3Modal } from '@web3modal/ethers/vue';

const { isConnected, address, batBalance, connectWallet, fetchBATBalance } = useWallet();
const { open } = useWeb3Modal();

const shortenAddress = computed(() => {
    if (!address.value) return '';
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
});

// Fetch balance when connected
watch(isConnected, (connected) => {
    if (connected) {
        fetchBATBalance();
    }
});

const disconnect = () => {
    open({ view: 'Account' });
};
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 
                           bg-clip-text text-transparent">
                    💰 Brave Wallet & BAT
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Your gateway to Web3, privacy, and decentralized finance.
                    No extensions needed — built right into Brave Browser.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 
                        backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Why Wallets Matter (Even for Beginners)
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        Think of a <strong class="text-orange-400">crypto wallet</strong> like your
                        own personal bank — except <strong>you're in complete control</strong>.
                        No company can freeze your account, track your purchases, or take a cut.
                    </p>
                    <p>
                        <strong class="text-purple-400">Basic Attention Token (BAT)</strong> is a
                        cryptocurrency built for the internet economy. Use it to:
                    </p>
                    <ul class="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Tip creators</strong> directly without ads or middlemen</li>
                        <li><strong>Earn rewards</strong> for viewing privacy-respecting ads</li>
                        <li><strong>Support websites</strong> you love automatically</li>
                        <li><strong>Trade and invest</strong> in the decentralized economy</li>
                    </ul>
                    <p class="text-sm text-gray-400 mt-4">
                        🔒 <strong>Privacy note:</strong> Brave Wallet is non-custodial, meaning
                        <em>only you</em> have access to your funds. Not even Brave can see your balance.
                    </p>
                </div>
            </div>
        </div>

        <!-- BAT Price Ticker -->
        <div class="max-w-3xl mx-auto mb-12">
            <BATPriceTicker />
        </div>

        <!-- Wallet Connection Card -->
        <div class="max-w-3xl mx-auto mb-16">
            <div class="bg-gradient-to-br from-orange-500/20 to-purple-500/20 
                        backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    Connect Your Brave Wallet
                </h2>

                <div v-if="!isConnected" class="text-center space-y-6">
                    <p class="text-gray-300">
                        Connect your Brave Wallet to see your BAT balance, tip creators,
                        and interact with Web3 features.
                    </p>
                    <Button variant="primary" size="lg" @click="connectWallet">
                        🦁 Connect Wallet
                    </Button>
                    <p class="text-sm text-gray-400">
                        Don't have Brave?
                        <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer"
                            class="text-orange-400 hover:text-orange-300 underline">
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

        <!-- BAT Tipping Demo -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 class="text-3xl font-bold text-white mb-6 text-center">
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
            <h2 class="text-3xl font-bold text-white mb-8 text-center">
                Getting Started with BAT
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-orange-400 mb-3">🎁 Earn BAT Free</h3>
                    <p class="text-gray-300">
                        Enable Brave Rewards in your browser settings. You'll earn BAT automatically
                        by viewing privacy-respecting ads. Opt-in only — no ads if you don't want them.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-purple-400 mb-3">💳 Buy BAT</h3>
                    <p class="text-gray-300">
                        Purchase BAT on major exchanges like Coinbase, Binance, or Gemini.
                        Transfer to your Brave Wallet for full control and privacy.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-pink-400 mb-3">❤️ Auto-Contribute</h3>
                    <p class="text-gray-300">
                        Set up monthly auto-contributions to support your favorite sites automatically
                        based on your browsing time. Effortless creator support.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-blue-400 mb-3">🎯 One-Click Tips</h3>
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
                        🛡️ Privacy Demos
                    </Button>
                </RouterLink>
                <RouterLink to="/search">
                    <Button variant="secondary" size="lg">
                        🔍 Try Brave Search
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
