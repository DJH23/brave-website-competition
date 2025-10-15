<script setup lang="ts">
interface Props {
    title?: string;
    variant?: "default" | "highlight";
    hoverable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: "default",
    hoverable: true,
});
</script>

<template>
    <article :class="[
        'rounded-xl p-6 border transition-all duration-300',
        variant === 'default'
            ? 'bg-neutral-900/60 border-neutral-800'
            : 'bg-gradient-to-br from-bravePurple/10 to-braveBlue/10 border-bravePurple/30',
        hoverable &&
        'hover:border-bravePurple/50 hover:shadow-glow-purple hover:-translate-y-1',
    ]">
        <h2 v-if="title" class="text-xl font-semibold mb-3">{{ title }}</h2>
        <div class="text-neutral-300">
            <slot />
        </div>
    </article>
</template>
