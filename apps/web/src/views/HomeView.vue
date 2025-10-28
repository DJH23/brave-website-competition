<script setup lang="ts">
import { ref, onMounted, onBeforeMount, nextTick } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const router = useRouter();

const heroHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: heroVisible } = useIntersectionObserver(heroHeadingRef, { threshold: 0.1, once: true });

const exploreHubRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: exploreHubVisible } = useIntersectionObserver(exploreHubRef, { threshold: 0.1, once: true });

// Smooth scroll to features section with offset for navbar
const scrollToFeatures = () => {
    if (exploreHubRef.value) {
        const navbarHeight = 96; // 80px navbar + 16px buffer
        const elementPosition = exploreHubRef.value.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Prevent scroll restoration immediately
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Ensure page loads at top - run before mount
onBeforeMount(() => {
    window.scrollTo(0, 0);
});

// Double-check on mount
onMounted(() => {
    window.scrollTo(0, 0);
    nextTick(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
});

const features = [
    {
        title: 'Creator Hub',
        icon: 'bi-music-note-beamed',
        iconColor: 'text-braveOrange',
        exploreColor: 'text-braveOrange',
        glowColor: '#FB542B',
        route: '/music',
        description: 'Original music production and waveform visualization featuring interactive tipping with BAT.'
    },
    {
        title: 'Privacy Demos',
        icon: 'bi-shield-check',
        iconColor: 'text-bravePurple',
        exploreColor: 'text-bravePurple',
        glowColor: '#7C3AED',
        route: '/privacy',
        description: 'Real-time demonstrations of ad/tracker blocking, fingerprinting resistance, and privacy scoring.'
    },
    {
        title: 'BAT & Wallet Guide',
        icon: 'bi-wallet2',
        iconColor: 'text-braveBlue',
        exploreColor: 'text-braveBlue',
        glowColor: '#0EA5E9',
        route: '/wallet',
        description: 'Interactive flowchart mapping the complete BAT ecosystem for users and creators.'
    },
    {
        title: 'Brave Search',
        icon: 'bi-search',
        iconColor: 'text-pink-500',
        exploreColor: 'text-pink-500',
        glowColor: '#ec4899',
        route: '/search',
        description: 'Private search integration with Brave\'s independent, privacy-respecting search engine.'
    }
];

</script>

<template>
    <div class="min-h-screen">
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div class="max-w-6xl mx-auto text-center">
                <!-- Logo/Title - positioned higher -->
                <div class="space-y-4 -mt-64">
                    <h1 ref="heroHeadingRef"
                        class="text-5xl md:text-7xl font-bold text-gradient-rainbow transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !heroVisible, 'opacity-100 translate-y-0': heroVisible }">
                        Privacy-First Creator Showcase
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        A demonstration of how <span class="text-braveOrange font-semibold">Brave Browser</span> and
                        <span class="text-bravePurple font-semibold">BAT</span> enable direct creator support
                        without surveillance or middlemen.
                    </p>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                        Built by <span class="text-gradient-purple font-semibold">Darren Heath</span> • Powered by
                        Brave & BAT
                    </p>
                </div>

                <!-- Scroll Indicator - now visible and clickable -->
                <div @click="scrollToFeatures"
                    class="mt-16 cursor-pointer hover:opacity-80 transition-opacity animate-bounce inline-block">
                    <div class="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div class="w-1 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section> <!-- Features Grid -->
        <section class="px-4 py-20 pt-28 scroll-mt-32">
            <div class="max-w-7xl mx-auto">
                <h2 ref="exploreHubRef"
                    class="text-4xl font-bold text-center mb-4 text-gradient-rainbow transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !exploreHubVisible, 'opacity-100 translate-y-0': exploreHubVisible }">
                    Four Ways Brave & BAT Change the Web
                </h2>
                <p class="text-gray-400 text-center mb-12 text-lg">
                    Interactive demonstrations showcasing Brave, BAT, and privacy-first web development
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RouterLink v-for="feature in features" :key="feature.route" :to="feature.route" class="group relative glass rounded-2xl p-8 cursor-pointer
                               transition-all duration-300 hover:scale-[1.02] feature-card"
                        :style="{ '--glow-color': feature.glowColor }">
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 
                                   group-hover:opacity-10 transition-opacity duration-300">
                        </div>

                        <!-- Content -->
                        <div class="relative z-10 space-y-4">
                            <i :class="['bi', feature.icon, feature.iconColor, 'text-6xl']" aria-hidden="true"></i>
                            <h3 class="text-2xl font-bold text-white">{{ feature.title }}</h3>
                            <p class="text-gray-300 leading-relaxed">{{ feature.description }}</p>
                            <div
                                :class="['flex items-center gap-2 font-semibold group-hover:gap-4 transition-all duration-300', feature.exploreColor]">
                                <span>Explore</span>
                                <i class="bi bi-arrow-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>


    </div>
</template>

<style scoped>
/* Feature card hover with colored glow matching flowchart nodes */
.feature-card:hover {
    box-shadow: 0 0 16px color-mix(in srgb, var(--glow-color) 50%, transparent);
}
</style>
