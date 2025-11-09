<script setup lang="ts">
import { ref } from 'vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';
import { useCardTilt } from '../composables/useCardTilt';

const { handleCardMouseMove, handleCardMouseLeave } = useCardTilt();

// Reveal on scroll for main headings
const rickRollHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: rickRollVisible } = useIntersectionObserver(rickRollHeadingRef, { threshold: 0.1, once: true });

const memesPrivacyRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: memesPrivacyVisible } = useIntersectionObserver(memesPrivacyRef, { threshold: 0.1, once: true });
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <div class="max-w-5xl mx-auto">
            <!-- Rick Roll Video -->
            <div class="space-y-8">
                <!-- Header -->
                <div class="text-center space-y-4">
                    <h1 ref="rickRollHeadingRef"
                        class="text-4xl md:text-5xl font-bold text-gradient-purple transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !rickRollVisible, 'opacity-100 translate-y-0': rickRollVisible }">
                        <i class="bi bi-music-note-beamed text-bravePurple" aria-hidden="true"></i> You just got Rick
                        Roll'd
                    </h1>
                </div>

                <!-- Video Container -->
                <div class="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <div class="aspect-video">
                        <iframe width="100%" height="100%"
                            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1&rel=0"
                            title="Rick Astley - Never Gonna Give You Up" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen class="w-full h-full"></iframe>
                    </div>
                </div>

                <!-- The Message -->
                <div class="glass rounded-2xl p-8">
                    <h2 ref="memesPrivacyRef"
                        class="text-2xl font-bold text-gradient-purple mb-4 flex items-center gap-2 transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !memesPrivacyVisible, 'opacity-100 translate-y-0': memesPrivacyVisible }">
                        <i class="bi bi-lightbulb text-yellow-400" aria-hidden="true"></i>
                        But here's the twist:
                    </h2>
                    <div class="space-y-4 text-gray-300">
                        <p>
                            Brave automatically blocks third-party cookies and trackers across the web, so you can watch
                            videos, browse memes, and explore content — privately and in control.
                        </p>
                        <p>
                            This is the <strong class="text-bravePurple">Brave Browser philosophy</strong>: enjoy the
                            web without being the product.
                        </p>
                    </div>
                </div>

                <!-- CTA Section -->
                <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
                    <h3
                        class="text-2xl font-bold text-gradient-purple transition-all duration-700 opacity-100 translate-y-0">
                        Ready to explore?
                    </h3>
                    <div class="flex flex-wrap gap-4 justify-center">
                        <!-- Creator Hub Card -->
                        <RouterLink to="/creator-hub" @mousemove="handleCardMouseMove"
                            @mouseleave="handleCardMouseLeave"
                            class="group relative glass rounded-2xl p-6 md:p-8 cursor-pointer feature-card flex flex-col w-[280px] md:w-[320px] text-left"
                            :style="{ '--glow-color': '#FF6A00' }">
                            <!-- Gradient Overlay -->
                            <div
                                class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                            </div>
                            <!-- Content -->
                            <div class="relative z-10 flex flex-col h-full">
                                <i class="bi bi-music-note-beamed text-braveOrange text-4xl md:text-5xl mb-3"
                                    aria-hidden="true"></i>
                                <h4 class="text-xl md:text-2xl font-bold text-white mb-2">Creator Hub</h4>
                                <p class="text-gray-300 text-sm md:text-base mb-4 flex-grow">Music & content
                                    monetization.</p>
                                <div
                                    class="text-braveOrange flex items-center gap-2 font-semibold transition-all duration-300 mt-auto">
                                    <span>Explore</span>
                                    <i class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-2"
                                        aria-hidden="true"></i>
                                </div>
                            </div>
                        </RouterLink>

                        <!-- Wallet Card -->
                        <RouterLink to="/wallet" @mousemove="handleCardMouseMove" @mouseleave="handleCardMouseLeave"
                            class="group relative glass rounded-2xl p-6 md:p-8 cursor-pointer feature-card flex flex-col w-[280px] md:w-[320px] text-left"
                            :style="{ '--glow-color': '#0EA5E9' }">
                            <!-- Gradient Overlay -->
                            <div
                                class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                            </div>
                            <!-- Content -->
                            <div class="relative z-10 flex flex-col h-full">
                                <i class="bi bi-wallet2 text-braveBlue text-4xl md:text-5xl mb-3"
                                    aria-hidden="true"></i>
                                <h4 class="text-xl md:text-2xl font-bold text-white mb-2">Getting Set Up</h4>
                                <p class="text-gray-300 text-sm md:text-base mb-4 flex-grow">Wallet & BAT guide.</p>
                                <div
                                    class="text-braveBlue flex items-center gap-2 font-semibold transition-all duration-300 mt-auto">
                                    <span>Explore</span>
                                    <i class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-2"
                                        aria-hidden="true"></i>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>

            </div>
        </div>
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
    animation: gradient 3s ease infinite;
}
</style>
