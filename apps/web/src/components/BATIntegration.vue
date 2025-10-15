<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";

const walletConnected = ref(false);
const batBalance = ref(0);
const tipAmount = ref(1);

const connectWallet = () => {
    // Placeholder for Brave Wallet integration
    walletConnected.value = true;
    batBalance.value = 42.5; // Mock balance
};

const sendTip = () => {
    if (batBalance.value >= tipAmount.value) {
        batBalance.value -= tipAmount.value;
        alert(`✅ Thank you! ${tipAmount.value} BAT sent successfully.`);
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
                Support creators directly with Basic Attention Token. Earn BAT for your
                attention, tip your favorite creators, and maintain your privacy.
            </p>

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
                            This is a demo placeholder. Real integration requires Brave Wallet
                            API.
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
        </div>
    </section>
</template>
