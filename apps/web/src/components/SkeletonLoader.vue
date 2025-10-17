<script setup lang="ts">
defineProps<{
    type?: 'text' | 'card' | 'avatar' | 'rect' | 'waveform';
    width?: string;
    height?: string;
    rows?: number;
}>();
</script>

<template>
    <div class="skeleton-loader" :class="`skeleton-${type || 'rect'}`">
        <!-- Text Skeleton -->
        <div v-if="type === 'text'" class="space-y-2">
            <div v-for="i in (rows || 3)" :key="i" class="skeleton-shimmer rounded" :style="{
                width: i === rows ? '60%' : '100%',
                height: height || '1rem'
            }">
            </div>
        </div>

        <!-- Card Skeleton -->
        <div v-else-if="type === 'card'" class="space-y-3">
            <div class="skeleton-shimmer rounded-lg" :style="{ height: '200px' }"></div>
            <div class="skeleton-shimmer rounded" style="width: 80%; height: 1.5rem;"></div>
            <div class="skeleton-shimmer rounded" style="width: 100%; height: 1rem;"></div>
            <div class="skeleton-shimmer rounded" style="width: 90%; height: 1rem;"></div>
        </div>

        <!-- Avatar Skeleton -->
        <div v-else-if="type === 'avatar'" class="skeleton-shimmer rounded-full" :style="{
            width: width || '48px',
            height: height || '48px'
        }">
        </div>

        <!-- Waveform Skeleton -->
        <div v-else-if="type === 'waveform'" class="flex items-center gap-3">
            <div class="skeleton-shimmer rounded" style="width: 48px; height: 48px;"></div>
            <div class="skeleton-shimmer rounded flex-1" style="height: 80px;"></div>
            <div class="skeleton-shimmer rounded" style="width: 100px; height: 36px;"></div>
        </div>

        <!-- Default Rectangle Skeleton -->
        <div v-else class="skeleton-shimmer rounded" :style="{
            width: width || '100%',
            height: height || '100px'
        }">
        </div>
    </div>
</template>

<style scoped>
.skeleton-shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>
