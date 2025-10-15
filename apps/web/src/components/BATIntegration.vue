<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";

const walletConnected = ref(false);
const batBalance = ref(0);
const tipAmount = ref(1);
const showWalletInfo = ref(false);

// Brave Search API demo state
const searchQuery = ref("");
const searchResults = ref([]);
const searchLoading = ref(false);
const searchError = ref("");

const connectWallet = () => {
    // This is a mock integration. Real Brave Wallet API is not available yet.
    walletConnected.value = true;
    batBalance.value = 42.5; // Mock balance
};

const sendTip = () => {
    if (batBalance.value >= tipAmount.value) {
        batBalance.value -= tipAmount.value;
        alert(`✅ Thank you! ${tipAmount.value} BAT sent successfully.`);
    }
};

// Brave Search API demo
const searchBrave = async () => {
    searchLoading.value = true;
    searchError.value = "";
    searchResults.value = [];
    try {
        // Use backend proxy to avoid CORS issues
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
    <section class="py-12 px-6">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold mb-4 animate-fade-in">
                BAT & Brave Wallet Integration
            </h2>
            <p class="text-neutral-300 mb-8">
                <strong>Note:</strong> This is a mock integration for demonstration purposes. Real Brave Wallet API is
                not available yet.<br>
                <a href="https://etherscan.io/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef" target="_blank"
                    rel="noopener noreferrer" class="underline text-braveOrange hover:text-bravePurple">Learn about BAT
                    on Etherscan</a> &nbsp;|&nbsp;
                <a href="https://wallet-docs.brave.com/" target="_blank" rel="noopener noreferrer"
                    class="underline text-braveBlue hover:text-bravePurple">Brave Wallet Documentation</a>
            </p>
            <Button variant="secondary" size="sm" class="mb-6" @click="showWalletInfo = true">What is Brave
                Wallet?</Button>
            <div v-if="showWalletInfo" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                <div
                    class="bg-neutral-900 rounded-xl p-8 max-w-md w-full border border-bravePurple shadow-2xl relative">
                    <button class="absolute top-3 right-3 text-neutral-400 hover:text-white"
                        @click="showWalletInfo = false" aria-label="Close info">
                        &times;
                    </button>
                    <h3 class="text-2xl font-bold mb-3 text-bravePurple">Brave Wallet Features</h3>
                    <ul class="list-disc pl-5 text-neutral-300 mb-3">
                        <li>Built into Brave Browser—no extensions required</li>
                        <li>Supports BAT, Ethereum, and other crypto assets</li>
                        <li>Private, secure, and easy to use</li>
                        <li>Send, receive, and manage tokens</li>
                        <li>Earn BAT via Brave Ads (opt-in)</li>
                        <li>Connect to dApps (when API is available)</li>
                    </ul>
                    <a href="https://wallet-docs.brave.com/" target="_blank" rel="noopener noreferrer"
                        class="underline text-braveBlue hover:text-bravePurple">Read the full Brave Wallet
                        documentation</a>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Wallet Connection Card -->
                <Card title="Connect Your Wallet" variant="highlight">
                    <div v-if="!walletConnected" class="text-center py-6">
                        <div class="text-6xl mb-4">🦁</div>
                        <p class="text-neutral-300 mb-6">
                            Connect your Brave Wallet to start earning and tipping with BAT
                        </p>
                        <Button variant="primary" @click="connectWallet">
                            🔗 Connect Brave Wallet
                        </Button>
                        <p class="text-xs text-neutral-500 mt-4">
                            <strong>Demo only:</strong> Real Brave Wallet integration is not possible yet. <br>
                            <a href="https://wallet-docs.brave.com/" target="_blank" rel="noopener noreferrer"
                                class="underline text-braveBlue hover:text-bravePurple">Learn more about Brave
                                Wallet</a>
                        </p>
                    </div>

                    <div v-else class="space-y-4">
                        <div class="p-4 bg-gradient-to-br from-bravePurple/20 to-braveOrange/20 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-neutral-400">Your BAT Balance</span>
                                <span class="text-green-400 text-sm">● Connected</span>
                            </div>
                            <div class="text-3xl font-bold text-braveOrange">
                                {{ batBalance.toFixed(2) }} BAT
                            </div>
                            <div class="text-sm text-neutral-400 mt-1">
                                ≈ ${{ (batBalance * 0.25).toFixed(2) }} USD
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <Button size="sm" variant="secondary">Earn BAT</Button>
                            <Button size="sm" variant="secondary">Wallet Settings</Button>
                        </div>
                    </div>
                </Card>

                <!-- Tipping Card -->
                <Card title="Support This Project">
                    <p class="text-neutral-300 mb-4">
                        Enjoy this privacy-first creator hub? Send a tip with BAT to support
                        development.
                    </p>

                    <div v-if="walletConnected" class="space-y-4">
                        <div>
                            <label class="text-sm text-neutral-400 block mb-2">Tip Amount (BAT)</label>
                            <div class="flex gap-2">
                                <button v-for="amount in [1, 5, 10, 25]" :key="amount" @click="tipAmount = amount"
                                    :class="[
                                        'px-4 py-2 rounded-lg transition-all',
                                        tipAmount === amount
                                            ? 'bg-bravePurple text-white'
                                            : 'bg-neutral-800 hover:bg-neutral-700',
                                    ]">
                                    {{ amount }}
                                </button>
                            </div>
                        </div>

                        <div class="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                            <div class="flex justify-between mb-2">
                                <span class="text-sm">You're sending</span>
                                <span class="font-semibold">{{ tipAmount }} BAT</span>
                            </div>
                            <div class="flex justify-between text-sm text-neutral-400">
                                <span>Transaction fee</span>
                                <span>0.00 BAT</span>
                            </div>
                        </div>

                        <Button variant="primary" @click="sendTip" :disabled="batBalance < tipAmount" class="w-full">
                            💝 Send {{ tipAmount }} BAT Tip
                        </Button>
                    </div>

                    <div v-else class="text-center py-6">
                        <p class="text-neutral-400 mb-4">
                            Connect your Brave Wallet to send tips
                        </p>
                        <Button variant="secondary" @click="connectWallet">
                            Connect Wallet
                        </Button>
                    </div>
                </Card>
            </div>

            <!-- BAT Features -->
            <div class="mt-12 grid gap-6 md:grid-cols-3">
                <Card hoverable>
                    <div class="text-3xl mb-3">⚡</div>
                    <h3 class="text-lg font-semibold mb-2">Earn BAT</h3>
                    <p class="text-sm text-neutral-400">
                        Get paid in BAT for viewing privacy-respecting ads in Brave Browser.
                    </p>
                </Card>

                <Card hoverable>
                    <div class="text-3xl mb-3">🎁</div>
                    <h3 class="text-lg font-semibold mb-2">Tip Creators</h3>
                    <p class="text-sm text-neutral-400">
                        Support your favorite websites and creators directly with BAT tips.
                    </p>
                </Card>

                <Card hoverable>
                    <div class="text-3xl mb-3">🔒</div>
                    <h3 class="text-lg font-semibold mb-2">Privacy First</h3>
                    <p class="text-sm text-neutral-400">
                        All BAT transactions are private and don't require personal data.
                    </p>
                </Card>
            </div>
            <!-- Brave Search API Demo -->
            <div class="mt-16">
                <Card title="Brave Search Demo" variant="highlight">
                    <h3 class="text-lg font-semibold mb-2">Try Brave Search</h3>
                    <p class="text-sm text-neutral-400 mb-4">Brave Search is a privacy-first search engine. This demo
                        uses the Brave Search API to show results for your query.</p>
                    <form @submit.prevent="searchBrave">
                        <div class="flex gap-2 mb-4">
                            <input v-model="searchQuery" type="text" placeholder="Search Brave..."
                                class="px-3 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 w-full" />
                            <Button variant="primary" size="sm" type="submit">Search</Button>
                        </div>
                    </form>
                    <div v-if="searchLoading" class="text-neutral-400">Searching...</div>
                    <ul v-if="searchResults.length" class="mt-4 space-y-2">
                        <li v-for="result in searchResults" :key="result.url"
                            class="p-3 rounded bg-neutral-900 border border-neutral-800">
                            <a :href="result.url" target="_blank" rel="noopener noreferrer"
                                class="text-braveBlue underline hover:text-bravePurple">{{ result.title }}</a>
                            <div class="text-xs text-neutral-400">{{ result.description }}</div>
                        </li>
                    </ul>
                    <div v-if="searchError" class="text-red-400 mt-4">{{ searchError }}</div>
                </Card>
            </div>
        </div>
    </section>
</template>
