<script setup lang="ts">
import WaveformPlayer from './WaveformPlayer.vue';
import { ref } from "vue";
// No import needed for vue-audio-visual components; use <av-waveform> directly in template
import { VueDraggableNext } from 'vue-draggable-next';
import { useWallet } from '../composables/useWallet';
import Card from "./Card.vue";
import Button from "./Button.vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";

const sectionRef = ref<HTMLElement | null>(null);
const { hasBeenVisible } = useIntersectionObserver(sectionRef, {
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
        title: "Bach_Style",
        genre: "Classical",
        duration: "Unknown",
        src: "/audio/Bach_Style.wav",
        premium: false
    }
]);

const playingTrack = ref<string | null>(null);
const unlockedPremium = ref(false);
const { connectWallet, isConnected } = useWallet();

const playTrack = (track: any) => {
    if (track.premium && !unlockedPremium.value) {
        alert('Unlock premium tracks with BAT to play.');
        return;
    }
    playingTrack.value = track.src;
};

const unlockPremiumTracks = async () => {
    // Simulate BAT payment flow
    if (!isConnected.value) {
        await connectWallet();
    }
    // TODO: Integrate real BAT payment logic here
    unlockedPremium.value = true;
    alert('Premium tracks unlocked!');
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
                <h3 id="dev-projects-heading"
                    class="text-2xl font-semibold mb-6 flex items-center gap-2 text-gradient-purple">
                    <span class="text-bravePurple" aria-hidden="true">💻</span> Development Projects
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
                        <Button size="sm" variant="secondary" @click="() => window.open(project.link, '_blank')"
                            :aria-label="`View ${project.title} project`">
                            View Project →
                        </Button>
                    </Card>
                </div>
            </div>

            <!-- Music Productions -->
            <div>
                <h3 id="music-heading" class="text-2xl font-semibold mb-6 flex items-center gap-2 text-gradient-orange">
                    <span class="text-braveOrange" aria-hidden="true">🎵</span> Music Productions
                </h3>
                <Card variant="highlight" aria-labelledby="music-heading">
                    <div class="space-y-4">
                        <div class="space-y-4">
                            <div v-for="track in musicTracks" :key="track.src" class="flex items-center gap-2">
                                <WaveformPlayer :src="track.src" :title="track.title" :genre="track.genre"
                                    :duration="track.duration" />
                            </div>
                        </div>
                        <div class="pt-4 border-t border-neutral-700">
                            <p class="text-sm text-neutral-400 mb-3">
                                Support with BAT and unlock premium tracks
                            </p>
                            <Button variant="primary" aria-label="Unlock premium tracks with BAT"
                                @click="unlockPremiumTracks">
                                <span aria-hidden="true">🦁</span> Unlock Premium
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
</template>
