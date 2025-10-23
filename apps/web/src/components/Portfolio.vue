<script setup lang="ts">
import WaveformPlayer from './WaveformPlayer.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useWallet } from '../composables/useWallet';
import { useLazyLoad } from '../composables/useLazyLoad';

const sectionRef = ref<HTMLElement | null>(null);
const { hasBeenVisible } = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    once: true
});

const devProjectsHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: devProjectsVisible } = useIntersectionObserver(devProjectsHeadingRef, {
    threshold: 0.1,
    once: true
});

const musicHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: musicHeadingVisible } = useIntersectionObserver(musicHeadingRef, {
    threshold: 0.1,
    once: true
});

const projects = ref([
    {
        title: "Privacy-First Analytics",
        description:
            "Open-source web analytics that respects user privacy. No cookies, no tracking, just insights.",
        tags: ["TypeScript", "Vue 3", "Privacy"],
        link: "https://github.com",
    },
    {
        title: "Decentralized Music Platform",
        description:
            "Stream and license music using BAT. Artists receive 95% of earnings directly.",
        tags: ["Web3", "BAT", "Music"],
        link: "https://github.com",
    },
    {
        title: "Brave Extension Pack",
        description:
            "Collection of privacy-enhancing browser extensions for Brave and Chromium browsers.",
        tags: ["Extensions", "JavaScript", "Privacy"],
        link: "https://github.com",
    },
]);

const musicTracks = ref([
    {
        title: "Bach Style",
        genre: "Classical",
        src: "/audio/Bach_Style.wav",
        price: 10 // Price in BAT
    },
    {
        title: "Bach Style",
        genre: "Classical",
        src: "/audio/Bach_Style.wav",
        price: 10 // Price in BAT
    }
]);

const tipAmount = ref(5); // Default tip amount in BAT
const { connectWallet, isConnected, sendBATTip } = useWallet();

const openProjectLink = (link: string) => {
    window.open(link, '_blank');
};

const incrementTip = () => {
    tipAmount.value += 1;
};

const decrementTip = () => {
    if (tipAmount.value > 1) {
        tipAmount.value -= 1;
    }
};

const handleTipArtist = async () => {
    if (!isConnected.value) {
        await connectWallet();
        if (!isConnected.value) return;
    }

    try {
        await sendBATTip(tipAmount.value.toString());
        alert(`Thank you for tipping ${tipAmount.value} BAT to support the artist!`);
    } catch (error) {
        console.error('Tip failed:', error);
        alert('Failed to send tip. Please try again.');
    }
};
</script>

<template>
    <section ref="sectionRef" class="py-12 px-6" aria-labelledby="portfolio-heading"
        :class="{ 'animate-fade-in': hasBeenVisible }">
        <div class="max-w-7xl mx-auto">
            <h2 id="portfolio-heading" class="text-4xl font-bold mb-4 text-gradient-rainbow transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !hasBeenVisible, 'opacity-100 translate-y-0': hasBeenVisible }">
                Portfolio
            </h2>
            <p class="text-neutral-300 mb-8">
                Showcasing development projects and music productions powered by
                privacy-first technologies.
            </p>

            <!-- Development Projects -->
            <div class="mb-12">
                <h3 ref="devProjectsHeadingRef" id="dev-projects-heading"
                    class="text-2xl font-semibold mb-6 flex items-center gap-2 text-gradient-purple transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !devProjectsVisible, 'opacity-100 translate-y-0': devProjectsVisible }">
                    <i class="bi bi-laptop text-bravePurple" aria-hidden="true"></i> Development Projects
                </h3>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list"
                    aria-labelledby="dev-projects-heading">
                    <Card v-for="project in projects" :key="project.title" :title="project.title" role="listitem">
                        <p class="mb-4">{{ project.description }}</p>
                        <div class="flex flex-wrap gap-2 mb-4" role="list" aria-label="Project technologies">
                            <span v-for="tag in project.tags" :key="tag"
                                class="px-2 py-1 text-xs bg-bravePurple/20 text-bravePurple rounded" role="listitem">
                                {{ tag }}
                            </span>
                        </div>
                        <Button size="sm" variant="secondary" @click="() => openProjectLink(project.link)"
                            :aria-label="`View ${project.title} project`">
                            View Project →
                        </Button>
                    </Card>
                </div>
            </div>

            <!-- Music Productions -->
            <div>
                <h3 ref="musicHeadingRef" id="music-heading"
                    class="text-2xl font-semibold mb-6 flex items-center gap-2 text-gradient-orange transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !musicHeadingVisible, 'opacity-100 translate-y-0': musicHeadingVisible }">
                    <i class="bi bi-music-note-beamed text-braveOrange" aria-hidden="true"></i> Music Productions
                </h3>

                <!-- Music Container -->
                <Card variant="highlight">
                    <div v-if="!hasBeenVisible" class="space-y-4 mb-6">
                        <!-- Skeleton loaders for waveforms -->
                        <SkeletonLoader type="waveform" />
                        <SkeletonLoader type="waveform" />
                    </div>
                    <div v-else class="space-y-4 mb-6">
                        <div v-for="track in musicTracks" :key="track.src">
                            <WaveformPlayer :src="track.src" :title="track.title" :genre="track.genre"
                                :price="track.price" />
                        </div>
                    </div>

                    <!-- Tip Artist Section (Bottom Left) -->
                    <div class="flex items-start gap-4 pt-4 border-t border-white/10">
                        <div class="flex flex-col gap-3">
                            <p class="text-sm text-neutral-400">
                                Support the artist with a tip
                            </p>
                            <div class="flex items-center gap-3">
                                <!-- Tip Amount Controls -->
                                <div class="flex items-center gap-2 glass rounded-lg p-2">
                                    <Button size="sm" variant="ghost" @click="decrementTip"
                                        aria-label="Decrease tip amount">
                                        <i class="bi bi-dash-lg text-xl" aria-hidden="true"></i>
                                    </Button>
                                    <div class="flex flex-row justify-center gap-2 items-center min-w-[60px]">
                                        <span class="text-lg font-bold text-braveOrange">{{ tipAmount }}</span>
                                        <span class="text-xs text-neutral-400">BAT</span>
                                    </div>
                                    <Button size="sm" variant="ghost" @click="incrementTip"
                                        aria-label="Increase tip amount">
                                        <i class="bi bi-plus-lg text-xl" aria-hidden="true"></i>
                                    </Button>
                                </div>

                                <!-- Tip Button -->
                                <Button variant="primary" @click="handleTipArtist"
                                    :aria-label="`Tip ${tipAmount} BAT to artist`">
                                    <i class="bi bi-coin" aria-hidden="true"></i> Tip Artist
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
</template>
