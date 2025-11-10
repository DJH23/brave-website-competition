<script setup lang="ts">
import { useCardTilt } from '../composables/useCardTilt';

const props = defineProps<{
    to: string;
    icon: string;
    title: string;
    description: string;
    colorClass: string;
    glowColor: string;
}>();

const { handleCardMouseMove, handleCardMouseLeave } = useCardTilt();
</script>

<template>
    <RouterLink :to="to" @mousemove="handleCardMouseMove" @mouseleave="handleCardMouseLeave"
        class="group relative glass rounded-2xl p-6 md:p-8 cursor-pointer feature-card flex flex-col w-full sm:w-[calc(50%-0.5rem)] md:w-[360px] lg:w-[400px] text-left"
        :style="{ '--glow-color': glowColor }">
        <!-- Gradient Overlay -->
        <div
            class="absolute inset-0 rounded-2xl bg-brave-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300">
        </div>
        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full">
            <i :class="['bi', icon, colorClass, 'text-4xl md:text-5xl mb-3']" aria-hidden="true"></i>
            <h4 class="text-xl md:text-2xl font-bold text-white mb-2">{{ title }}</h4>
            <p class="text-gray-300 text-sm md:text-base mb-4 flex-grow">{{ description }}</p>
            <div :class="[colorClass, 'flex items-center gap-2 font-semibold transition-all duration-300 mt-auto']">
                <span>Explore</span>
                <i class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-2"
                    aria-hidden="true"></i>
            </div>
        </div>
    </RouterLink>
</template>
