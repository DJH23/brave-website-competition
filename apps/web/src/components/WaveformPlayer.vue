<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, Suspense } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import Button from './Button.vue';
import BATLogo3DAsync from './BATLogo3DAsync.vue';
import { useMultiChainWallet, type ChainType } from '../composables/useMultiChainWallet';
import { useAudioManager } from '../composables/useAudioManager';

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
const isLoading = ref(true);
const showChainSelector = ref(false);
const selectedChain = ref<ChainType>("ethereum");
const errorMsg = ref<string | null>(null);
const calculatedDuration = ref<string>('0:00');
const currentTime = ref<string>('0:00');
const { connectWallet, isConnected, sendBATTip } = useMultiChainWallet();
const { registerPlay, unregisterPlay } = useAudioManager();

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
        // Show chain selector modal before connecting
        showChainSelector.value = true;
        return;
    }

    try {
        await sendBATTip(props.price.toString());
        alert(`Thank you for purchasing "${props.title}" for ${props.price} BAT!`);
    } catch (error) {
        console.error('Purchase failed:', error);
        alert('Failed to complete purchase. Please try again.');
    }
};

const handleChainSelected = async (chain: ChainType) => {
    selectedChain.value = chain;
    showChainSelector.value = false;

    try {
        await connectWallet(chain);

        // Wait a bit for reactive state to update
        await new Promise(resolve => setTimeout(resolve, 500));

        // Proceed with purchase after connection
        if (isConnected.value && props.price) {
            console.log('[WaveformPlayer] Connection successful, proceeding with purchase');
            console.log('[WaveformPlayer] isConnected:', isConnected.value);
            console.log('[WaveformPlayer] price:', props.price);
            const success = await sendBATTip(props.price.toString());
            if (success) {
                alert(`Thank you for purchasing "${props.title}" for ${props.price} BAT!`);
            } else {
                alert('Failed to complete purchase. Please try again.');
            }
        } else {
            console.warn('[WaveformPlayer] Connection failed or no price set');
            console.warn('[WaveformPlayer] isConnected:', isConnected.value);
            console.warn('[WaveformPlayer] price:', props.price);
            alert('Connection failed. Please try again.');
        }
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
                '#fb542b',  // orange
                '#fbbf24',  // yellow
            ],
            progressColor: [
                '#7c3aed',  // purple
                '#0ea5e9',  // blue
            ],
            height: 80,
            barWidth: 2,
            barGap: 2,
            barRadius: 2,
            cursorColor: '#fff',
        });
        console.log('Loading audio from:', props.src);

        // Capture the instance for use in event callbacks
        const ws = wavesurfer.value;

        ws.load(props.src);
        ws.on('play', () => {
            isPlaying.value = true;
            // Register this instance as the active player
            registerPlay(ws);
        });
        ws.on('pause', () => {
            isPlaying.value = false;
            // Unregister when paused
            unregisterPlay(ws);
        });
        ws.on('finish', () => {
            isPlaying.value = false;
            // Unregister when finished
            unregisterPlay(ws);
        });
        ws.on('error', (e: any) => {
            errorMsg.value = 'Failed to load waveform: ' + (e?.message || 'Unknown error');
            isLoading.value = false;
            console.error('WaveSurfer error:', e);
        });
        wavesurfer.value.on('ready', () => {
            console.log('WaveSurfer ready for:', props.title);
            isLoading.value = false;
            // Calculate and set the duration when audio is ready
            const duration = wavesurfer.value?.getDuration() || 0;
            calculatedDuration.value = formatDuration(duration);
            currentTime.value = formatDuration(duration);
            console.log('Audio duration:', calculatedDuration.value);
        });
        wavesurfer.value.on('timeupdate', (time: number) => {
            // Update remaining time as song plays (countdown)
            const duration = wavesurfer.value?.getDuration() || 0;
            const remaining = duration - time;
            currentTime.value = formatDuration(remaining);
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
        isLoading.value = true;
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
                <span class="text-xs text-neutral-500">{{ currentTime }}</span>
            </div>
        </div>

        <!-- Play Button, Waveform, and Purchase Button Container -->
        <div class="flex items-center gap-2">
            <!-- Play Button on the left -->
            <Button size="sm" variant="ghost" :aria-label="isPlaying ? `Pause ${title}` : `Play ${title}`" @click="play"
                class="shrink-0">
                <i :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'" class="text-xl" aria-hidden="true"></i>
            </Button>

            <!-- Waveform fills available width -->
            <div class="flex-1 mr-2 relative" style="min-height:80px;">
                <!-- Loading state -->
                <div v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm">
                    <div class="flex flex-col items-center gap-2">
                        <div
                            class="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin">
                        </div>
                        <span class="text-xs text-neutral-400">Loading audio...</span>
                    </div>
                </div>
                <!-- Waveform container -->
                <div ref="container" class="w-full h-full"></div>
            </div>

            <!-- Purchase Button on the right -->
            <button v-if="price" @click="handlePurchaseTrack" :aria-label="`Purchase ${title} for ${price} BAT`"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap shrink-0">
                <Suspense>
                    <BATLogo3DAsync :width="56" :height="56" />
                    <template #fallback>
                        <div class="w-7 h-7 bg-white/10 rounded-lg animate-pulse"></div>
                    </template>
                </Suspense>
                <span class="text-sm font-semibold">{{ price }} BAT</span>
            </button>
        </div>

        <div v-if="errorMsg" class="text-red-500 text-xs mt-2">{{ errorMsg }}</div>

        <!-- Chain Selector Modal -->
        <div v-if="showChainSelector" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            @click.self="showChainSelector = false">
            <div
                class="glass-strong rounded-xl p-8 max-w-md w-full border border-brand-purple shadow-2xl relative animate-fade-in">
                <button class="absolute top-3 right-3 text-neutral-400 hover:text-white text-2xl leading-none"
                    @click="showChainSelector = false" aria-label="Close chain selector">
                    ×
                </button>
                <h3 class="text-2xl font-bold mb-4 text-gradient-purple">Choose Blockchain</h3>
                <p class="text-neutral-300 mb-6">Select which blockchain to use for this purchase:</p>

                <div class="space-y-3">
                    <button @click="handleChainSelected('ethereum')"
                        class="w-full p-4 rounded-lg bg-white/5 border border-white/20 hover:border-brand-purple hover:bg-white/10 transition-all duration-300 text-left group">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span class="text-xl">⟠</span>
                            </div>
                            <div>
                                <div class="font-semibold text-white">Ethereum</div>
                                <div class="text-xs text-neutral-400">ERC-20 BAT Token</div>
                            </div>
                        </div>
                    </button>

                    <button @click="handleChainSelected('solana')"
                        class="w-full p-4 rounded-lg bg-white/5 border border-white/20 hover:border-brand-purple hover:bg-white/10 transition-all duration-300 text-left group">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span class="text-xl">◎</span>
                            </div>
                            <div>
                                <div class="font-semibold text-white">Solana</div>
                                <div class="text-xs text-neutral-400">SPL BAT Token</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wavesurfer {
    width: 100%;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>