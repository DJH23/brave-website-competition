<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';
import { useCardTilt } from '../composables/useCardTilt';

const { handleCardMouseMove, handleCardMouseLeave } = useCardTilt();

// Reveal on scroll for main headings
const rickRollHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: rickRollVisible } = useIntersectionObserver(rickRollHeadingRef, { threshold: 0.1, once: true });

const memesPrivacyRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: memesPrivacyVisible } = useIntersectionObserver(memesPrivacyRef, { threshold: 0.1, once: true });

// Thug life glasses overlay on video for first 5 seconds
const glassesVisible = ref(true);
// Primary image expected in /public root: /thug-life-sunglasses.png
// Fallback is an inline data URI (simple placeholder) if the file is missing
const glassesSrc = ref<string>('/thug-life-sunglasses.png');
const fallbackGlassesDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAUCAYAAAB1Z0ZuAAAACXBIWXMAAAsTAAALEwEAmpwYAAABF0lEQVRoge2WsQ3CMAxF3yYgA3ACMwAnYAImYAImYAI2YAL8lU2gqWmS2kXG6nPpkWcY1w6P2xv1G0JbJpOJ1PEjQfH3EmvtvG19sPHD6GCGME0kIJpQjCNCBQAl5gA+H3gArx0wx6xAAFtG6M8Gvc0wOCECVqT3V5XqB4Zk7LQ6AZdU1KYwmlbJKxveQ0HcTqXCMBFi5AbixQCnG4j2pJxtA+K5Z0Lk7mWDjzEkvDHgGe0xQFJibOA6gk+IQFsZ0gDv6e1Zgj6Ew8BS4cr7fFa44pG+DWmB0u2X1hR98Mav3CEhp3/AqdpdgR5O/WM2Vx6Z81jfn6x9NG7PHF69It5QRYwSSQgmlCMI0IFACXmAQ1HGOA+V5BgAAAABJRU5ErkJggg==';
onMounted(() => {
    // Hide after 5 seconds
    setTimeout(() => {
        glassesVisible.value = false;
    }, 8000);
});
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <div class="max-w-5xl mx-auto">
            <!-- Rick Roll Video -->
            <div class="space-y-8">
                <!-- Header -->
                <div class="text-center space-y-4">
                    <h1 ref="rickRollHeadingRef"
                        class="text-5xl md:text-6xl font-bold transition-all duration-700 text-gradient-purple"
                        :class="{ 'opacity-0 translate-y-8': !rickRollVisible, 'opacity-100 translate-y-0': rickRollVisible }">
                        <i class="bi bi-music-note-beamed text-bravePurple" aria-hidden="true"></i> You just got Rick
                        Roll'd
                    </h1>
                </div>

                <!-- Video Container -->
                <div class="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <!-- Thug life sunglasses overlay (PNG with fallback data URI) -->
                    <div class="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-18 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 transition-all duration-[2000ms] ease-out"
                        :class="{ 'opacity-100 scale-105': glassesVisible, 'opacity-0 scale-95': !glassesVisible }">
                        <img :src="glassesSrc" alt="Decorative thug life sunglasses overlay"
                            class="h-auto w-60 sm:w-72 md:w-[27rem] lg:w-[33rem] xl:w-[39rem] object-contain drop-shadow-[0_14px_38px_rgba(0,0,0,0.55)] select-none"
                            draggable="false" @error="glassesSrc = fallbackGlassesDataUri" />
                    </div>
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
                        <i class="bi bi-emoji-surprise-fill text-bravePurple" aria-hidden="true"></i>
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
                      <div class="mt-6 text-center">
                        <RouterLink to="/wallet#get-set-up"
                            class="group/link text-sm text-neutral-400 hover:text-bravePurple transition-colors inline-flex items-center gap-1">
                            <span>Get Set Up</span>
                            <svg class="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </RouterLink>
                    </div>
                </div>

                <!-- CTA Section -->
                <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
                    <h3
                        class="text-2xl font-bold text-gradient-purple transition-all duration-700 opacity-100 translate-y-0">
                        <i class="bi bi-search text-bravePurple/80" aria-hidden="true"></i>
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
