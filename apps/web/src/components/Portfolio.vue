<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";

const projects = ref([
    {
        title: "Privacy-First Analytics",
        description:
            "Open-source web analytics that respects user privacy. No cookies, no tracking, just insights.",
        tags: ["TypeScript", "Vue 3", "Privacy"],
        link: "https://github.com",
    },
    {
        title: "Decentralized Music Platform",
        description:
            "Stream and license music using BAT. Artists receive 95% of earnings directly.",
        tags: ["Web3", "BAT", "Music"],
        link: "https://github.com",
    },
    {
        title: "Brave Extension Pack",
        description:
            "Collection of privacy-enhancing browser extensions for Brave and Chromium browsers.",
        tags: ["Extensions", "JavaScript", "Privacy"],
        link: "https://github.com",
    },
]);

const musicTracks = ref([
    {
        title: "Digital Frontier",
        genre: "Electronic / Ambient",
        duration: "4:32",
    },
    {
        title: "Encrypted Dreams",
        genre: "Synthwave",
        duration: "3:58",
    },
    {
        title: "Blockchain Blues",
        genre: "Experimental",
        duration: "5:12",
    },
]);
</script>

<template>
    <section class="py-12 px-6">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold mb-4 animate-fade-in">Portfolio</h2>
            <p class="text-neutral-300 mb-8">
                Showcasing development projects and music productions powered by
                privacy-first technologies.
            </p>

            <!-- Development Projects -->
            <div class="mb-12">
                <h3 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span class="text-bravePurple">💻</span> Development Projects
                </h3>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card v-for="project in projects" :key="project.title" :title="project.title">
                        <p class="mb-4">{{ project.description }}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span v-for="tag in project.tags" :key="tag"
                                class="px-2 py-1 text-xs bg-bravePurple/20 text-bravePurple rounded">
                                {{ tag }}
                            </span>
                        </div>
                        <Button size="sm" variant="secondary" @click="() => window.open(project.link, '_blank')">
                            View Project →
                        </Button>
                    </Card>
                </div>
            </div>

            <!-- Music Productions -->
            <div>
                <h3 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span class="text-braveOrange">🎵</span> Music Productions
                </h3>
                <Card variant="highlight">
                    <div class="space-y-4">
                        <div v-for="track in musicTracks" :key="track.title"
                            class="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg hover:bg-neutral-800/50 transition-colors">
                            <div>
                                <h4 class="font-medium">{{ track.title }}</h4>
                                <p class="text-sm text-neutral-400">{{ track.genre }}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-sm text-neutral-500">{{ track.duration }}</span>
                                <Button size="sm" variant="ghost">▶️ Play</Button>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-neutral-700">
                            <p class="text-sm text-neutral-400 mb-3">
                                Support with BAT and unlock premium tracks
                            </p>
                            <Button variant="primary">Connect Brave Wallet</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
</template>
