<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import Button from './Button.vue';

const props = defineProps<{
    src: string;
    title: string;
    genre?: string;
    duration?: string;
}>();

const container = ref<HTMLElement | null>(null);
const wavesurfer = ref<WaveSurfer | null>(null);
const isPlaying = ref(false);
const errorMsg = ref<string | null>(null);

const play = () => {
    if (wavesurfer.value) {
        wavesurfer.value.playPause();
        isPlaying.value = wavesurfer.value.isPlaying();
    }
};

onMounted(() => {
    console.log('WaveformPlayer mounted for:', props.title, 'src:', props.src, 'container:', container.value);
    if (container.value) {
        console.log('Creating WaveSurfer instance...');
        wavesurfer.value = WaveSurfer.create({
            container: container.value,
            waveColor: '#a855f7',
            progressColor: '#f59e0b',
            height: 80,
            barWidth: 2,
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
    <div class="p-4 bg-neutral-900/60 rounded-lg shadow flex flex-col gap-2">
        <div class="flex items-center justify-between mb-2">
            <div>
                <h4 class="font-semibold text-lg">{{ title }}</h4>
                <p v-if="genre" class="text-xs text-neutral-400">{{ genre }}</p>
            </div>
            <div class="flex items-center gap-2">
                <span v-if="duration" class="text-xs text-neutral-500">{{ duration }}</span>
                <Button size="sm" variant="ghost" :aria-label="isPlaying ? `Pause ${title}` : `Play ${title}`"
                    @click="play">
                    <span aria-hidden="true">{{ isPlaying ? '⏸️' : '▶️' }}</span>
                </Button>
            </div>
        </div>
        <div ref="container" class="w-full" style="min-height:80px;"></div>
        <div v-if="errorMsg" class="text-red-500 text-xs mt-2">{{ errorMsg }}</div>
    </div>
</template>

<style scoped>
.wavesurfer {
    width: 100%;
}
</style>
