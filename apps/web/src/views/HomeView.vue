<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../components/Button.vue';

const features = [
    {
        icon: '🎵',
        title: 'Music Hub',
        description: 'Explore premium music productions with BAT-powered tipping for creators',
        route: '/music',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: '💰',
        title: 'Brave Wallet',
        description: 'Connect your wallet, manage BAT tokens, and support creators directly',
        route: '/wallet',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: '🔍',
        title: 'Brave Search',
        description: 'Experience private, unbiased search without tracking or profiling',
        route: '/search',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: '🛡️',
        title: 'Privacy Demos',
        description: 'See real-time tracker blocking, privacy scores, and fingerprinting protection',
        route: '/privacy',
        color: 'from-green-500 to-emerald-500'
    }
];
</script>

<template>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div class="max-w-5xl mx-auto text-center space-y-8">
                <!-- Logo/Title -->
                <div class="space-y-4">
                    <h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 
                               bg-clip-text text-transparent animate-gradient">
                        Privacy-First Creator Hub
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Built with <span class="text-orange-400 font-semibold">Brave</span> and
                        <span class="text-purple-400 font-semibold">BAT</span> —
                        Where privacy meets creativity
                    </p>
                </div>

                <!-- Why This Matters Section -->
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                    <h2 class="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                        <span>💡</span>
                        Why This Matters
                    </h2>
                    <p class="text-gray-300 text-lg leading-relaxed">
                        Your online activity shouldn't be a product. This hub demonstrates how
                        <strong class="text-orange-400">Brave Browser</strong> and
                        <strong class="text-purple-400">Basic Attention Token (BAT)</strong>
                        empower creators and users with true privacy, direct monetization, and control
                        over personal data. No middlemen. No surveillance. Just freedom.
                    </p>
                </div>

                <!-- CTA Buttons -->
                <div class="flex flex-wrap gap-4 justify-center">
                    <RouterLink to="/music">
                        <Button variant="primary" size="lg">
                            🎵 Explore Music
                        </Button>
                    </RouterLink>
                    <RouterLink to="/privacy">
                        <Button variant="secondary" size="lg">
                            🛡️ Try Privacy Demos
                        </Button>
                    </RouterLink>
                </div>

                <!-- Scroll Indicator -->
                <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div class="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div class="w-1 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Grid -->
        <section class="px-4 py-20">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-4">Explore the Hub</h2>
                <p class="text-gray-400 text-center mb-12 text-lg">
                    Interactive experiences showcasing privacy, creativity, and Web3 innovation
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RouterLink v-for="feature in features" :key="feature.route" :to="feature.route" class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 
                               hover:bg-white/10 hover:border-white/20 transition-all duration-300 
                               hover:scale-105 hover:shadow-2xl">
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 
                                   group-hover:opacity-10 transition-opacity duration-300" :class="feature.color">
                        </div>

                        <!-- Content -->
                        <div class="relative z-10 space-y-4">
                            <div class="text-6xl">{{ feature.icon }}</div>
                            <h3 class="text-2xl font-bold text-white">{{ feature.title }}</h3>
                            <p class="text-gray-300">{{ feature.description }}</p>
                            <div
                                class="flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                                Explore <span class="ml-2">→</span>
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Quick Stats / Info Section -->
        <section class="px-4 py-20 bg-gradient-to-b from-transparent to-purple-900/20">
            <div class="max-w-5xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-purple-400">100%</div>
                        <div class="text-gray-300">Privacy Protected</div>
                    </div>
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-orange-400">0</div>
                        <div class="text-gray-300">Trackers Allowed</div>
                    </div>
                    <div class="space-y-2">
                        <div class="text-4xl font-bold text-pink-400">∞</div>
                        <div class="text-gray-300">Creative Freedom</div>
                    </div>
                </div>

                <!-- Easter Egg Hint -->
                <div class="mt-16 text-center">
                    <p class="text-gray-500 text-sm">
                        Psst... looking for something special? Try the
                        <RouterLink to="/surprise" class="text-purple-400 hover:text-purple-300 underline">
                            surprise feature
                        </RouterLink>
                        🎉
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
@keyframes gradient {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 5s ease infinite;
}
</style>
