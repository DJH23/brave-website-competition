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
        src: "/audio/Bach_Style.mp3",
        price: 10 // Price in BAT
    },
    {
        title: "A Computer Is An Educational Device",
        genre: "Electronica",
        src: "/audio/A_Computer_Is_An_Educational_Device_Mixdown_3.mp3",
        price: 10 // Price in BAT
    },
    {
        title: "Cygnus",
        genre: "Techno - Melodic",
        src: "/audio/Cygnus.mp3",
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
