<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';

export interface ModalProps {
    open: boolean;
    title: string;
    bullets?: string[];
    primaryCta?: {
        label: string;
        route: string;
    };
    imageUrl?: string;
    videoUrl?: string;
}

const props = defineProps<ModalProps>();
const emit = defineEmits<{
    close: [];
}>();

const router = useRouter();
const modalRef = ref<HTMLElement | null>(null);
const firstFocusable = ref<HTMLElement | null>(null);
const lastFocusable = ref<HTMLElement | null>(null);

function handleClose() {
    emit('close');
}

function handlePrimaryCta() {
    if (props.primaryCta?.route) {
        router.push(props.primaryCta.route);
        handleClose();
    }
}

function handleKeydown(e: KeyboardEvent) {
    if (!props.open) return;

    if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
    }

    // Focus trap: Tab navigation
    if (e.key === 'Tab') {
        const focusableElements = modalRef.value?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
            // Shift+Tab
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            // Focus first focusable element when modal opens
            setTimeout(() => {
                const focusableElements = modalRef.value?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements && focusableElements.length > 0) {
                    (focusableElements[0] as HTMLElement).focus();
                }
            }, 100);
        }
    }
);

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="handleClose">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose"></div>

                <!-- Modal -->
                <div ref="modalRef"
                    class="relative glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-glow"
                    role="dialog" aria-modal="true" :aria-labelledby="title">
                    <!-- Close button -->
                    <button @click="handleClose"
                        class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl glass-strong hover:bg-white/10 transition-colors duration-300"
                        aria-label="Close modal">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Title -->
                    <h2 class="text-white text-[28px] font-semibold mb-6 pr-12 bg-clip-text text-transparent"
                        style="background-image: var(--brand-gradient)">
                        {{ title }}
                    </h2>

                    <!-- Image/Video slot -->
                    <div v-if="imageUrl || videoUrl || $slots.media" class="mb-6 rounded-xl overflow-hidden">
                        <slot name="media">
                            <img v-if="imageUrl" :src="imageUrl" :alt="title" class="w-full h-auto" />
                            <video v-else-if="videoUrl" :src="videoUrl" controls class="w-full h-auto">
                                Your browser does not support the video tag.
                            </video>
                        </slot>
                    </div>

                    <!-- Bullets -->
                    <ul v-if="bullets && bullets.length > 0" class="space-y-3 mb-8">
                        <li v-for="(bullet, idx) in bullets" :key="idx" class="flex items-start gap-3">
                            <i class="bi bi-check-circle-fill text-brand-purple flex-shrink-0 mt-0.5 text-lg"></i>
                            <span class="text-text-100 text-[16px] leading-relaxed">{{ bullet }}</span>
                        </li>
                    </ul>

                    <!-- Default slot for custom content -->
                    <div v-if="$slots.default" class="mb-8">
                        <slot></slot>
                    </div>

                    <!-- Primary CTA -->
                    <div v-if="primaryCta" class="flex gap-4">
                        <button @click="handlePrimaryCta"
                            class="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple hover:shadow-glow transition-all duration-300 hover:scale-105">
                            {{ primaryCta.label }}
                        </button>
                        <button @click="handleClose"
                            class="px-6 py-3 rounded-xl font-semibold text-text-100 glass-strong hover:bg-white/10 transition-colors duration-300">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity var(--dur-med) var(--ease-standard);
}

.modal-fade-enter-active>div:last-child,
.modal-fade-leave-active>div:last-child {
    transition: transform var(--dur-med) var(--ease-standard), opacity var(--dur-med) var(--ease-standard);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from>div:last-child,
.modal-fade-leave-to>div:last-child {
    transform: scale(0.95);
    opacity: 0;
}

.shadow-glow {
    box-shadow: 0 0 24px rgba(123, 63, 242, 0.35);
}
</style>
