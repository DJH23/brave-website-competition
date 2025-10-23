<script setup lang="ts">
import { ref } from 'vue';
import MusicProductions from '../components/MusicProductions.vue';
import Button from '../components/Button.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const showTipModal = ref(false);

// Reveal on scroll for main headings
const musicHubHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: musicHubVisible } = useIntersectionObserver(musicHubHeadingRef, { threshold: 0.1, once: true });

const howBatWorksRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: howBatWorksVisible } = useIntersectionObserver(howBatWorksRef, { threshold: 0.1, once: true });
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 ref="musicHubHeadingRef"
                    class="text-5xl md:text-6xl font-bold text-gradient-rainbow transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !musicHubVisible, 'opacity-100 translate-y-0': musicHubVisible }">
                    <i class="bi bi-music-note-beamed" aria-hidden="true"></i> Music Hub
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Premium music productions powered by creativity and privacy.
                    Support directly with BAT — no middlemen, no tracking.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 glass rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <i class="bi bi-lightbulb text-yellow-400" aria-hidden="true"></i>
                    Why This Matters for Creators
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        <strong class="text-bravePurple">Traditional music platforms</strong> take
                        30-50% of your earnings, track your listeners, and sell their data.
                        Your fans become products.
                    </p>
                    <p>
                        With <strong class="text-braveOrange">BAT (Basic Attention Token)</strong>,
                        fans can tip you directly through Brave Browser — no account required,
                        no corporate middleman, and <strong>zero tracking</strong>.
                        You keep more. Fans stay private. Everyone wins.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div class="glass rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-green-400">95%+</div>
                            <div class="text-sm text-gray-400">You keep</div>
                        </div>
                        <div class="glass rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-bravePurple">0</div>
                            <div class="text-sm text-gray-400">Data collected</div>
                        </div>
                        <div class="glass rounded-lg p-4 text-center">
                            <div class="text-3xl font-bold text-braveOrange">Direct</div>
                            <div class="text-sm text-gray-400">Fan support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Music Portfolio Section -->
        <div class="max-w-7xl mx-auto mb-16">
            <MusicProductions />
        </div>

        <!-- How It Works Section -->
        <div class="max-w-5xl mx-auto mt-16">
            <h2 ref="howBatWorksRef"
                class="text-3xl font-bold text-white mb-8 text-center text-gradient-purple transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !howBatWorksVisible, 'opacity-100 translate-y-0': howBatWorksVisible }">
                How BAT Tipping Works
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4"><i class="bi bi-1-circle text-bravePurple" aria-hidden="true"></i></div>
                    <h3 class="text-xl font-bold text-white mb-2">Get Brave Browser</h3>
                    <p class="text-gray-400">
                        Download Brave (free) with built-in privacy protection and BAT wallet
                    </p>
                </div>
                <div class="glass rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4"><i class="bi bi-2-circle text-braveOrange" aria-hidden="true"></i></div>
                    <h3 class="text-xl font-bold text-white mb-2">Earn or Buy BAT</h3>
                    <p class="text-gray-400">
                        Earn BAT by viewing privacy-respecting ads, or buy BAT on exchanges
                    </p>
                </div>
                <div class="glass rounded-xl p-6 text-center">
                    <div class="text-4xl mb-4"><i class="bi bi-3-circle text-braveBlue" aria-hidden="true"></i></div>
                    <h3 class="text-xl font-bold text-white mb-2">Tip Creators</h3>
                    <p class="text-gray-400">
                        One-click tipping directly to creators. Private, fast, and fair.
                    </p>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3
                class="text-2xl font-bold text-white text-gradient-rainbow transition-all duration-700 opacity-100 translate-y-0">
                Ready to explore more privacy features?
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
                <RouterLink to="/wallet">
                    <Button variant="primary" size="lg">
                        <i class="bi bi-wallet2" aria-hidden="true"></i> Explore Brave Wallet
                    </Button>
                </RouterLink>
                <RouterLink to="/privacy">
                    <Button variant="secondary" size="lg">
                        <i class="bi bi-shield-check" aria-hidden="true"></i> Try Privacy Demos
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
