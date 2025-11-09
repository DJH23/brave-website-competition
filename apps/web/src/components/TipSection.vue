<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, Suspense } from 'vue';
import BATLogo3DAsync from './BATLogo3DAsync.vue';
import TransactionNotification from './TransactionNotification.vue';
import ChainSelectorModal from './ChainSelectorModal.vue';
import { useMultiChainWallet, type ChainType } from '../composables/useMultiChainWallet';
import { useBATPrice } from '../composables/useBATPrice';

interface Props {
    label?: string;
    /** Tailwind text color class to apply to the number input (e.g., 'text-braveBlue') */
    colorClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: 'Support this project',
    colorClass: 'text-braveOrange'
});

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

const handleTip = async () => {
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
                `Thank you for tipping ${tipAmount.value} BAT!`,
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
                    `Thank you for tipping ${tipAmount.value} BAT!`,
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
    <div class="flex flex-col gap-3">
        <p class="text-sm text-neutral-400">
            {{ label }}
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
                            class="w-8 text-center text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 appearance-none"
                            :class="props.colorClass" aria-label="Tip amount in BAT" />
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
            <button ref="tipButtonRef" @click="handleTip" :aria-label="`Tip ${tipAmount} BAT`"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Suspense>
                    <BATLogo3DAsync :width="56" :height="56" />
                    <template #fallback>
                        <div class="w-8 h-8 bg-white/10 rounded-lg animate-pulse"></div>
                    </template>
                </Suspense>
                <span class="text-sm font-semibold">Tip</span>
            </button>
        </div>
    </div>

    <!-- Chain Selector Modal for Tip (reusable) -->
    <ChainSelectorModal :show="showTipChainSelector" mode="tip" @close="showTipChainSelector = false"
        @select="handleTipChainSelected" :title-color-class="props.colorClass" />

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
</style>
