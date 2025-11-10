<script setup lang="ts">
import { ref } from 'vue';
import PrivacyDemos from '../components/PrivacyDemos.vue';
import Button from '../components/Button.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

// Reveal on scroll for main headings
const privacyDemoHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: privacyDemoVisible } = useIntersectionObserver(privacyDemoHeadingRef, { threshold: 0.1, once: true });

const howBraveProtectsRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: howBraveProtectsVisible } = useIntersectionObserver(howBraveProtectsRef, { threshold: 0.1, once: true });
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 ref="privacyDemoHeadingRef"
                    class="text-5xl md:text-6xl font-bold text-gradient-rainbow transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !privacyDemoVisible, 'opacity-100 translate-y-0': privacyDemoVisible }">
                    <i class="bi bi-shield-check" aria-hidden="true"></i> Privacy Demos
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    See your privacy protection in action. Real-time tracker blocking,
                    privacy scores, and fingerprinting defense.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 glass rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <i class="bi bi-lightbulb text-yellow-500" aria-hidden="true"></i>
                    Why Privacy Matters (Yes, Even for You)
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        <strong class="text-red-600">"I have nothing to hide"</strong> is the most
                        dangerous myth online. Here's what's actually happening right now:
                    </p>
                    <ul class="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Every website you visit</strong> is tracked by dozens of companies
                            you've never heard of
                        </li>
                        <li>
                            <strong>Your browsing habits</strong> are sold to advertisers, insurance companies,
                            and data brokers
                        </li>
                        <li>
                            <strong>Your unique "fingerprint"</strong> follows you across the web,
                            even in incognito mode
                        </li>
                        <li>
                            <strong>Price discrimination</strong> shows you higher prices based on your data
                        </li>
                        <li>
                            <strong>Targeted manipulation</strong> uses your psychology against you
                        </li>
                    </ul>
                    <p class="mt-4">
                        <strong class="text-green-600">Good news:</strong> Brave Browser blocks all of this
                        automatically. No setup required. The demos below show you exactly what's being blocked
                        right now.
                    </p>
                </div>
            </div>
        </div>

        <!-- Interactive Privacy Demos -->
        <div class="max-w-7xl mx-auto">
            <PrivacyDemos />
        </div>

        <!-- How Brave Protects You -->
        <div class="max-w-5xl mx-auto mt-16">
            <h2 ref="howBraveProtectsRef"
                class="text-3xl font-bold text-white mb-8 text-center transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !howBraveProtectsVisible, 'opacity-100 translate-y-0': howBraveProtectsVisible }">
                How Brave Protects You
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
                        <i class="bi bi-shield-slash" aria-hidden="true"></i> Aggressive Tracker Blocking
                    </h3>
                    <p class="text-gray-300">
                        Brave blocks <strong>third-party trackers</strong>, cookies, and fingerprinting
                        scripts before they load. Websites load faster and your data stays private.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-braveBlue mb-3 flex items-center gap-2">
                        <i class="bi bi-lock" aria-hidden="true"></i> HTTPS Everywhere
                    </h3>
                    <p class="text-gray-300">
                        Automatically upgrades connections to secure HTTPS, protecting your data
                        from eavesdropping and man-in-the-middle attacks.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-bravePurple mb-3 flex items-center gap-2">
                        <i class="bi bi-shield" aria-hidden="true"></i> Fingerprinting Protection
                    </h3>
                    <p class="text-gray-300">
                        Randomizes your browser "fingerprint" to prevent websites from identifying
                        and tracking you across the web, even without cookies.
                    </p>
                </div>
                <div class="glass rounded-xl p-6">
                    <h3 class="text-xl font-bold text-braveOrange mb-3 flex items-center gap-2">
                        <i class="bi bi-code-slash" aria-hidden="true"></i> Script Blocking
                    </h3>
                    <p class="text-gray-300">
                        Optional aggressive mode blocks all potentially invasive scripts.
                        Some sites may break, but your privacy is bulletproof.
                    </p>
                </div>
            </div>
        </div>

        <!-- Privacy Tips -->
        <div class="max-w-3xl mx-auto mt-16 glass rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <i class="bi bi-lightning-charge" aria-hidden="true"></i>
                Level Up Your Privacy Game
            </h2>
            <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                    <span class="text-green-600 text-xl shrink-0"><i class="bi bi-check-circle"
                            aria-hidden="true"></i></span>
                    <span>
                        <strong>Use Brave Search</strong> instead of Google — no tracking, no profiling,
                        no ad targeting
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-600 text-xl shrink-0"><i class="bi bi-check-circle"
                            aria-hidden="true"></i></span>
                    <span>
                        <strong>Enable Brave Shields</strong> (on by default) — blocks ads, trackers,
                        and malware automatically
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-600 text-xl shrink-0"><i class="bi bi-check-circle"
                            aria-hidden="true"></i></span>
                    <span>
                        <strong>Use Private Windows with Tor</strong> for maximum anonymity —
                        built into Brave (Chromium doesn't have this!)
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-600 text-xl shrink-0"><i class="bi bi-check-circle"
                            aria-hidden="true"></i></span>
                    <span>
                        <strong>Review site permissions</strong> regularly — don't give location,
                        camera, or mic access unless necessary
                    </span>
                </li>
            </ul>
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3 class="text-2xl font-bold text-white">
                Ready to take control of your online privacy?
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
                <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="lg">
                        <i class="bi bi-download" aria-hidden="true"></i> Download Brave Browser
                    </Button>
                </a>
                <RouterLink to="/search">
                    <Button variant="secondary" size="lg">
                        <i class="bi bi-search" aria-hidden="true"></i> Try Private Search
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
