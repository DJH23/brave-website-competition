<script setup lang="ts">
const props = withDefaults(defineProps<{
    title?: string;
    titleColorClass?: string;
    iconClass?: string;
}>(), {
    title: 'Ready to explore?',
    titleColorClass: 'text-gradient-blue',
    iconClass: 'text-braveBlue/80'
});
</script>

<template>
    <div class="max-w-7xl mx-auto mt-16 text-center space-y-6">
        <h3 class="text-2xl font-bold transition-all duration-700 opacity-100 translate-y-0" :class="titleColorClass">
            <i class="bi bi-search" :class="iconClass" aria-hidden="true"></i>
            {{ title }}
        </h3>
        <div class="flex flex-wrap gap-4 justify-center px-4">
            <slot />
        </div>
    </div>
</template>
