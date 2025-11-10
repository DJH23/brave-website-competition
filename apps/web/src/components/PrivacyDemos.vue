<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useIntersectionObserver } from "../composables/useIntersectionObserver";
import Card from "./Card.vue";
import Button from "./Button.vue";
import TrackerNetworkVisualization from "./TrackerNetworkVisualization.vue";
import PrivacyScoreCalculator from "./PrivacyScoreCalculator.vue";
import FingerprintingDemo from "./FingerprintingDemo.vue";

const demos = ref([
    {
        title: "Ad Blocker Visualization",
        description:
            "See in real-time how Brave Shields blocks trackers, ads, and fingerprinting attempts.",
        icon: "bi-shield-fill-check",
        stats: { blocked: "3.2M+", saved: "42min" },
        refName: "trackerNetworkRef"
    },
    {
        title: "Privacy Score Calculator",
        description:
            "Calculate your privacy score based on browser settings and extension usage.",
        icon: "bi-graph-up",
        stats: { score: "94/100", level: "Expert" },
        refName: "privacyScoreRef"
    },
    {
        title: "Tracker Inspector",
        description:
            "Interactive tool showing what data trackers collect and how to stop them.",
        icon: "bi-search",
        stats: { trackers: "128", networks: "42" },
        refName: "fingerprintingRef"
    },
]);

const showDemo = ref(false);
const activeBlockCount = ref(0);

const trackerNetworkRef = ref<HTMLElement | null>(null);
const privacyScoreRef = ref<HTMLElement | null>(null);
const fingerprintingRef = ref<HTMLElement | null>(null);

// Reveal on scroll
const privacyDemosHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: privacyDemosVisible } = useIntersectionObserver(privacyDemosHeadingRef, { threshold: 0.1, once: true });

const liveDemoHeadingRef = ref<HTMLElement | null>(null);
const { hasBeenVisible: liveDemoVisible } = useIntersectionObserver(liveDemoHeadingRef, { threshold: 0.1, once: true });

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

const scrollToDemo = async (refName: string) => {
    await nextTick();
    let el: HTMLElement | null = null;
    if (refName === "trackerNetworkRef") el = trackerNetworkRef.value;
    if (refName === "privacyScoreRef") el = privacyScoreRef.value;
    if (refName === "fingerprintingRef") el = fingerprintingRef.value;
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};
</script>

<template>
    <section class="py-12 px-6" aria-labelledby="privacy-demos-heading">
        <div class="max-w-7xl mx-auto">
            <h2 id="privacy-demos-heading" ref="privacyDemosHeadingRef"
                class="text-4xl font-bold mb-4 transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !privacyDemosVisible, 'opacity-100 translate-y-0': privacyDemosVisible }">
                Privacy Demos
            </h2>
            <p class="text-neutral-300 mb-8">
                Interactive demonstrations of privacy-first web technologies and
                tracking protection.
            </p>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12" role="list" aria-label="Privacy demo cards">
                <Card v-for="demo in demos" :key="demo.title" :title="demo.title" hoverable role="listitem">
                    <i :class="demo.icon" class="text-4xl text-bravePurple mb-3" aria-hidden="true"></i>
                    <p class="mb-4 text-sm">{{ demo.description }}</p>
                    <div class="flex gap-4 mb-4 text-sm" role="list" aria-label="Demo statistics">
                        <div v-for="(value, key) in demo.stats" :key="key" class="flex flex-col" role="listitem">
                            <span class="text-bravePurple font-semibold" :aria-label="`${key}: ${value}`">{{ value
                            }}</span>
                            <span class="text-neutral-500 capitalize" aria-hidden="true">{{ key }}</span>
                        </div>
                    </div>
                    <Button size="sm" variant="secondary" :aria-label="`Try ${demo.title} demo`"
                        @click="scrollToDemo(demo.refName)">Try Demo →</Button>
                </Card>
            </div>

            <!-- Live Demo Section -->
            <Card variant="highlight" aria-labelledby="live-demo-heading">
                <h3 id="live-demo-heading" ref="liveDemoHeadingRef"
                    class="text-2xl font-semibold mb-4 transition-all duration-700"
                    :class="{ 'opacity-0 translate-y-8': !liveDemoVisible, 'opacity-100 translate-y-0': liveDemoVisible }">
                    Live Tracker Blocking Demo
                </h3>
                <p class="text-neutral-300 mb-6">
                    Watch as Brave Shields blocks trackers, ads, and fingerprinting in
                    real-time.
                </p>

                <div v-if="!showDemo" class="text-center py-8">
                    <Button variant="primary" @click="startDemo" aria-label="Start live tracker blocking demonstration">
                        <i class="bi-rocket-takeoff" aria-hidden="true"></i> Start Live Demo
                    </Button>
                </div>

                <div v-else class="p-6 glass rounded-lg border border-bravePurple/30" role="region" aria-live="polite"
                    aria-atomic="true">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <div class="text-4xl font-bold text-bravePurple" aria-label="Trackers blocked count">
                                {{ activeBlockCount }}
                            </div>
                            <div class="text-sm text-neutral-400">Trackers Blocked</div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-braveOrange"
                                :aria-label="`${Math.floor(activeBlockCount * 0.8)} milliseconds saved`">
                                ~{{ Math.floor(activeBlockCount * 0.8) }}ms
                            </div>
                            <div class="text-sm text-neutral-400">Time Saved</div>
                        </div>
                    </div>

                    <div class="space-y-2" role="list" aria-label="Breakdown of blocked trackers">
                        <div class="flex items-center justify-between text-sm" role="listitem">
                            <span>Ad Trackers</span>
                            <span class="text-braveOrange">{{ Math.floor(activeBlockCount * 0.4) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm" role="listitem">
                            <span>Cross-site Trackers</span>
                            <span class="text-braveOrange">{{ Math.floor(activeBlockCount * 0.35) }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm" role="listitem">
                            <span>Fingerprinting Attempts</span>
                            <span class="text-braveOrange">{{ Math.floor(activeBlockCount * 0.25) }}</span>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-green-900/20 border border-green-700/30 rounded" role="status"
                        aria-live="polite">
                        <p class="text-sm text-green-600">
                            <i class="bi-check-circle" aria-hidden="true"></i> Your privacy is protected. Brave
                            blocked all tracking
                            attempts.
                        </p>
                    </div>
                </div>
            </Card>

            <!-- New Privacy Visualization Components -->
            <div class="space-y-8 mt-12">
                <div ref="trackerNetworkRef">
                    <TrackerNetworkVisualization />
                </div>
                <div ref="privacyScoreRef">
                    <PrivacyScoreCalculator />
                </div>
                <div ref="fingerprintingRef">
                    <FingerprintingDemo />
                </div>
            </div>
        </div>
    </section>
</template>
