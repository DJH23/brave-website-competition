<script setup lang="ts">
import { ref } from "vue";
import Card from "./Card.vue";
import Button from "./Button.vue";

const demos = ref([
    {
        title: "Ad Blocker Visualization",
        description:
            "See in real-time how Brave Shields blocks trackers, ads, and fingerprinting attempts.",
        icon: "🛡️",
        stats: { blocked: "3.2M+", saved: "42min" },
    },
    {
        title: "Privacy Score Calculator",
        description:
            "Calculate your privacy score based on browser settings and extension usage.",
        icon: "📊",
        stats: { score: "94/100", level: "Expert" },
    },
    {
        title: "Tracker Inspector",
        description:
            "Interactive tool showing what data trackers collect and how to stop them.",
        icon: "🔍",
        stats: { trackers: "128", networks: "42" },
    },
]);

const showDemo = ref(false);
const activeBlockCount = ref(0);

const startDemo = () => {
    showDemo.value = true;
    // Simulate blocking activity
    const interval = setInterval(() => {
        activeBlockCount.value += Math.floor(Math.random() * 5) + 1;
        if (activeBlockCount.value > 50) {
            clearInterval(interval);
        }
    }, 100);
};
</script>

<template>
    <section class="py-12 px-6 bg-neutral-900/30">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-4xl font-bold mb-4 animate-fade-in">Privacy Demos</h2>
            <p class="text-neutral-300 mb-8">
                Interactive demonstrations of privacy-first web technologies and
                tracking protection.
            </p>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                <Card v-for="demo in demos" :key="demo.title" :title="demo.title" hoverable>
                    <div class="text-4xl mb-3">{{ demo.icon }}</div>
                    <p class="mb-4 text-sm">{{ demo.description }}</p>
                    <div class="flex gap-4 mb-4 text-sm">
                        <div v-for="(value, key) in demo.stats" :key="key" class="flex flex-col">
                            <span class="text-bravePurple font-semibold">{{ value }}</span>
                            <span class="text-neutral-500 capitalize">{{ key }}</span>
                        </div>
                    </div>
                    <Button size="sm" variant="secondary">Try Demo →</Button>
                </Card>
            </div>

            <!-- Live Demo Section -->
            <Card variant="highlight">
                <h3 class="text-2xl font-semibold mb-4">
                    Live Tracker Blocking Demo
                </h3>
                <p class="text-neutral-300 mb-6">
                    Watch as Brave Shields blocks trackers, ads, and fingerprinting in
                    real-time.
                </p>

                <div v-if="!showDemo" class="text-center py-8">
                    <Button variant="primary" @click="startDemo">
                        🚀 Start Live Demo
                    </Button>
                </div>

                <div v-else class="p-6 bg-neutral-950/50 rounded-lg border border-bravePurple/30">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <div class="text-4xl font-bold text-bravePurple">
                                {{ activeBlockCount }}
                            </div>
                            <div class="text-sm text-neutral-400">Trackers Blocked</div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-braveOrange">
                                ~{{ Math.floor(activeBlockCount * 0.8) }}ms
                            </div>
                            <div class="text-sm text-neutral-400">Time Saved</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between text-sm">
                            <span>Ad Trackers</span>
                            <span class="text-braveOrange">{{
                                Math.floor(activeBlockCount * 0.4)
                                }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span>Cross-site Trackers</span>
                            <span class="text-braveOrange">{{
                                Math.floor(activeBlockCount * 0.35)
                                }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span>Fingerprinting Attempts</span>
                            <span class="text-braveOrange">{{
                                Math.floor(activeBlockCount * 0.25)
                                }}</span>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-green-900/20 border border-green-700/30 rounded">
                        <p class="text-sm text-green-400">
                            ✅ Your privacy is protected. Brave blocked all tracking attempts.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    </section>
</template>
