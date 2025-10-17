<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import Navigation from "./components/Navigation.vue";
import ParticleBackground from "./components/ParticleBackground.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";
import gsap from 'gsap';

const route = useRoute();

// SEO Meta Tags
useHead({
    title: 'Privacy-First Creator Hub | Web Development & Music Production',
    meta: [
        {
            name: 'description',
            content: 'A privacy-first platform showcasing web development projects and music productions. Built with Vue 3, powered by Brave Browser and BAT (Basic Attention Token).'
        },
        {
            name: 'keywords',
            content: 'privacy, web development, music production, Brave Browser, BAT, cryptocurrency, Web3, Vue 3, TypeScript'
        },
        {
            name: 'author',
            content: 'Privacy-First Creator'
        },
        // Open Graph / Facebook
        {
            property: 'og:type',
            content: 'website'
        },
        {
            property: 'og:title',
            content: 'Privacy-First Creator Hub | Web Development & Music Production'
        },
        {
            property: 'og:description',
            content: 'A privacy-first platform showcasing web development projects and music productions. Built with Vue 3, powered by Brave Browser and BAT.'
        },
        {
            property: 'og:url',
            content: 'https://your-domain.com'
        },
        // Twitter
        {
            name: 'twitter:card',
            content: 'summary_large_image'
        },
        {
            name: 'twitter:title',
            content: 'Privacy-First Creator Hub'
        },
        {
            name: 'twitter:description',
            content: 'A privacy-first platform showcasing web development projects and music productions.'
        },
        // Mobile
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, viewport-fit=cover'
        },
        {
            name: 'mobile-web-app-capable',
            content: 'yes'
        },
        {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        },
        {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black-translucent'
        }
    ],
    link: [
        {
            rel: 'canonical',
            href: 'https://your-domain.com'
        }
    ]
});

// GSAP Route Transition Functions  
const onBeforeEnter = (el: Element) => {
    gsap.set(el, { opacity: 0, y: 20 });
};

const onEnter = (el: Element, done: () => void) => {
    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: done
    });
};

const onLeave = (el: Element, done: () => void) => {
    gsap.to(el, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: done
    });
};
</script>

<template>
    <AnimatedBackground variant="dots" :opacity="0.12" :parallaxFactor="0.2" :zIndex="-1" />
    <ParticleBackground :parallax-factor="0.01" />
    <div class="min-h-screen flex flex-col relative z-10 bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        <Navigation />

        <!-- Router View with GSAP Transitions -->
        <main id="main-content" class="flex-1" role="main">
            <Transition mode="out-in" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
                <RouterView :key="route.path" />
            </Transition>
        </main>

        <!-- Footer -->
        <footer role="contentinfo"
            class="p-6 text-neutral-400 text-sm border-t border-neutral-800/50 mt-12 bg-neutral-950/50">
            <div class="max-w-7xl mx-auto">
                <div class="grid md:grid-cols-3 gap-8 mb-8">
                    <!-- Project Info -->
                    <div>
                        <h3 class="text-white font-semibold mb-3">Privacy-First Creator Hub</h3>
                        <p class="text-xs mb-3">
                            Built for the Brave Website Challenge. Showcasing privacy-first
                            technologies, BAT integration, and modern web development.
                        </p>
                        <nav class="flex gap-3" aria-label="Footer social media links">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                GitHub
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                Twitter
                            </a>
                            <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer"
                                class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-braveOrange rounded-sm">
                                SoundCloud
                            </a>
                        </nav>
                    </div>

                    <!-- Quick Links -->
                    <nav aria-label="Resource links">
                        <h3 class="text-white font-semibold mb-3">Resources</h3>
                        <ul class="space-y-2 text-xs">
                            <li>
                                <a href="https://brave.com" target="_blank" rel="noopener noreferrer"
                                    class="hover:text-bravePurple transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                    Brave Browser
                                </a>
                            </li>
                            <li>
                                <a href="https://basicattentiontoken.org" target="_blank" rel="noopener noreferrer"
                                    class="hover:text-braveOrange transition-colors focus:outline-none focus:ring-2 focus:ring-braveOrange rounded-sm">
                                    Basic Attention Token
                                </a>
                            </li>
                            <li>
                                <a href="https://brave.com/brave-rewards/" target="_blank" rel="noopener noreferrer"
                                    class="hover:text-braveBlue transition-colors focus:outline-none focus:ring-2 focus:ring-braveBlue rounded-sm">
                                    Brave Rewards
                                </a>
                            </li>
                            <li>
                                <a href="https://support.brave.com" target="_blank" rel="noopener noreferrer"
                                    class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                    Support & Docs
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Tech Stack -->
                    <div>
                        <h3 class="text-white font-semibold mb-3">Built With</h3>
                        <ul class="space-y-2 text-xs">
                            <li>Vue 3 (Composition API)</li>
                            <li>Vite + TypeScript</li>
                            <li>TailwindCSS + Three.js</li>
                            <li>NestJS API</li>
                            <li>GitHub Actions (CI/CD)</li>
                        </ul>
                    </div>
                </div>

                <div class="pt-6 border-t border-neutral-800/50 text-center">
                    <span>© 2025 • Built for Brave Website Challenge</span>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped></style>
