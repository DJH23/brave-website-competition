<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
    variant?: 'dots' | 'grid';
    opacity?: number;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'dots',
    opacity: 0.15
});

const containerRef = ref<HTMLDivElement | null>(null);
let scrollY = 0;

onMounted(() => {
    const handleScroll = () => {
        scrollY = window.scrollY;
        if (containerRef.value) {
            // Parallax effect
            const offset = scrollY * 0.3;
            containerRef.value.style.transform = `translateY(${offset}px)`;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
});
</script>

<template>
    <div ref="containerRef" class="fixed inset-0 -z-10 pointer-events-none transition-transform duration-300 ease-out"
        :style="{ opacity: opacity }">
        <div v-if="variant === 'dots'" class="absolute inset-0 bg-dot-pattern animate-pattern-drift"></div>
        <div v-else class="absolute inset-0 bg-grid-pattern animate-pattern-drift"></div>
    </div>
</template>

<style scoped>
.bg-dot-pattern {
    background-image: radial-gradient(circle, rgba(124, 58, 237, 0.4) 1px, transparent 1px);
    background-size: 30px 30px;
}

.bg-grid-pattern {
    background-image:
        linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px);
    background-size: 40px 40px;
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
