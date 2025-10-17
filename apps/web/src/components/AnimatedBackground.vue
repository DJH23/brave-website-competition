<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props {
    variant?: 'dots' | 'grid';
    opacity?: number;
    parallaxFactor?: number; // 0..1, lower is slower
    zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'dots',
    opacity: 0.15,
    parallaxFactor: 0.03,
    zIndex: -1
});

const patternRef = ref<HTMLDivElement | null>(null);
let rafId = 0;

// Smooth easing state
let currentOffset = 0;
let targetOffset = 0;
const EASE_FACTOR = 0.1;

const updateParallax = () => {
    if (!patternRef.value) return;

    // Smooth lerp toward target
    currentOffset += (targetOffset - currentOffset) * EASE_FACTOR;

    // Apply transform
    patternRef.value.style.transform = `translateY(${currentOffset}px)`;

    // Continue animating if not at target
    if (Math.abs(targetOffset - currentOffset) > 0.1) {
        rafId = requestAnimationFrame(updateParallax);
    }
};

const onScroll = () => {
    const scrollTop = window.scrollY || 0;
    targetOffset = scrollTop * props.parallaxFactor;

    // Ensure animation is running
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateParallax);
};

onMounted(() => {
    // Initial position
    targetOffset = (window.scrollY || 0) * props.parallaxFactor;
    currentOffset = targetOffset;
    if (patternRef.value) {
        patternRef.value.style.transform = `translateY(${currentOffset}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(rafId);
});
</script>

<template>
    <div class="absolute inset-0 pointer-events-none" :style="{ opacity: opacity, zIndex: zIndex, minHeight: '100vh' }">
        <div v-if="variant === 'dots'" ref="patternRef" class="fixed inset-0 bg-dot-pattern"></div>
        <div v-else ref="patternRef" class="fixed inset-0 bg-grid-pattern"></div>
    </div>
</template>

<style scoped>
.bg-dot-pattern {
    background-image: radial-gradient(circle, rgba(124, 58, 237, 0.4) 1px, transparent 1px);
    background-size: 30px 30px;
    background-repeat: repeat;
    will-change: transform;
}

.bg-grid-pattern {
    background-image:
        linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px);
    background-size: 40px 40px;
    background-repeat: repeat;
    will-change: transform;
}

@keyframes pattern-drift {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 40px 40px;
    }
}

.animate-pattern-drift {
    animation: pattern-drift 20s linear infinite;
}
</style>
