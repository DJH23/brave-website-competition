<script setup lang="ts">
import { computed } from 'vue';
import { useBATPrice } from '../composables/useBATPrice';

const { batPrice, isLoadingPrice, formatPrice, formatChange, changeColor } = useBATPrice();

const priceValue = computed(() => {
    return batPrice.value?.usd || 0;
});

const changeValue = computed(() => {
    return batPrice.value?.usd_24h_change || 0;
});

const isPositive = computed(() => changeValue.value >= 0);
</script>

<template>
    <div class="glass rounded-lg px-4 py-3 border border-neutral-800/50 hover:border-bravePurple/50 transition-all">
        <div class="flex items-center gap-3">
            <!-- BAT Icon -->
            <div class="flex-shrink-0">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-bravePurple to-braveOrange flex items-center justify-center font-bold text-white text-sm">
                    BAT
                </div>
            </div>

            <!-- Price Info -->
            <div class="flex-1 min-w-0">
                <div class="text-xs text-neutral-400 mb-0.5">Basic Attention Token</div>
                <div class="flex items-baseline gap-2">
                    <span v-if="isLoadingPrice" class="text-lg font-bold text-white animate-pulse">
                        Loading...
                    </span>
                    <template v-else>
                        <span class="text-lg font-bold text-white">
                            {{ formatPrice(priceValue) }}
                        </span>
                        <span class="text-xs font-medium" :class="changeColor(changeValue)">
                            <span v-if="isPositive">↗</span>
                            <span v-else>↘</span>
                            {{ formatChange(changeValue) }}
                        </span>
                    </template>
                </div>
            </div>

            <!-- 24h indicator -->
            <div class="flex-shrink-0 text-right">
                <div class="text-xs text-neutral-500">24h</div>
                <div class="text-xs font-semibold" :class="changeColor(changeValue)">
                    {{ isPositive ? '+' : '' }}{{ changeValue.toFixed(2) }}%
                </div>
            </div>
        </div>
    </div>
</template>
