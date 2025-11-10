<script setup lang="ts">
import { computed } from 'vue';

type ChainType = 'ethereum' | 'solana';

type Mode = 'purchase' | 'tip';

const props = withDefaults(defineProps<{
    show: boolean;
    mode?: Mode;
    title?: string;
    description?: string;
    /** Tailwind text color or gradient class for the title */
    titleColorClass?: string;
}>(), {
    mode: 'purchase',
    titleColorClass: 'text-gradient-blue'
});

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', chain: ChainType): void;
}>();

const resolvedTitle = computed(() => props.title ?? 'Choose Blockchain');
const resolvedDescription = computed(() => props.description ?? (
    props.mode === 'tip'
        ? 'Select which blockchain to use for this tip:'
        : 'Select which blockchain to use for this purchase:'
));

// Compute the solid color for "Or Get Set Up" based on titleColorClass
const getLinkColor = computed(() => {
    if (props.titleColorClass === 'text-gradient-orange') return 'text-braveOrange';
    if (props.titleColorClass === 'text-gradient-purple') return 'text-bravePurple';
    if (props.titleColorClass === 'text-gradient-pink') return 'text-bravePink';
    return 'text-braveBlue';
});

function close() {
    emit('close');
}
function select(chain: ChainType) {
    emit('select', chain);
}

// Feature-card style tilt interactions
function onCardMouseMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 50;
    const rotateY = -(x - centerX) / 50;

    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function onCardMouseLeave(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
}
</script>

<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            role="dialog" aria-modal="true" @click.self="close">
            <div class="glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl relative group overflow-hidden">
                <!-- Gradient Overlay (match Bonus Feature card) -->
                <div
                    class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                </div>
                <!-- Content -->
                <div class="relative z-10">
                    <button @click="close"
                        class="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                        aria-label="Close modal">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 class="text-2xl font-bold mb-4" :class="props.titleColorClass">{{ resolvedTitle }}</h3>
                    <p class="text-neutral-300 mb-6">{{ resolvedDescription }}</p>

                    <div class="space-y-3">
                        <!-- Ethereum -->
                        <button @click="select('ethereum')"
                            class="relative w-full p-4 rounded-lg bg-white/5 text-left chain-selector-card"
                            :style="{ '--glow-color': '#7C3AED' }" @mousemove="onCardMouseMove"
                            @mouseleave="onCardMouseLeave">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center transition-transform">
                                    <span class="text-xl">⟠</span>
                                </div>
                                <div>
                                    <div class="font-semibold text-white">Ethereum</div>
                                    <div class="text-xs text-neutral-400">ERC-20 BAT Token</div>
                                </div>
                            </div>
                        </button>

                        <!-- Solana -->
                        <button @click="select('solana')"
                            class="relative w-full p-4 rounded-lg bg-white/5 text-left chain-selector-card"
                            :style="{ '--glow-color': '#FF6A00' }" @mousemove="onCardMouseMove"
                            @mouseleave="onCardMouseLeave">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center transition-transform">
                                    <span class="text-xl">◎</span>
                                </div>
                                <div>
                                    <div class="font-semibold text-white">Solana</div>
                                    <div class="text-xs text-neutral-400">SPL BAT Token</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Get Set Up Link -->
                    <div class="mt-6 text-center">
                        <RouterLink to="/wallet#get-set-up" @click="close"
                            class="group/link text-sm transition-colors inline-flex items-center gap-1 hover:opacity-80"
                            :class="getLinkColor">
                            <span>Or Get Set Up</span>
                            <svg class="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
/* Minimal enter animation */
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

/* Chain selector card with feature-card style glow */
.chain-selector-card {
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.chain-selector-card:hover {
    box-shadow: 0 0 20px color-mix(in srgb, var(--glow-color) 60%, transparent),
        0 10px 40px rgba(0, 0, 0, 0.3);
}
</style>
