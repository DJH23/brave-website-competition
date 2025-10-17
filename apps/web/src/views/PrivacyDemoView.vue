<script setup lang="ts">
import PrivacyDemos from '../components/PrivacyDemos.vue';
import Button from '../components/Button.vue';
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 
                           bg-clip-text text-transparent">
                    🛡️ Privacy Demos
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    See your privacy protection in action. Real-time tracker blocking,
                    privacy scores, and fingerprinting defense.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 bg-gradient-to-br from-green-500/10 to-cyan-500/10 
                        backdrop-blur-sm border border-green-500/20 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Why Privacy Matters (Yes, Even for You)
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        <strong class="text-red-400">"I have nothing to hide"</strong> is the most
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
                        <strong class="text-green-400">Good news:</strong> Brave Browser blocks all of this
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
            <h2 class="text-3xl font-bold text-white mb-8 text-center">
                How Brave Protects You
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                        <span>🚫</span> Aggressive Tracker Blocking
                    </h3>
                    <p class="text-gray-300">
                        Brave blocks <strong>third-party trackers</strong>, cookies, and fingerprinting
                        scripts before they load. Websites load faster and your data stays private.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <span>🔒</span> HTTPS Everywhere
                    </h3>
                    <p class="text-gray-300">
                        Automatically upgrades connections to secure HTTPS, protecting your data
                        from eavesdropping and man-in-the-middle attacks.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <span>🎭</span> Fingerprinting Protection
                    </h3>
                    <p class="text-gray-300">
                        Randomizes your browser "fingerprint" to prevent websites from identifying
                        and tracking you across the web, even without cookies.
                    </p>
                </div>
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                        <span>🌐</span> Script Blocking
                    </h3>
                    <p class="text-gray-300">
                        Optional aggressive mode blocks all potentially invasive scripts.
                        Some sites may break, but your privacy is bulletproof.
                    </p>
                </div>
            </div>
        </div>

        <!-- Privacy Tips -->
        <div class="max-w-3xl mx-auto mt-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 
                    backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💪</span>
                Level Up Your Privacy Game
            </h2>
            <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                    <span class="text-green-400 text-xl shrink-0">✓</span>
                    <span>
                        <strong>Use Brave Search</strong> instead of Google — no tracking, no profiling,
                        no ad targeting
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-400 text-xl shrink-0">✓</span>
                    <span>
                        <strong>Enable Brave Shields</strong> (on by default) — blocks ads, trackers,
                        and malware automatically
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-400 text-xl shrink-0">✓</span>
                    <span>
                        <strong>Use Private Windows with Tor</strong> for maximum anonymity —
                        built into Brave (Chromium doesn't have this!)
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-green-400 text-xl shrink-0">✓</span>
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
                        🦁 Download Brave Browser
                    </Button>
                </a>
                <RouterLink to="/search">
                    <Button variant="secondary" size="lg">
                        🔍 Try Private Search
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
