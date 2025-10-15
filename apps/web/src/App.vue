<script setup lang="ts">
import Hero3D from "./components/Hero3D.vue";
import Button from "./components/Button.vue";
import Card from "./components/Card.vue";
import DarkModeToggle from "./components/DarkModeToggle.vue";
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="p-6 flex items-center justify-between animate-fade-in">
            <div>
                <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
                    Privacy‑First Creator Hub
                </h1>
                <p class="text-sm text-neutral-300 mt-2">
                    Vue 3 + Vite + TailwindCSS + Three.js • NestJS API
                </p>
            </div>
            <DarkModeToggle />
        </header>
        <main class="flex-1">
            <Hero3D />
            <section class="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                <Card title="Portfolio" variant="highlight">
                    <p>
                        Showcase development projects and music productions with BAT-powered
                        streaming and licensing.
                    </p>
                    <div class="mt-4">
                        <Button size="sm">View Projects</Button>
                    </div>
                </Card>
                <Card title="Privacy Demos">
                    <p>
                        Interactive demonstrations of tracking protection concepts and
                        privacy-first web technologies.
                    </p>
                    <div class="mt-4">
                        <Button size="sm" variant="secondary">Explore</Button>
                    </div>
                </Card>
                <Card title="BAT Integration">
                    <p>
                        Earn and tip with Basic Attention Token. Support creators directly
                        while maintaining your privacy.
                    </p>
                    <div class="mt-4">
                        <Button size="sm" variant="ghost">Learn More</Button>
                    </div>
                </Card>
            </section>
        </main>
        <footer class="p-6 text-neutral-400 text-sm border-t border-neutral-800/50 mt-12">
            <div class="flex items-center justify-between max-w-7xl mx-auto">
                <span>© 2025 • Brave Website Challenge</span>
                <div class="flex gap-4">
                    <a href="https://brave.com" target="_blank" rel="noopener"
                        class="hover:text-bravePurple transition-colors">
                        Brave Browser
                    </a>
                    <a href="https://basicattentiontoken.org" target="_blank" rel="noopener"
                        class="hover:text-braveOrange transition-colors">
                        BAT
                    </a>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped></style>
