<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useHead } from '@vueuse/head';
import Button from "./components/Button.vue";
import Card from "./components/Card.vue";
import DarkModeToggle from "./components/DarkModeToggle.vue";
import Portfolio from "./components/Portfolio.vue";
import BATIntegration from "./components/BATIntegration.vue";
import ParticleBackground from "./components/ParticleBackground.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";

// Lazy-load heavier components to reduce initial bundle size
const BATLogo3DAsync = defineAsyncComponent(() => import("./components/BATLogo3DAsync.vue"));
const PrivacyDemosAsync = defineAsyncComponent(() => import("./components/PrivacyDemos.vue"));

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
</script>

<template>
    <AnimatedBackground variant="dots" :opacity="0.12" :parallaxFactor="0.2" :zIndex="-1" :debug="false" />
    <ParticleBackground />
    <div class="min-h-screen flex flex-col relative z-10">
        <!-- Skip to main content link for keyboard users -->
        <a href="#main-content"
            class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-bravePurple focus:text-white focus:rounded-lg focus:shadow-glow-purple">
            Skip to main content
        </a>

        <!-- Hero3D removed from hero section -->
        <header role="banner"
            class="pl-6 pr-6 flex items-center justify-between animate-fade-in sticky top-0 bg-neutral-950/80 backdrop-blur-sm z-50 border-b border-neutral-800/50">
            <div class="flex items-center gap-3">
                <h1 class="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Suspense>
                        <template #default>
                            <BATLogo3DAsync style="width: 48px; height: 48px; min-width: 48px; min-height: 48px;" />
                        </template>
                        <template #fallback>
                            <div class="w-12 h-12 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 animate-pulse"
                                aria-hidden="true"></div>
                        </template>
                    </Suspense>
                    Privacy‑First Creator Hub
                </h1>
            </div>
            <nav class="flex items-center gap-4" aria-label="Social media and settings">
                <!-- Social Media Links -->
                <div class="hidden md:flex items-center gap-3">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple"
                        aria-label="Visit our GitHub profile">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.916 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.616-5.475 5.916.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple"
                        aria-label="Visit our Twitter / X profile">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer"
                        class="p-2 rounded-md text-neutral-400 hover:text-braveOrange transition-colors focus:outline-none focus:ring-2 focus:ring-braveOrange"
                        aria-label="Listen to our music on SoundCloud">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.474-.254-2.548c-.016-.06-.061-.12-.121-.12M4.46 9.784c-.061 0-.12.061-.127.12l-.21 4.479.21 4.404c.008.059.067.104.135.104.061 0 .112-.045.135-.104l.254-4.389-.254-4.479c-.008-.059-.061-.135-.135-.135m1.8-.135c-.061 0-.135.06-.135.135l-.21 4.613.21 4.404c0 .06.061.135.135.135.061 0 .135-.061.135-.135l.254-4.404-.254-4.613c0-.061-.074-.135-.135-.135m1.801-.135c-.075 0-.135.06-.135.135L7.695 14.479l.21 4.404c0 .074.06.135.135.135s.135-.061.135-.135l.254-4.389-.254-4.479c0-.061-.06-.135-.135-.135m1.859.195c-.074 0-.135.061-.135.135l-.225 4.418.225 4.404c0 .061.061.135.135.135.075 0 .135-.061.135-.135l.24-4.404-.24-4.418c0-.074-.06-.135-.135-.135m1.8-.195c-.075 0-.135.061-.135.135l-.225 4.613.225 4.404c0 .074.06.135.135.135.074 0 .135-.061.135-.135l.254-4.404-.254-4.613c0-.074-.061-.135-.135-.135m1.8 0c-.075 0-.135.061-.135.135l-.225 4.613.225 4.404c0 .074.06.135.135.135.074 0 .135-.061.135-.135l.254-4.404-.254-4.613c0-.074-.061-.135-.135-.135m1.8.06c-.074 0-.135.061-.135.135l-.225 4.554.225 4.404c0 .074.061.135.135.135.075 0 .135-.061.135-.135l.254-4.404-.254-4.554c0-.074-.061-.135-.135-.135m1.8.165c-.074 0-.135.061-.135.135l-.225 4.388.225 4.404c0 .074.061.135.135.135.075 0 .135-.061.135-.135l.254-4.404-.254-4.388c0-.074-.061-.135-.135-.135m1.801-.195c-.075 0-.135.061-.135.135l-.225 4.583.225 4.404c0 .074.061.135.135.135.075 0 .135-.061.135-.135l.254-4.404-.254-4.583c0-.074-.061-.135-.135-.135m1.8.195c-.074 0-.135.061-.135.135l-.225 4.388.225 4.404c0 .074.061.135.135.135.075 0 .135-.061.135-.135l.254-4.404-.254-4.388c0-.074-.061-.135-.135-.135m1.8-.165c-.074 0-.135.061-.135.135l-.225 4.554.225 4.404c0 .074.061.135.135.135s.135-.061.135-.135l.254-4.404-.254-4.554c0-.074-.061-.135-.135-.135" />
                        </svg>
                    </a>
                </div>
                <DarkModeToggle />
            </nav>
        </header>
        <main id="main-content" class="flex-1" role="main">
            <!-- BATLogo3DAsync removed from main content section -->

            <!-- Video Section -->
            <section class="py-12 px-6 bg-neutral-900/20" aria-labelledby="video-section">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 id="video-section" class="text-3xl font-bold mb-4">Watch the Demo</h2>
                    <p class="text-neutral-300 mb-8">
                        See how privacy-first technologies and BAT integration work together
                    </p>
                    <div
                        class="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 shadow-2xl shadow-bravePurple/20">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Privacy-First Creator Hub Demo Video" frameborder="0" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen class="absolute inset-0"></iframe>
                    </div>
                </div>
            </section>

            <Portfolio />
            <Suspense>
                <template #default>
                    <PrivacyDemosAsync />
                </template>
                <template #fallback>
                    <div class="max-w-7xl mx-auto px-6 py-12">
                        <Card variant="highlight">
                            <div class="flex items-center gap-3" role="status" aria-live="polite">
                                <svg class="animate-spin h-5 w-5 text-bravePurple" viewBox="0 0 24 24" fill="none"
                                    aria-hidden="true">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <span class="font-medium">Loading privacy demos…</span>
                            </div>
                            <p class="text-sm text-neutral-400 mt-2">
                                This section is optimized and loads on demand. If it takes too long, check your
                                connection or reload the page.
                            </p>
                        </Card>
                    </div>
                </template>
            </Suspense>
            <BATIntegration />

            <!-- Image Gallery Section -->
            <section class="py-12 px-6" aria-labelledby="gallery-section">
                <div class="max-w-7xl mx-auto">
                    <h2 id="gallery-section" class="text-3xl font-bold mb-8 text-center">Screenshots & Visuals</h2>
                    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card hoverable>
                            <div
                                class="aspect-video bg-gradient-to-br from-bravePurple/20 to-braveBlue/20 rounded-lg flex items-center justify-center mb-3">
                                <i class="bi-palette-fill text-4xl text-bravePurple"></i>
                            </div>
                            <h3 class="font-semibold mb-2">Design System</h3>
                            <p class="text-sm text-neutral-400">
                                Brave-inspired gradients and dark theme
                            </p>
                        </Card>
                        <Card hoverable>
                            <div
                                class="aspect-video bg-gradient-to-br from-braveOrange/20 to-bravePurple/20 rounded-lg flex items-center justify-center mb-3">
                                <span class="text-4xl">🛡️</span>
                            </div>
                            <h3 class="font-semibold mb-2">Privacy Protection</h3>
                            <p class="text-sm text-neutral-400">
                                Real-time tracker blocking visualization
                            </p>
                        </Card>
                        <Card hoverable>
                            <div
                                class="aspect-video bg-gradient-to-br from-braveBlue/20 to-braveOrange/20 rounded-lg flex items-center justify-center mb-3">
                                <span class="text-4xl">💰</span>
                            </div>
                            <h3 class="font-semibold mb-2">BAT Integration</h3>
                            <p class="text-sm text-neutral-400">
                                Wallet connection and tipping system
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
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
