<script setup lang="ts">
import { ref } from 'vue';
import Portfolio from '../components/Portfolio.vue';
import BATIntegration from '../components/BATIntegration.vue';
import Button from '../components/Button.vue';

const showTipModal = ref(false);
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 
                           bg-clip-text text-transparent">
                    🎵 Music Hub
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Premium music productions powered by creativity and privacy.
                    Support directly with BAT — no middlemen, no tracking.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                        backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Why This Matters for Creators
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        <strong class="text-purple-400">Traditional music platforms</strong> take
                        30-50% of your earnings, track your listeners, and sell their data.
                        Your fans become products.
                    </p>
                    <p>
                        With <strong class="text-orange-400">BAT (Basic Attention Token)</strong>,
                        fans can tip you directly through Brave Browser — no account required,
                        no corporate middleman, and <strong>zero tracking</strong>.
                        You keep more. Fans stay private. Everyone wins.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-green-400">95%+</div>
                            <div class="text-sm text-gray-400">You keep</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-purple-400">0</div>
                            <div class="text-sm text-gray-400">Data collected</div>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-orange-400">Direct</div>
                            <div class="text-sm text-gray-400">Fan support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Music Portfolio Section -->
        <div class="max-w-7xl mx-auto mb-16">
            <Portfolio />
        </div>

        <!-- BAT Tipping Integration -->
        <div class="max-w-5xl mx-auto">
            <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 class="text-3xl font-bold text-white mb-6 text-center">
                    Support with BAT 🦁
                </h2>
                <p class="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                    Love what you hear? Tip directly using Basic Attention Token.
                    Your support goes straight to the creator — no fees, no tracking, no hassle.
                </p>
                <BATIntegration />
            </div>
        </div>

        <!-- How It Works Section -->
        <div class="max-w-5xl mx-auto mt-16">
            <h2 class="text-3xl font-bold text-white mb-8 text-center">
                How BAT Tipping Works
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4">1️⃣</div>
                    <h3 class="text-xl font-bold text-white mb-2">Get Brave Browser</h3>
                    <p class="text-gray-400">
                        Download Brave (free) with built-in privacy protection and BAT wallet
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4">2️⃣</div>
                    <h3 class="text-xl font-bold text-white mb-2">Earn or Buy BAT</h3>
                    <p class="text-gray-400">
                        Earn BAT by viewing privacy-respecting ads, or buy BAT on exchanges
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4">3️⃣</div>
                    <h3 class="text-xl font-bold text-white mb-2">Tip Creators</h3>
                    <p class="text-gray-400">
                        One-click tipping directly to creators. Private, fast, and fair.
                    </p>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3 class="text-2xl font-bold text-white">
                Ready to explore more privacy features?
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
                <RouterLink to="/wallet">
                    <Button variant="primary" size="lg">
                        💰 Explore Brave Wallet
                    </Button>
                </RouterLink>
                <RouterLink to="/privacy">
                    <Button variant="secondary" size="lg">
                        🛡️ Try Privacy Demos
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
