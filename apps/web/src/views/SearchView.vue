<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';

const searchQuery = ref('');
const isSearching = ref(false);

const handleSearch = () => {
    if (!searchQuery.value.trim()) return;

    // Open Brave Search in new tab
    const braveSearchUrl = `https://search.brave.com/search?q=${encodeURIComponent(searchQuery.value)}`;
    window.open(braveSearchUrl, '_blank', 'noopener,noreferrer');

    searchQuery.value = '';
};

const quickSearches = [
    'privacy browser comparison',
    'what is cryptocurrency',
    'best music production software',
    'how to stay anonymous online'
];

const searchSuggestion = (query: string) => {
    searchQuery.value = query;
    handleSearch();
};
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 
                           bg-clip-text text-transparent">
                    🔍 Brave Search
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Private, independent, and unbiased search powered by Brave.
                    No tracking. No profiling. Just results.
                </p>
            </div>

            <!-- Why This Matters -->
            <div class="mt-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 
                        backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Why Search Privacy Matters
                </h2>
                <div class="space-y-4 text-gray-300">
                    <p>
                        <strong class="text-red-400">Google knows everything you search for.</strong>
                        Every question you ask, every health concern, every embarrassing query —
                        it's all stored, analyzed, and used to build a detailed profile of you.
                    </p>
                    <p>
                        Think about what you've searched recently:
                    </p>
                    <ul class="list-disc list-inside space-y-2 ml-4">
                        <li>Medical symptoms you'd never tell anyone</li>
                        <li>Financial troubles or job searches</li>
                        <li>Political views and controversial topics</li>
                        <li>Relationship problems or dating advice</li>
                    </ul>
                    <p class="mt-4">
                        <strong class="text-blue-400">Brave Search is different:</strong> Your searches
                        are <strong>completely anonymous</strong>. Brave doesn't store your IP address,
                        doesn't build a profile, and doesn't sell your data. Ever.
                    </p>
                    <p class="text-sm text-gray-400 mt-4">
                        Bonus: Brave Search has its own independent index (not just Bing results)
                        and gives you unbiased results without filter bubbles.
                    </p>
                </div>
            </div>
        </div>

        <!-- Search Demo -->
        <div class="max-w-3xl mx-auto mb-16">
            <div class="bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                        backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    Try Brave Search Now
                </h2>

                <form @submit.prevent="handleSearch" class="space-y-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Search anything... privately" class="w-full px-6 py-4 pl-12 bg-black/30 border border-white/20 rounded-xl
                                   text-white placeholder-gray-400 focus:outline-none focus:border-blue-400
                                   focus:ring-2 focus:ring-blue-400/20 transition-all" />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                            🔍
                        </span>
                    </div>

                    <Button type="submit" variant="primary" size="lg" class="w-full">
                        Search on Brave (opens in new tab)
                    </Button>
                </form>

                <div class="mt-6">
                    <p class="text-sm text-gray-400 mb-3 text-center">Quick suggestions:</p>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button v-for="query in quickSearches" :key="query" @click="searchSuggestion(query)" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 
                                   rounded-lg text-sm text-gray-300 hover:text-white transition-all">
                            {{ query }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comparison: Brave Search vs Others -->
        <div class="max-w-5xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-white mb-8 text-center">
                Brave Search vs. The Competition
            </h2>

            <div class="overflow-x-auto">
                <table class="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                    <thead class="bg-white/5">
                        <tr>
                            <th class="px-6 py-4 text-left text-gray-300">Feature</th>
                            <th class="px-6 py-4 text-center text-blue-400 font-bold">Brave Search</th>
                            <th class="px-6 py-4 text-center text-gray-400">Google</th>
                            <th class="px-6 py-4 text-center text-gray-400">DuckDuckGo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/10">
                        <tr>
                            <td class="px-6 py-4 text-gray-300">No tracking</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-gray-300">Independent index</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-gray-300">No filter bubble</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                            <td class="px-6 py-4 text-center text-yellow-400 text-xl">~</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-gray-300">No ads based on your data</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 text-gray-300">Anonymous usage</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                            <td class="px-6 py-4 text-center text-red-400 text-xl">✗</td>
                            <td class="px-6 py-4 text-center text-green-400 text-xl">✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Privacy Tips -->
        <div class="max-w-3xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                    backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                Search Like a Privacy Pro
            </h2>
            <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                    <span class="text-blue-400 text-xl shrink-0">1.</span>
                    <span>
                        <strong>Set Brave Search as your default</strong> in browser settings —
                        privacy becomes automatic
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-blue-400 text-xl shrink-0">2.</span>
                    <span>
                        <strong>Use "Goggles"</strong> to customize your search results —
                        unique to Brave Search, lets you rank sources
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-blue-400 text-xl shrink-0">3.</span>
                    <span>
                        <strong>Try "Anonymous Local Results"</strong> — get local business info
                        without revealing your location
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <span class="text-blue-400 text-xl shrink-0">4.</span>
                    <span>
                        <strong>Disable JavaScript in Shields</strong> for ultra-private searching
                        (may break some features)
                    </span>
                </li>
            </ul>
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3 class="text-2xl font-bold text-white">
                Explore more privacy features
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
                <RouterLink to="/privacy">
                    <Button variant="primary" size="lg">
                        🛡️ Privacy Demos
                    </Button>
                </RouterLink>
                <RouterLink to="/wallet">
                    <Button variant="secondary" size="lg">
                        💰 Try BAT Wallet
                    </Button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
