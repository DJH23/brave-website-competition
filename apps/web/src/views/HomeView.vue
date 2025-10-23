<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../components/Button.vue';
import Card from '../components/Card.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

// Reveal on scroll for sections
const portfolioRef = ref<HTMLElement | null>(null);
const { hasBeenVisible } = useIntersectionObserver(portfolioRef, {
    threshold: 0.1,
    once: true
});

const heroHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: heroVisible } = useIntersectionObserver(heroHeadingRef, { threshold: 0.1, once: true });

const whyMattersRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: whyMattersVisible } = useIntersectionObserver(whyMattersRef, { threshold: 0.1, once: true });

const exploreHubRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: exploreHubVisible } = useIntersectionObserver(exploreHubRef, { threshold: 0.1, once: true });

const features = [
    {
        icon: 'bi-music-note-beamed',
        title: 'Music Hub',
        description: 'Explore premium music productions with BAT-powered tipping for creators',
        route: '/music',
        color: 'from-purple-500 to-pink-500',
        iconColor: 'text-bravePurple'
    },
    {
        icon: 'bi-wallet2',
        title: 'Brave Wallet',
        description: 'Connect your wallet, manage BAT tokens, and support creators directly',
        route: '/wallet',
        color: 'from-orange-500 to-red-500',
        iconColor: 'text-braveOrange'
    },
    {
        icon: 'bi-search',
        title: 'Brave Search',
        description: 'Experience private, unbiased search without tracking or profiling',
        route: '/search',
        color: 'from-blue-500 to-cyan-500',
        iconColor: 'text-braveBlue'
    },
    {
        icon: 'bi-shield-check',
        title: 'Privacy Demos',
        description: 'See real-time tracker blocking, privacy scores, and fingerprinting protection',
        route: '/privacy',
        color: 'from-green-500 to-emerald-500',
        iconColor: 'text-green-400'
    }
];

const projects = ref([
    {
        title: "Privacy-First Analytics",
        description:
            "Open-source web analytics that respects user privacy. No cookies, no tracking, just insights.",
        tags: ["TypeScript", "Vue 3", "Privacy"],
        link: "https://github.com",
    },
    {
        title: "Decentralized Music Platform",
        description:
            "Stream and license music using BAT. Artists receive 95% of earnings directly.",
        tags: ["Web3", "BAT", "Music"],
        link: "https://github.com",
    },
    {
        title: "Brave Extension Pack",
        description:
            "Collection of privacy-enhancing browser extensions for Brave and Chromium browsers.",
        tags: ["Extensions", "JavaScript", "Privacy"],
        link: "https://github.com",
    },
]);

const openProjectLink = (link: string) => {
    window.open(link, '_blank');
};
</script>

<template>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div class="max-w-5xl mx-auto text-center space-y-8">
                <!-- Logo/Title -->
                <div class="space-y-4">
                    <h1 ref="heroHeadingRef"
                        class="text-5xl md:text-7xl font-bold text-gradient-rainbow transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !heroVisible, 'opacity-100 translate-y-0': heroVisible }">
                        Privacy-First Creator Hub
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Built with <span class="text-braveOrange font-semibold">Brave</span> and
                        <span class="text-bravePurple font-semibold">BAT</span> —
                        Empowering users to support BAT-enabled creators directly. When both you and the creator have
                        BAT set up, you can tip and support privacy-first creativity.
                    </p>
                </div> <!-- Why This Matters Section -->
                <div class="glass rounded-2xl p-8 max-w-2xl mx-auto">
                    <h2 ref="whyMattersRef"
                        class="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2 transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !whyMattersVisible, 'opacity-100 translate-y-0': whyMattersVisible }">
                        <i class="bi bi-lightbulb text-yellow-400" aria-hidden="true"></i>
                        Why This Matters
                    </h2>
                    <p class="text-gray-300 text-lg leading-relaxed">
                        Your online activity shouldn't be a product. This hub demonstrates how
                        <strong class="text-orange-400">Brave Browser</strong> and
                        <strong class="text-purple-400">Basic Attention Token (BAT)</strong>
                        empower users to support creators directly—when both have BAT enabled. You can tip your favorite
                        creators with BAT, all while keeping your data private and secure. No middlemen. No
                        surveillance. Just freedom.
                    </p>
                </div> <!-- CTA Buttons -->
                <div class="flex flex-wrap gap-4 justify-center">
                    <RouterLink to="/music">
                        <Button variant="primary" size="lg">
                            <i class="bi bi-music-note-beamed" aria-hidden="true"></i> Explore Music
                        </Button>
                    </RouterLink>
                    <RouterLink to="/privacy">
                        <Button variant="secondary" size="lg">
                            <i class="bi bi-shield-check" aria-hidden="true"></i> Try Privacy Demos
                        </Button>
                    </RouterLink>
                </div> <!-- Scroll Indicator -->
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
                <h2 ref="exploreHubRef"
                    class="text-4xl font-bold text-center mb-4 text-gradient-rainbow transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !exploreHubVisible, 'opacity-100 translate-y-0': exploreHubVisible }">
                    Explore the Hub
                </h2>
                <p class="text-gray-400 text-center mb-12 text-lg">
                    Interactive experiences showcasing privacy, creativity, and Web3 innovation
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RouterLink v-for="feature in features" :key="feature.route" :to="feature.route" class="group relative glass rounded-2xl p-8 
                               transition-all duration-300 
                               hover:scale-105 hover:shadow-2xl">
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 
                                   group-hover:opacity-10 transition-opacity duration-300">
                        </div>

                        <!-- Content -->
                        <div class="relative z-10 space-y-4">
                            <i :class="['bi', feature.icon, feature.iconColor, 'text-6xl']" aria-hidden="true"></i>
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

        <!-- Development Projects Section -->
        <section ref="portfolioRef" class="px-4 py-20" aria-labelledby="portfolio-heading">
            <div class="max-w-7xl mx-auto">
                <h2 id="portfolio-heading"
                    class="text-4xl font-bold mb-4 text-gradient-rainbow transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !hasBeenVisible, 'opacity-100 translate-y-0': hasBeenVisible }">
                    Portfolio
                </h2>
                <p class="text-neutral-300 mb-8">
                    Showcasing development projects and music productions powered by
                    privacy-first technologies.
                </p>

                <!-- Development Projects -->
                <div class="mb-12">
                    <h3 id="dev-projects-heading"
                        class="text-2xl font-semibold mb-6 flex items-center gap-2 text-gradient-purple transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !hasBeenVisible, 'opacity-100 translate-y-0': hasBeenVisible }">
                        <i class="bi bi-laptop text-bravePurple" aria-hidden="true"></i> Development Projects
                    </h3>
                    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list"
                        aria-labelledby="dev-projects-heading">
                        <Card v-for="project in projects" :key="project.title" :title="project.title" role="listitem">
                            <p class="mb-4">{{ project.description }}</p>
                            <div class="flex flex-wrap gap-2 mb-4" role="list" aria-label="Project technologies">
                                <span v-for="tag in project.tags" :key="tag"
                                    class="px-2 py-1 text-xs bg-bravePurple/20 text-bravePurple rounded"
                                    role="listitem">
                                    {{ tag }}
                                </span>
                            </div>
                            <Button size="sm" variant="secondary" @click="() => openProjectLink(project.link)"
                                :aria-label="`View ${project.title} project`">
                                View Project →
                            </Button>
                        </Card>
                    </div>
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
