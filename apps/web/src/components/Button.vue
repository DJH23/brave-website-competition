<script setup lang="ts">
import { computed } from "vue";

interface Props {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "md",
    disabled: false,
});

const classes = computed(() => {
    const base =
        "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bravePurple disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-gradient-to-r from-bravePurple to-braveBlue text-white hover:shadow-glow-purple hover:scale-105 active:scale-95",
        secondary:
            "bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600",
        ghost:
            "text-neutral-300 hover:bg-neutral-800/50 hover:text-white",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return `${base} ${variants[props.variant]} ${sizes[props.size]}`;
});
</script>

<template>
    <button :class="classes" :disabled="disabled">
        <slot />
    </button>
</template>
