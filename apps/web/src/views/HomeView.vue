<script setup lang="ts">
import { ref, onMounted, onBeforeMount, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';
import { useCardTilt } from '../composables/useCardTilt';

const heroHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: heroVisible } = useIntersectionObserver(heroHeadingRef, { threshold: 0.1, once: true });
const { handleCardMouseMove, handleCardMouseLeave } = useCardTilt();

// No scroll-to-section feature on HomeView; hero + features shown on load

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
        route: '/creator-hub',
        description: 'Explore original music featuring buying and tipping with BAT.'
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
        title: 'Bonus Feature',
        icon: 'bi-gift',
        iconColor: 'text-bravePurple',
        exploreColor: 'text-bravePurple',
        glowColor: '#7C3AED',
        route: '/surprise',
        description: 'Only the Bravest dare to explore the unknown.'
    }
];

</script>

<template>
    <div>
        <!-- Hero Section -->
        <section class="relative px-4 pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-10 md:pb-12">
            <div class="max-w-6xl mx-auto text-center">
                <!-- Logo/Title - positioned higher -->
                <div class="space-y-4">
                    <h1 ref="heroHeadingRef"
                        class="text-5xl md:text-7xl font-bold text-gradient-rainbow transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !heroVisible, 'opacity-100 translate-y-0': heroVisible }">
                        Privacy-First Creator Showcase
                    </h1>
                    <div class="h-4 md:h-2"></div>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Illustrating how <a href="https://brave.com" target="_blank" rel="noopener noreferrer"
                            class="text-braveOrange font-semibold hover:underline">Brave Browser</a> and
                        <a href="https://basicattentiontoken.org" target="_blank" rel="noopener noreferrer"
                            class="text-bravePurple font-semibold hover:underline">BAT</a> enable direct creator support
                        without surveillance or middlemen.
                    </p>
                </div>

                <!-- No scroll indicator -->
            </div>
        </section>

        <!-- Features Row -->
        <section class="px-4 pb-12 sm:pb-16 md:pb-20 pt-8 sm:pt-12 md:pt-20">
            <div class="mx-auto max-w-[100rem]">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RouterLink v-for="feature in features" :key="feature.route" :to="feature.route"
                        @mousemove="handleCardMouseMove" @mouseleave="handleCardMouseLeave"
                        class="group relative glass rounded-2xl p-8 cursor-pointer feature-card flex flex-col"
                        :style="{ '--glow-color': feature.glowColor }">
                        <!-- Gradient Overlay -->
                        <div
                            class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                        </div>
                        <!-- Content -->
                        <div class="relative z-10 flex flex-col h-full">
                            <i :class="['bi', feature.icon, feature.iconColor, 'text-6xl mb-4']" aria-hidden="true"></i>
                            <h3 class="text-2xl font-bold text-white mb-4">{{ feature.title }}</h3>
                            <p class="text-gray-300 leading-relaxed mb-4 flex-grow">{{ feature.description }}</p>
                            <div
                                :class="['flex items-center gap-2 font-semibold transition-all duration-300 mt-auto', feature.exploreColor]">
                                <span>Explore</span>
                                <i class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-2"
                                    aria-hidden="true"></i>
                            </div>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>


    </div>
</template>
