<script setup lang="ts">
import WaveformPlayer from './WaveformPlayer.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useWallet } from '../composables/useWallet';

const sectionRef = ref<HTMLElement | null>(null);
const { hasBeenVisible } = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
    once: true
});

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
            </div>
        </div>
    </section>
</template>
