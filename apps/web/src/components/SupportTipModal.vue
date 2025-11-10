<script setup lang="ts">
import { ref } from 'vue';
import TipSection from './TipSection.vue';

interface Props {
    isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

// Keep a flag that hides the modal content visually while keeping it mounted
const isContentHidden = ref(false);

const handleClose = () => {
    // Emit close immediately (CSS handles enter animation)
    isContentHidden.value = false; // ensure flag reset
    emit('close');
};

const handleChainSelectorOpening = () => {
    // Hide the modal content but keep the modal mounted so child modals remain alive
    isContentHidden.value = true;
};

const handleTipInitiated = () => {
    // Fully close modal now that chain is selected
    isContentHidden.value = false; // Reset before closing
    emit('close');
};

// Keep the modal content visible on open
import { watch } from 'vue';
watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        isContentHidden.value = false;
    }
});
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            :style="{ display: isContentHidden ? 'none' : 'flex' }" @click.self="handleClose">
            <div
                class="glass rounded-2xl p-6 md:p-8 mx-auto w-fit border border-bravePurple/50 shadow-2xl relative group overflow-hidden">
                <!-- Close button -->
                <button @click="handleClose"
                    class="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
                    aria-label="Close">
                    ×
                </button>

                <!-- Support This Project Card Styling -->
                <div class="flex items-center gap-3 mb-4">
                    <i class="bi bi-heart-fill text-braveBlue text-4xl" aria-hidden="true"></i>
                    <h3 class="text-xl md:text-2xl font-bold text-white">Support This Project</h3>
                </div>

                <!-- Use TipSection component to avoid code duplication -->
                <TipSection label="" colorClass="text-braveBlue" @chain-selector-opening="handleChainSelectorOpening"
                    @tip-initiated="handleTipInitiated" />
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
/* Reuse the same minimal enter animation used by ChainSelectorModal */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.98);
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