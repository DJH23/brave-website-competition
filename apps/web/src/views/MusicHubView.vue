<script setup lang="ts">
import { ref } from 'vue';
import MusicProductions from '../components/MusicProductions.vue';
import { useIntersectionObserver } from '../composables/useIntersectionObserver';
import { useCardTilt } from '../composables/useCardTilt';

const showTipModal = ref(false);
const { handleCardMouseMove, handleCardMouseLeave } = useCardTilt();

const musicHubHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: musicHubVisible } = useIntersectionObserver(musicHubHeadingRef, { threshold: 0.1, once: true });

const howBatWorksRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: howBatWorksVisible } = useIntersectionObserver(howBatWorksRef, { threshold: 0.1, once: true });

// "Why This Matters" load transition visibility
const whyMattersRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: whyMattersVisible } = useIntersectionObserver(whyMattersRef, { threshold: 0.1, once: true });

// Comparison data (responsive + perspective toggle)
const perspective = ref<'creators' | 'users'>('creators');

const platforms = [
    { key: 'bat', label: 'Brave Rewards (BAT)' },
    { key: 'ads', label: 'Traditional Ads' },
    { key: 'patreon', label: 'Patreon' },
    { key: 'yt', label: 'YouTube Memberships' }
];

type Cell = { text: string; icon?: string; color?: string };
type Row = { label: string; cells: Cell[] };

const creatorRows: Row[] = [
    {
        label: 'Revenue share kept',
        cells: [
            { text: '~95%+', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: '45–70%', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: '8–12% fees', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: '~30–45% share', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Privacy (user tracking)',
        cells: [
            { text: 'No tracking', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Heavy tracking', icon: 'bi-exclamation-triangle-fill', color: 'text-red-400' },
            { text: 'Account data', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Platform data', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Fees / friction',
        cells: [
            { text: 'No account needed', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'High platform cut', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: '% fees + churn', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: '% share + churn', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Payout speed',
        cells: [
            { text: 'Fast', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Delayed', icon: 'bi-hourglass-split', color: 'text-gray-400' },
            { text: 'Monthly cycles', icon: 'bi-hourglass-split', color: 'text-gray-400' },
            { text: 'Monthly cycles', icon: 'bi-hourglass-split', color: 'text-gray-400' }
        ]
    },
    {
        label: 'Platform dependence',
        cells: [
            { text: 'Open web', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Algorithmic risk', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'Platform lock‑in', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Platform lock‑in', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    }
];

const userRows: Row[] = [
    {
        label: 'Privacy protection',
        cells: [
            { text: 'No tracking', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Targeted tracking', icon: 'bi-exclamation-triangle-fill', color: 'text-red-400' },
            { text: 'Account data', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Platform data', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Account required',
        cells: [
            { text: 'No', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'N/A', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'Yes', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Yes', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Ease to support',
        cells: [
            { text: 'One‑click tipping', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Indirect (ads)', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'Memberships', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Memberships', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Ad experience',
        cells: [
            { text: 'Opt‑in private ads', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Targeted invasive ads', icon: 'bi-x-circle-fill', color: 'text-red-400' },
            { text: 'No ads (paid)', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Platform promos', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    },
    {
        label: 'Costs to user',
        cells: [
            { text: 'None for tipping', icon: 'bi-check-circle-fill', color: 'text-green-400' },
            { text: 'Time/attention', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Monthly fee', icon: 'bi-dash-circle', color: 'text-yellow-400' },
            { text: 'Monthly fee', icon: 'bi-dash-circle', color: 'text-yellow-400' }
        ]
    }
];

const currentRows = () => (perspective.value === 'creators' ? creatorRows : userRows);
</script>

<template>
    <div class="min-h-screen px-4 py-12">
        <!-- Header Section -->
        <div class="max-w-5xl mx-auto mb-16">
            <div class="text-center space-y-6">
                <h1 ref="musicHubHeadingRef"
                    class="text-5xl md:text-6xl font-bold text-gradient-orange transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !musicHubVisible, 'opacity-100 translate-y-0': musicHubVisible }">
                    <i class="bi bi-music-note-beamed" aria-hidden="true"></i> Music Hub
                </h1>
                <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                    Tips and purchases paid directly with BAT — no middlemen, no tracking.
                </p>
            </div>
        </div>

        <!-- Why This Matters (Comparison Table) -->
        <div class="max-w-7xl mx-auto mb-16">
            <h2
                ref="whyMattersRef"
                class="text-3xl md:text-4xl font-bold mb-8 text-left transition-all duration-700 text-gradient-orange flex items-center gap-3"
                :class="{ 'opacity-0 translate-y-8': !whyMattersVisible, 'opacity-100 translate-y-0': whyMattersVisible }"
            >
                <i class="bi bi-info-circle text-braveOrange/80" aria-hidden="true"></i>
                <span>Why This Matters</span>
            </h2>
            <div class="mt-12 glass rounded-2xl p-6 md:p-8">
                <!-- Perspective toggle -->
                <div class="flex items-center justify-center gap-3 mb-6">
                    <button type="button"
                        class="px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors inline-flex items-center gap-2 tracking-wide"
                        :class="perspective === 'creators' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-300 hover:bg-white/5'"
                        :aria-pressed="perspective === 'creators'" @click="() => { perspective = 'creators' }">
                        <i class="bi bi-music-note-beamed text-braveOrange" aria-hidden="true"></i>
                        <span>For Creators</span>
                    </button>
                    <button type="button"
                        class="px-4 py-2 rounded-lg text-base md:text-lg font-semibold transition-colors inline-flex items-center gap-2 tracking-wide"
                        :class="perspective === 'users' ? 'bg-white/15 text-white shadow-sm' : 'text-gray-300 hover:bg-white/5'"
                        :aria-pressed="perspective === 'users'" @click="() => { perspective = 'users' }">
                        <i class="bi bi-people text-braveOrange" aria-hidden="true"></i>
                        <span>For Users</span>
                    </button>
                </div>
                <div class="overflow-x-auto overflow-y-hidden">
                    <Transition name="fade-slide" mode="out-in">
                        <div :key="perspective">
                            <!-- Desktop/tablet table -->
                            <table class="min-w-full text-left text-base hidden md:table">
                                <caption class="sr-only">Monetization comparison across platforms</caption>
                                <thead>
                                    <tr class="text-gray-400">
                                        <th scope="col" class="py-3 pr-6">Criteria</th>
                                        <th v-for="p in platforms" :key="p.key" scope="col" class="py-3 pr-6">{{ p.label
                                        }}</th>
                                    </tr>
                                </thead>
                                <tbody class="align-top">
                                    <tr v-for="row in currentRows()" :key="row.label" class="border-t border-white/10">
                                        <th scope="row" class="py-4 pr-6 font-semibold text-white">{{ row.label }}</th>
                                        <td v-for="(p, idx) in platforms" :key="p.key" class="py-4 pr-6">
                                            <span class="inline-flex items-center gap-2">
                                                <i v-if="row.cells[idx]?.icon"
                                                    :class="['bi', row.cells[idx].icon, row.cells[idx].color]"
                                                    aria-hidden="true"></i>
                                                <span>{{ row.cells[idx]?.text }}</span>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Mobile stacked cards -->
                            <div class="md:hidden space-y-4">
                                <div v-for="(p, pIdx) in platforms" :key="p.key" class="glass rounded-xl p-4">
                                    <div class="text-white font-semibold mb-2 flex items-center gap-2 text-base">
                                        <i v-if="p.key === 'bat'" class="bi bi-shield-check text-braveBlue"
                                            aria-hidden="true"></i>
                                        <i v-else-if="p.key === 'ads'" class="bi bi-bullseye text-red-400"
                                            aria-hidden="true"></i>
                                        <i v-else-if="p.key === 'patreon'" class="bi bi-people text-braveOrange"
                                            aria-hidden="true"></i>
                                        <i v-else class="bi bi-youtube text-bravePink" aria-hidden="true"></i>
                                        {{ p.label }}
                                    </div>
                                    <ul class="space-y-2">
                                        <li v-for="row in currentRows()" :key="row.label"
                                            class="flex items-start justify-between gap-3 border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
                                            <span class="text-gray-400 text-sm">{{ row.label }}</span>
                                            <span class="text-white inline-flex items-center gap-2 text-base">
                                                <i v-if="row.cells[pIdx]?.icon"
                                                    :class="['bi', row.cells[pIdx].icon, row.cells[pIdx].color]"
                                                    aria-hidden="true"></i>
                                                <span>{{ row.cells[pIdx]?.text }}</span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Informative Quote -->
                <div class="mt-8 pt-8 border-t border-white/10">
                    <blockquote class="relative px-10 py-8 md:px-12 md:py-8 text-center">
                        <i class="bi bi-quote text-4xl md:text-6xl text-braveOrange/80 absolute top-4 left-4 md:top-0 md:left-0"
                            aria-hidden="true"></i>
                        <p
                            class="text-lg md:text-xl text-gray-200 italic leading-relaxed max-w-4xl mx-auto relative z-10 px-4">
                            If both the user and the creator have BAT set up, payments can be sent and received easily,
                            directly, and
                            securely, motivating users to reward and creators to create.
                        </p>
                        <i class="bi bi-quote text-4xl md:text-6xl text-braveOrange/80 absolute bottom-4 right-4 md:bottom-0 md:right-0 rotate-180"
                            aria-hidden="true"></i>
                    </blockquote>
                </div>
            </div>
        </div>

        <!-- Music Portfolio Section -->
        <div class="max-w-7xl mx-auto mb-16">
            <MusicProductions />
        </div>

        <!-- CTA Section -->
        <div class="max-w-3xl mx-auto mt-16 text-center space-y-6">
            <h3 class="text-2xl font-bold text-gradient-orange transition-all duration-700 opacity-100 translate-y-0">
                <i class="bi bi-search text-braveOrange/80" aria-hidden="true"></i>
                Ready to explore?
            </h3>
            <div class="flex flex-wrap gap-4 justify-center">
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
                        <i class="bi bi-wallet2 text-braveBlue text-4xl md:text-5xl mb-3" aria-hidden="true"></i>
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

                <!-- Bonus Feature Card -->
                <RouterLink to="/surprise" @mousemove="handleCardMouseMove" @mouseleave="handleCardMouseLeave"
                    class="group relative glass rounded-2xl p-6 md:p-8 cursor-pointer feature-card flex flex-col w-[280px] md:w-[320px] text-left"
                    :style="{ '--glow-color': '#7C3AED' }">
                    <!-- Gradient Overlay -->
                    <div
                        class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                    </div>
                    <!-- Content -->
                    <div class="relative z-10 flex flex-col h-full">
                        <i class="bi bi-gift text-bravePurple text-4xl md:text-5xl mb-3" aria-hidden="true"></i>
                        <h4 class="text-xl md:text-2xl font-bold text-white mb-2">Bonus Feature</h4>
                        <p class="text-gray-300 text-sm md:text-base mb-4 flex-grow">Only the bravest dare to explore.
                        </p>
                        <div
                            class="text-bravePurple flex items-center gap-2 font-semibold transition-all duration-300 mt-auto">
                            <span>Explore</span>
                            <i class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-2"
                                aria-hidden="true"></i>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
