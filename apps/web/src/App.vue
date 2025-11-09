<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import Navigation from "./components/Navigation.vue";
import ParticleBackground from "./components/ParticleBackground.vue";
import ConfigurableParticleBackground from './components/ConfigurableParticleBackground.vue';
import AnimatedBackground from "./components/AnimatedBackground.vue";
import ChainSelectorModal from './components/ChainSelectorModal.vue';
import gsap from 'gsap';
import { computed, ref } from 'vue';
// Import web3 config to initialize modal (side effect, but tree-shaken if wallet features unused)
import './config/web3';

const route = useRoute();
const currentYear = computed(() => new Date().getFullYear());

// Support (Tip) modal state
const showSupportModal = ref(false);

// Map current route to a themed title color class for the support modal
// Assumptions (adjust if different view themes):
//  - Music / music hub routes use orange
//  - Wallet page uses blue
//  - Privacy demo uses purple
//  - Default fallback blue
const pageTitleColorClass = computed(() => {
    const p = route.path.toLowerCase();
    if (p.startsWith('/music')) return 'text-gradient-orange';
    if (p.startsWith('/wallet')) return 'text-gradient-blue';
    if (p.startsWith('/privacy')) return 'text-gradient-purple';
    return 'text-gradient-blue';
});

function openSupportModal() {
    showSupportModal.value = true;
}
function closeSupportModal() {
    showSupportModal.value = false;
}
function handleChainSelect(_chain: 'ethereum' | 'solana') {
    // For now simply close; future enhancement could route to tipping flow
    showSupportModal.value = false;
}

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
// Because <Transition mode="out-in"> first runs leave on the old view, then before-enter on the new one,
// we can reliably force scroll-to-top here *before* the new view animates in, eliminating any flash
// of the previous page scrolled to top. No timers needed, it's tied to the lifecycle.
const onBeforeEnter = (el: Element) => {
    // Ensure viewport starts at top for the incoming route
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
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
    <!-- <AnimatedBackground variant="dots" :opacity="0.12" :parallaxFactor="0.2" :zIndex="-1" /> -->
    <!-- <ParticleBackground :parallax-factor="0.035" :density-boost="2.8"/> -->
    <ConfigurableParticleBackground />
    <div class="min-h-screen flex flex-col relative z-10">
        <Navigation />

        <!-- Router View with GSAP Transitions -->
        <main id="main-content" class="flex-1" role="main">
            <RouterView v-slot="{ Component }">
                <Transition mode="out-in" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </RouterView>
        </main>

        <!-- Footer -->
        <footer role="contentinfo" class="glass p-6 text-neutral-400 text-sm border-t border-neutral-800/50 mt-12">
            <div class="max-w-7xl mx-auto">
                <div class="grid md:grid-cols-4 gap-8">
                    <!-- Project Info -->
                    <div>
                        <h3 class="text-white font-semibold mb-3">Privacy-First Creator Hub</h3>
                        <p class="text-xs">
                            Built for the Brave Website Challenge. Showcasing privacy-first
                            technologies, BAT integration, and modern web development.
                        </p>
                    </div>

                    <!-- Social Links -->
                    <nav aria-label="Social media links">
                        <h3 class="text-white font-semibold mb-3">Connect</h3>
                        <ul class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <li>
                                <a href="https://github.com/DJH23" target="_blank" rel="noopener noreferrer"
                                    aria-label="GitHub Profile"
                                    class="flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                    <i class="bi bi-github text-lg" aria-hidden="true"></i>
                                    <span>GitHub</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/darren-heath-educator-and-full-stack-developer/"
                                    target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile"
                                    class="flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">
                                    <i class="bi bi-linkedin text-lg" aria-hidden="true"></i>
                                    <span>LinkedIn</span>
                                </a>
                            </li>
                            <!-- Support This Project (opens chain selector modal) -->
                            <li>
                                <button type="button" @click="openSupportModal" aria-label="Support this project (tip)"
                                    class="w-full text-left flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus:ring-2 rounded-sm"
                                    :class="pageTitleColorClass === 'text-gradient-orange' ? 'focus:ring-braveOrange' : pageTitleColorClass === 'text-gradient-purple' ? 'focus:ring-bravePurple' : 'focus:ring-braveBlue'">
                                    <i class="bi bi-heart-fill text-lg" aria-hidden="true"></i>
                                    <span>Support Project</span>
                                </button>
                            </li>
                            <li>
                                <a href="https://soundcloud.com/onemangangmusic" target="_blank"
                                    rel="noopener noreferrer" aria-label="SoundCloud - One Man Gang Music"
                                    class="flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-braveOrange rounded-sm col-span-2">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                        <path fill="none" d="M0 0h24v24H0z" />
                                        <path
                                            d="M10.464 8.596c.265 0 .48 2.106.48 4.704l-.001.351c-.019 2.434-.226 4.353-.479 4.353-.256 0-.465-1.965-.48-4.44v-.352c.005-2.558.218-4.616.48-4.616zm-1.664.96c.259 0 .47 1.8.48 4.054v.34c-.01 2.254-.221 4.054-.48 4.054-.255 0-.464-1.755-.48-3.97v-.34l.002-.34c.025-2.133.23-3.798.478-3.798zm-1.664 0c.255 0 .464 1.755.48 3.97v.34l-.002.34c-.025 2.133-.23 3.798-.478 3.798-.259 0-.47-1.8-.48-4.054v-.34c.01-2.254.221-4.054.48-4.054zm-1.664.576c.265 0 .48 1.762.48 3.936l-.002.335c-.02 2.017-.227 3.601-.478 3.601-.262 0-.474-1.717-.48-3.852v-.168c.006-2.135.218-3.852.48-3.852zM3.808 11.86c.265 0 .48 1.375.48 3.072v.158c-.013 1.623-.223 2.914-.48 2.914-.265 0-.48-1.375-.48-3.072v-.158c.013-1.623.223-2.914.48-2.914zm10.784-4.8c2.58 0 4.72 1.886 5.118 4.354a3.36 3.36 0 1 1 .993 6.589l-.063.001h-8.16a.768.768 0 0 1-.768-.768V7.933a5.16 5.16 0 0 1 2.88-.873zM2.144 11.668c.265 0 .48 1.332.48 2.976v.156c-.014 1.57-.223 2.82-.48 2.82-.26 0-.473-1.29-.48-2.898v-.078c0-1.644.215-2.976.48-2.976zm-1.664.96c.265 0 .48.946.48 2.112v.131c-.016 1.105-.225 1.981-.48 1.981-.265 0-.48-.946-.48-2.112v-.131c.016-1.105.225-1.981.48-1.981z" />
                                    </svg>
                                    <span>SoundCloud</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Quick Links -->
                    <nav aria-label="Resource links">
                        <h3 class="text-white font-semibold mb-3">Resources</h3>
                        <ul class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
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
                        <ul class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <li>Vue 3 (Composition API)</li>
                            <li>Vite + TypeScript</li>
                            <li>TailwindCSS</li>
                            <li>Three.js</li>
                        </ul>
                    </div>
                </div>

                <!-- <div class="pt-6 text-center">
                    <span>© {{ currentYear }} • Built for Brave Website Challenge by <a
                            href="https://www.linkedin.com/in/darren-heath-educator-and-full-stack-developer/"
                            target="_blank" rel="noopener noreferrer"
                            class="text-bravePurple hover:text-braveOrange transition-colors focus:outline-none focus:ring-2 focus:ring-bravePurple rounded-sm">Darren
                            Heath</a></span>
                </div> -->
            </div>
        </footer>

        <!-- Global Support (Tip) Chain Selector Modal -->
        <ChainSelectorModal :show="showSupportModal" mode="tip" title="Support this Project"
            :title-color-class="pageTitleColorClass" @close="closeSupportModal" @select="handleChainSelect" />
    </div>
</template>

<style scoped></style>
