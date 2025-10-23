<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const copyLink = async () => {
    try {
        await window.navigator.clipboard.writeText(window.location.href);
        window.alert('Link copied! Go spread the joy (privately) 🎉');
    } catch (err) {
        console.error('Failed to copy link:', err);
    }
};

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
                        class="text-4xl md:text-5xl font-bold text-white transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !rickRollVisible, 'opacity-100 translate-y-0': rickRollVisible }">
                        <i class="bi bi-music-note-beamed text-purple-400" aria-hidden="true"></i> Never Gonna Give
                        You Up
                    </h1>
                    <p class="text-xl text-purple-400">
                        Classic internet culture, now with privacy
                    </p>
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
                        class="text-2xl font-bold text-white mb-4 flex items-center gap-2 transition-all duration-700"
                        :class="{ 'opacity-0 translate-y-8': !memesPrivacyVisible, 'opacity-100 translate-y-0': memesPrivacyVisible }">
                        <i class="bi bi-lightbulb text-yellow-400" aria-hidden="true"></i>
                        Even Memes Deserve Privacy
                    </h2>
                    <div class="space-y-4 text-gray-300">
                        <p>
                            You just got <strong class="text-pink-400">Rick Roll'd</strong> —
                            one of the internet's most beloved traditions. But here's the twist:
                        </p>
                        <p>
                            That video is embedded using <strong class="text-bravePurple">
                                youtube-nocookie.com</strong>, which means YouTube isn't tracking you
                            while you enjoy this classic banger. No cookies, no profiling,
                            just pure nostalgic entertainment.
                        </p>
                        <p>
                            This is the <strong class="text-braveOrange">Brave Browser philosophy</strong>
                            in action: <strong>You can enjoy the web without being the product</strong>.
                            Watch videos, browse memes, explore content — all while staying private.
                        </p>
                    </div>
                </div>

                <!-- Why This Matters -->
                <div class="glass rounded-2xl p-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <i class="bi bi-palette" aria-hidden="true"></i> Creative Freedom Needs Privacy
                    </h3>
                    <p class="text-gray-300 mb-4">
                        Content creators (yes, even Rick Astley) deserve to share their work
                        without surveillance capitalism. When you watch videos on privacy-respecting
                        platforms or use BAT to tip creators, you're supporting a better internet:
                    </p>
                    <ul class="list-disc list-inside space-y-2 text-gray-300 ml-4">
                        <li>Creators get paid directly, not through ad revenue that exploits users</li>
                        <li>Fans stay anonymous — no surveillance or data collection</li>
                        <li>Memes, music, and art thrive without corporate gatekeepers</li>
                        <li>The internet becomes fun again, not just a data extraction machine</li>
                    </ul>
                </div>

                <!-- Fun Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="glass rounded-xl p-6 text-center">
                        <div class="text-4xl font-bold text-pink-400 mb-2">1.4B+</div>
                        <div class="text-gray-300">Views on YouTube</div>
                        <div class="text-sm text-gray-400 mt-2">Rick Astley is eternal</div>
                    </div>
                    <div class="glass rounded-xl p-6 text-center">
                        <div class="text-4xl font-bold text-bravePurple mb-2">1987</div>
                        <div class="text-gray-300">Original Release</div>
                        <div class="text-sm text-gray-400 mt-2">A timeless classic</div>
                    </div>
                    <div class="glass rounded-xl p-6 text-center">
                        <div class="text-4xl font-bold text-braveBlue mb-2">0</div>
                        <div class="text-gray-300">Trackers Here</div>
                        <div class="text-sm text-gray-400 mt-2">Privacy-first entertainment</div>
                    </div>
                </div>

                <!-- Sharing -->
                <div class="text-center space-y-4">
                    <p class="text-gray-300">
                        Want to Rick Roll your friends... <em>privately</em>?
                    </p>
                    <div class="flex flex-wrap gap-4 justify-center">
                        <Button variant="primary" @click="copyLink">
                            <i class="bi bi-clipboard" aria-hidden="true"></i> Copy Link to Share
                        </Button>
                        <RouterLink to="/">
                            <Button variant="secondary">
                                <i class="bi bi-house-door" aria-hidden="true"></i> Back to Home
                            </Button>
                        </RouterLink>
                    </div>
                </div>

                <!-- Easter Egg Credits -->
                <div class="text-center text-sm text-gray-500 mt-12">
                    <p>
                        You're <strong class="text-bravePurple">Never Gonna Give Up</strong>
                        on privacy, right? 😉
                    </p>
                    <p class="mt-2">
                        Thanks for exploring this hub. Now go download
                        <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer"
                            class="text-braveOrange hover:text-orange-300 underline">
                            Brave Browser
                        </a>
                    </p>
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
