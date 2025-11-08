<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import Button from './Button.vue';
import { useWallet } from '../composables/useWallet';

const props = defineProps<{
    src: string;
    title: string;
    genre?: string;
    duration?: string;
    price?: number; // Price in BAT to purchase the track
}>();

const container = ref<HTMLElement | null>(null);
const wavesurfer = ref<WaveSurfer | null>(null);
const isPlaying = ref(false);
const errorMsg = ref<string | null>(null);
const calculatedDuration = ref<string>('0:00');
const { connectWallet, isConnected, sendBATTip } = useWallet();

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const play = () => {
    if (wavesurfer.value) {
        wavesurfer.value.playPause();
        isPlaying.value = wavesurfer.value.isPlaying();
    }
};

const handlePurchaseTrack = async () => {
    if (!props.price) {
        alert('This track is not available for purchase.');
        return;
    }

    if (!isConnected.value) {
        await connectWallet();
        if (!isConnected.value) return;
    }

    try {
        await sendBATTip(props.price.toString());
        alert(`Thank you for purchasing "${props.title}" for ${props.price} BAT!`);
    } catch (error) {
        console.error('Purchase failed:', error);
        alert('Failed to complete purchase. Please try again.');
    }
};

onMounted(() => {
    console.log('WaveformPlayer mounted for:', props.title, 'src:', props.src, 'container:', container.value);
    if (container.value) {
        console.log('Creating WaveSurfer instance...');
        wavesurfer.value = WaveSurfer.create({
            container: container.value,
            waveColor: [
                '#7c3aed',  // purple
                '#0ea5e9',  // blue
           
            ],
            progressColor: [
     
                '#fb542b',  // orange
                '#fbbf24',  // yellow
            ],
            height: 80,
            barWidth: 2,
            barGap: 2,
            barRadius: 2,
            cursorColor: '#fff',
        });
        console.log('Loading audio from:', props.src);
        wavesurfer.value.load(props.src);
        wavesurfer.value.on('play', () => (isPlaying.value = true));
        wavesurfer.value.on('pause', () => (isPlaying.value = false));
        wavesurfer.value.on('finish', () => (isPlaying.value = false));
        wavesurfer.value.on('error', (e: any) => {
            errorMsg.value = 'Failed to load waveform: ' + (e?.message || 'Unknown error');
            console.error('WaveSurfer error:', e);
        });
        wavesurfer.value.on('ready', () => {
            console.log('WaveSurfer ready for:', props.title);
            // Calculate and set the duration when audio is ready
            const duration = wavesurfer.value?.getDuration() || 0;
            calculatedDuration.value = formatDuration(duration);
            console.log('Audio duration:', calculatedDuration.value);
        });
    } else {
        console.warn('WaveformPlayer: container ref is null on mount');
        errorMsg.value = 'Container not available';
    }
});

onBeforeUnmount(() => {
    if (wavesurfer.value) {
        wavesurfer.value.destroy();
    }
});

watch(() => props.src, (newSrc) => {
    if (wavesurfer.value) {
        wavesurfer.value.load(newSrc);
        isPlaying.value = false;
    }
});
</script>

<template>
    <div class="p-4 glass-strong rounded-lg relative">
        <!-- Header with title and duration -->
        <div class="flex items-center justify-between mb-3">
            <div>
                <h4 class="font-semibold text-lg">{{ title }}</h4>
                <p v-if="genre" class="text-xs text-neutral-400">{{ genre }}</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-neutral-500">{{ calculatedDuration }}</span>
            </div>
        </div>

        <!-- Play Button, Waveform, and Purchase Button Container -->
        <div class="flex items-center gap-3">
            <!-- Play Button on the left -->
            <Button size="sm" variant="ghost" :aria-label="isPlaying ? `Pause ${title}` : `Play ${title}`" @click="play"
                class="shrink-0">
                <i :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'" class="text-xl" aria-hidden="true"></i>
            </Button>

            <!-- Waveform fills available width -->
            <div ref="container" class="flex-1" style="min-height:80px;"></div>

            <!-- Purchase Button on the right -->
            <Button v-if="price" variant="primary" size="sm" @click="handlePurchaseTrack"
                :aria-label="`Purchase ${title} for ${price} BAT`" class="whitespace-nowrap shrink-0">
                <i class="bi-gem" aria-hidden="true"></i> {{ price }} BAT
            </Button>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-xs mt-2">{{ errorMsg }}</div>
    </div>
</template>

<style scoped>
.wavesurfer {
    width: 100%;
}
</style>
