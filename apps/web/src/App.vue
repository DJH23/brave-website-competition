<script setup lang="ts">
import Hero3D from './components/Hero3D.vue';
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="p-6">
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
                Privacy‑First Creator Hub
            </h1>
            <p class="text-sm text-neutral-300 mt-2">
                Vue 3 + Vite + TailwindCSS + Three.js • NestJS API
            </p>
        </header>
        <main class="flex-1">
            <Hero3D />
            <section class="p-6 grid gap-6 md:grid-cols-2">
                <article class="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
                    <h2 class="text-xl font-semibold mb-2">Portfolio</h2>
                    <p class="text-neutral-300">Showcase development projects and music.
                    </p>
                </article>
                <article class="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
                    <h2 class="text-xl font-semibold mb-2">Privacy Demos</h2>
                    <p class="text-neutral-300">Interactive demos of tracking protection concepts.</p>
                </article>
            </section>
        </main>
        <footer class="p-6 text-neutral-400 text-sm">
            <span>© 2025 • Brave-inspired gradient theme</span>
        </footer>
    </div>

</template>

<style scoped></style>
