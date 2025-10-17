<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import gsap from 'gsap';
import Button from './Button.vue';

interface Props {
    isOpen: boolean;
    tipAmount: string;
    transactionHash?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

const modalRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const successIconRef = ref<HTMLDivElement | null>(null);
const confettiRefs = ref<HTMLDivElement[]>([]);

const setConfettiRef = (el: any) => {
    if (el) confettiRefs.value.push(el);
};

// Animation timeline
const animateIn = () => {
    if (!contentRef.value || !successIconRef.value) return;

    const tl = gsap.timeline();

    // Fade in backdrop
    tl.to(modalRef.value, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out'
    });

    // Scale in content
    tl.from(contentRef.value, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'back.out(1.7)'
    }, '-=0.1');

    // Animate success icon
    tl.from(successIconRef.value, {
        scale: 0,
        rotation: -180,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.2');

    // Confetti burst
    confettiRefs.value.forEach((confetti, index) => {
        const angle = (index / confettiRefs.value.length) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        tl.to(confetti, {
            x,
            y,
            rotation: Math.random() * 360,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.4');
    });
};

const animateOut = () => {
    if (!contentRef.value) return;

    gsap.to(contentRef.value, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            gsap.to(modalRef.value, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => emit('close')
            });
        }
    });
};

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        // Reset confetti refs
        confettiRefs.value = [];
        // Animate in after a brief delay for DOM update
        setTimeout(() => animateIn(), 50);
    }
});

const handleClose = () => {
    animateOut();
};

const viewOnEtherscan = () => {
    if (props.transactionHash) {
        window.open(`https://etherscan.io/tx/${props.transactionHash}`, '_blank');
    }
};
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" ref="modalRef"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            style="opacity: 0" @click.self="handleClose">
            <div ref="contentRef"
                class="relative glass-strong rounded-2xl p-8 max-w-md w-full mx-4 border border-bravePurple/50 shadow-2xl overflow-hidden">
                <!-- Confetti elements -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div v-for="i in 12" :key="i" :ref="setConfettiRef" class="absolute w-3 h-3 rounded-full" :class="[
                        i % 3 === 0 ? 'bg-bravePurple' :
                            i % 3 === 1 ? 'bg-braveOrange' :
                                'bg-braveBlue'
                    ]"></div>
                </div>

                <!-- Success icon -->
                <div class="flex justify-center mb-6">
                    <div ref="successIconRef"
                        class="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center neon-glow">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <!-- Content -->
                <div class="text-center">
                    <h3 class="text-3xl font-bold mb-2 text-gradient-rainbow">
                        <i class="bi bi-stars" aria-hidden="true"></i> Tip Sent!
                    </h3>
                    <p class="text-neutral-300 mb-4">
                        Thank you for supporting this project!
                    </p>

                    <div class="bg-neutral-900/50 rounded-xl p-4 mb-6 border border-neutral-800">
                        <div class="text-sm text-neutral-400 mb-1">Amount Sent</div>
                        <div class="text-3xl font-bold text-braveOrange">
                            {{ tipAmount }} BAT
                        </div>
                    </div>

                    <div v-if="transactionHash" class="mb-6">
                        <button @click="viewOnEtherscan"
                            class="text-sm text-braveBlue hover:text-bravePurple underline transition-colors">
                            View on Etherscan →
                        </button>
                    </div>

                    <Button variant="primary" class="w-full" @click="handleClose">
                        Awesome! Close
                    </Button>
                </div>

                <!-- Close button -->
                <button @click="handleClose"
                    class="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
                    aria-label="Close">
                    ×
                </button>
            </div>
        </div>
    </Teleport>
</template>
