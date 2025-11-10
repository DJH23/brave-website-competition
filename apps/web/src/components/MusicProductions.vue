<script setup lang="ts">
import WaveformPlayer from './WaveformPlayer.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import TipSection from './TipSection.vue';
import { ref, computed } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";

interface Track {
    title: string;
    genre: string;
    src: string;
    price: number;
}

const sectionRef = ref<HTMLElement | null>(null);
const { hasBeenVisible } = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    once: true
});

const musicTracks = ref<Track[]>([
    {
        title: "Bachman",
        genre: "Classical",
        src: "https://gateway.pinata.cloud/ipfs/bafybeigcj2wdtf7fj4cfdeluahzkxdokooewlrxrhqezznlkwe2kgqstu4",
        price: 10 // Price in BAT
    },
    {
        title: "A Computer Is An Educational Device",
        genre: "Electronica",
        src: "https://gateway.pinata.cloud/ipfs/bafybeie5lfhax5kexpnjwxwxodr55emroexqeuzfwyo4zp6q7dg44afere",
        price: 10 // Price in BAT
    },
    {
        title: "Cygnus",
        genre: "Techno - Melodic",
        src: "https://gateway.pinata.cloud/ipfs/bafybeig643a6zmii2zesog7bcrv7nyp2z5c6kiubcfsrfhsslcco7hcnwu",
        price: 10 // Price in BAT
    }
]);

// Avoid TS plugin union issues by providing a narrowed list for rendering
const visibleTracks = computed<Track[]>(() => (hasBeenVisible.value ? musicTracks.value : []));
</script>

<template>
    <section ref="sectionRef" class="py-12" aria-labelledby="music-tracks-heading"
        :class="{ 'animate-fade-in': hasBeenVisible }">
        <!-- Music Productions -->
        <div>
            <h3 id="music-tracks-heading"
                class="text-3xl md:text-4xl font-bold mb-8 text-left transition-all duration-700 text-gradient-orange"
                :class="{ 'opacity-0 translate-y-8': !hasBeenVisible, 'opacity-100 translate-y-0': hasBeenVisible }">
                <i class="bi bi-boombox text-braveOrange/80" aria-hidden="true"></i>
                Music Tracks
            </h3> <!-- Music Container -->
            <div class="glass rounded-2xl p-6 md:p-8">
                <div v-show="!hasBeenVisible" class="space-y-4 mb-6">
                    <!-- Skeleton loaders for waveforms -->
                    <SkeletonLoader type="waveform" />
                    <SkeletonLoader type="waveform" />
                </div>
                <div v-show="hasBeenVisible" class="space-y-4 mb-6">
                    <div v-for="track in musicTracks" :key="track.src">
                        <WaveformPlayer :src="track.src" :title="track.title" :genre="track.genre"
                            :price="track.price" />
                    </div>
                </div>

                <!-- Tip Artist Section (Bottom Left) -->
                <div class="flex items-start gap-4 pt-4 border-t border-white/10">
                    <TipSection label="Support the artist with a tip" colorClass="text-braveOrange" />
                </div>
            </div>
        </div>
    </section>
</template>
