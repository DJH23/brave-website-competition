<script setup lang="ts">
import WaveformPlayer from './WaveformPlayer.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import BATLogo3DAsync from './BATLogo3DAsync.vue';
import TransactionNotification from './TransactionNotification.vue';
import ChainSelectorModal from './ChainSelectorModal.vue';
import { ref, Suspense, computed, onMounted, onBeforeUnmount } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import { useMultiChainWallet, type ChainType } from '../composables/useMultiChainWallet';
import { useBATPrice } from '../composables/useBATPrice';

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
        src: "/audio/Bach_Style.wav",
        price: 10 // Price in BAT
    },
    {
        title: "A Computer Is An Educational Device",
        genre: "Electronica",
        src: "/audio/A_Computer_Is_An_Educational_Device_Mixdown_3.wav",
        price: 10 // Price in BAT
    },
    {
        title: "Cygnus",
        genre: "Techno - Melodic",
        src: "/audio/Cygnus.wav",
        price: 10 // Price in BAT
    }
]);

const tipAmount = ref(5); // Default tip amount in BAT
const { connectWallet, isConnected, sendBATTip, activeChain } = useMultiChainWallet();
const { batPrice } = useBATPrice();

// Chain selector state for tip button
const showTipChainSelector = ref(false);

// Notification state
const notification = ref({
    show: false,
    type: 'info' as 'success' | 'error' | 'info',
    title: '',
    message: '',
    txSignature: undefined as string | undefined,
    chain: undefined as 'ethereum' | 'solana' | undefined,
});

const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string, txSignature?: string, chain?: ChainType) => {
    notification.value = {
        show: true,
        type,
        title,
        message,
        txSignature,
        chain: chain === null ? undefined : chain,
    };
};

const closeNotification = () => {
    notification.value.show = false;
};

// Avoid TS plugin union issues by providing a narrowed list for rendering
const visibleTracks = computed<Track[]>(() => (hasBeenVisible.value ? musicTracks.value : []));

// Height matching refs
const tipButtonRef = ref<HTMLElement | null>(null);
const tipControlsRef = ref<HTMLElement | null>(null);
const controlsHeight = ref<string>('auto');

// Computed USD equivalent
const tipUSD = computed(() => {
    const priceUSD = batPrice.value?.usd || 0;
    return (tipAmount.value * priceUSD).toFixed(2);
});

const updateControlsHeight = () => {
    if (tipButtonRef.value) {
        const height = tipButtonRef.value.offsetHeight;
        controlsHeight.value = `${height}px`;
    }
};

// ResizeObserver to track button height changes
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    if (tipButtonRef.value) {
        updateControlsHeight();

        resizeObserver = new ResizeObserver(() => {
            updateControlsHeight();
        });

        resizeObserver.observe(tipButtonRef.value);
    }
});

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});

const incrementTip = () => {
    tipAmount.value += 1;
};

const decrementTip = () => {
    if (tipAmount.value > 1) {
        tipAmount.value -= 1;
    }
};

const handleTipInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value) || 1;
    tipAmount.value = Math.max(1, value); // Ensure minimum of 1
};

const handleTipArtist = async () => {
    if (!isConnected.value) {
        // Show chain selector modal
        showTipChainSelector.value = true;
        return;
    }

    try {
        const success = await sendBATTip(tipAmount.value.toString());
        if (success) {
            showNotification(
                'success',
                'Tip Sent! 🎉',
                `Thank you for tipping ${tipAmount.value} BAT to support the artist!`,
                undefined,
                activeChain.value || undefined
            );
        } else {
            showNotification('error', 'Tip Failed', 'Failed to send tip. Please try again.');
        }
    } catch (error) {
        console.error('Tip failed:', error);
        showNotification('error', 'Tip Failed', 'Failed to send tip. Please try again.');
    }
};

const handleTipChainSelected = async (chain: ChainType) => {
    showTipChainSelector.value = false;

    try {
        await connectWallet(chain);

        // Wait for reactive state to update
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isConnected.value) {
            const success = await sendBATTip(tipAmount.value.toString());
            if (success) {
                showNotification(
                    'success',
                    'Tip Sent! 🎉',
                    `Thank you for tipping ${tipAmount.value} BAT to support the artist!`,
                    undefined,
                    activeChain.value || undefined
                );
            } else {
                showNotification('error', 'Tip Failed', 'Failed to send tip. Please try again.');
            }
        } else {
            showNotification('error', 'Connection Failed', 'Failed to connect wallet. Please try again.');
        }
    } catch (error) {
        console.error('Tip failed:', error);
        showNotification('error', 'Tip Failed', 'Failed to send tip. Please try again.');
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
                    <div class="flex flex-col gap-3">
                        <p class="text-sm text-neutral-400">
                            Support the artist with a tip
                        </p>
                        <div class="flex items-center gap-3">
                            <!-- Tip Amount Controls -->
                            <div ref="tipControlsRef" :style="{ height: controlsHeight }"
                                class="flex flex-col justify-center px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300">
                                <div class="flex items-center gap-3">
                                    <button @click="decrementTip" aria-label="Decrease tip amount"
                                        class="text-neutral-300 hover:text-white transition-colors">
                                        <i class="bi bi-dash-lg text-xl" aria-hidden="true"></i>
                                    </button>
                                    <div class="flex items-baseline">
                                        <input type="number" v-model.number="tipAmount" @input="handleTipInput" min="1"
                                            class="w-8 text-center text-lg font-bold text-braveOrange bg-transparent border-none focus:outline-none focus:ring-0 appearance-none"
                                            aria-label="Tip amount in BAT" />
                                        <span class="text-xs text-neutral-100 ml-0.5">BAT</span>
                                    </div>
                                    <button @click="incrementTip" aria-label="Increase tip amount"
                                        class="text-neutral-300 hover:text-white transition-colors">
                                        <i class="bi bi-plus-lg text-xl" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div class="text-center">
                                    <span class="text-xs text-neutral-300">(≈${{ tipUSD }} USD)</span>
                                </div>
                            </div>

                            <!-- Tip Button -->
                            <button ref="tipButtonRef" @click="handleTipArtist"
                                :aria-label="`Tip ${tipAmount} BAT to artist`"
                                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <Suspense>
                                    <BATLogo3DAsync :width="56" :height="56" />
                                    <template #fallback>
                                        <div class="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                                    </template>
                                </Suspense>
                                <span class="text-sm font-semibold">Tip Artist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Chain Selector Modal for Tip (reusable) -->
    <ChainSelectorModal :show="showTipChainSelector" mode="tip" @close="showTipChainSelector = false"
        @select="handleTipChainSelected" />

    <!-- Transaction Notification -->
    <TransactionNotification :show="notification.show" :type="notification.type" :title="notification.title"
        :message="notification.message" :tx-signature="notification.txSignature" :chain="notification.chain"
        @close="closeNotification" />
</template>

<style scoped>
/* Hide browser default number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}

/* Chain selector card with hover glow effect */
.chain-selector-card {
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
}

.chain-selector-card:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 30px color-mix(in srgb, var(--glow-color) 70%, transparent),
        0 0 60px color-mix(in srgb, var(--glow-color) 40%, transparent),
        0 15px 50px rgba(0, 0, 0, 0.4);
}
</style>
