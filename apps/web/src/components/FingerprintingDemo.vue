<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from './Card.vue'

interface FingerprintData {
    category: string
    icon: string
    description: string
    normalValue: string
    braveValue: string
    protectionLevel: 'high' | 'medium' | 'low'
}

const showComparison = ref(false)
const selectedItem = ref<FingerprintData | null>(null)

const fingerprintData: FingerprintData[] = [
    {
        category: 'Canvas Fingerprinting',
        icon: 'bi-palette-fill',
        description: 'Trackers render hidden images to identify your GPU and create a unique signature',
        normalValue: 'SHA256: a8f5f167f44f4964e6c998dee827110c',
        braveValue: 'Randomized per session',
        protectionLevel: 'high'
    },
    {
        category: 'WebGL Fingerprinting',
        icon: 'bi-controller',
        description: 'Graphics hardware information used to track you across websites',
        normalValue: 'NVIDIA GeForce RTX 3080 (Exact specs exposed)',
        braveValue: 'Generic renderer reported',
        protectionLevel: 'high'
    },
    {
        category: 'Font Detection',
        icon: 'bi-fonts',
        description: 'List of installed fonts can uniquely identify your device',
        normalValue: '342 unique fonts detected',
        braveValue: 'Standard font list only',
        protectionLevel: 'medium'
    },
    {
        category: 'Audio Context',
        icon: 'bi-volume-up-fill',
        description: 'Audio hardware fingerprinting via signal processing',
        normalValue: 'Unique audio signature: 124.04345722',
        braveValue: 'Noise added to output',
        protectionLevel: 'high'
    },
    {
        category: 'Screen Resolution',
        icon: 'bi-display',
        description: 'Exact screen dimensions used for tracking',
        normalValue: '1920x1080 @ 144Hz, 24" diagonal',
        braveValue: 'Rounded to common sizes',
        protectionLevel: 'medium'
    },
    {
        category: 'Browser Plugins',
        icon: 'bi-plugin',
        description: 'List of installed plugins creates unique profile',
        normalValue: 'PDF Viewer, Flash, Silverlight (8 plugins)',
        braveValue: 'No plugin enumeration',
        protectionLevel: 'high'
    },
    {
        category: 'Timezone & Language',
        icon: 'bi-globe',
        description: 'Location data derived from system settings',
        normalValue: 'EST (UTC-5), en-US, locale: en-US-POSIX',
        braveValue: 'Timezone preserved, precise locale hidden',
        protectionLevel: 'low'
    },
    {
        category: 'Hardware Concurrency',
        icon: 'bi-cpu-fill',
        description: 'CPU core count used for device identification',
        normalValue: '16 cores (Exact count)',
        braveValue: '8 cores (Randomized)',
        protectionLevel: 'medium'
    },
    {
        category: 'WebRTC IP Leak',
        icon: 'bi-broadcast',
        description: 'Real IP address leaked even when using VPN',
        normalValue: 'Local IP: 192.168.1.42 exposed',
        braveValue: 'Protected (no leak)',
        protectionLevel: 'high'
    }
]

const protectionStats = computed(() => {
    const high = fingerprintData.filter(d => d.protectionLevel === 'high').length
    const medium = fingerprintData.filter(d => d.protectionLevel === 'medium').length
    const low = fingerprintData.filter(d => d.protectionLevel === 'low').length
    const total = fingerprintData.length
    const score = Math.round(((high * 1 + medium * 0.5 + low * 0.2) / total) * 100)

    return { high, medium, low, total, score }
})

const getProtectionColor = (level: string) => {
    switch (level) {
        case 'high': return 'text-green-400'
        case 'medium': return 'text-yellow-400'
        case 'low': return 'text-orange-400'
        default: return 'text-neutral-400'
    }
}

const getProtectionBg = (level: string) => {
    switch (level) {
        case 'high': return 'bg-green-900/30 border-green-700/50'
        case 'medium': return 'bg-yellow-900/30 border-yellow-700/50'
        case 'low': return 'bg-orange-900/30 border-orange-700/50'
        default: return 'bg-neutral-900/30 border-neutral-700/50'
    }
}

const showDetail = (item: FingerprintData) => {
    selectedItem.value = item
}

const closeDetail = () => {
    selectedItem.value = null
}
</script>

<template>
    <Card variant="highlight">
        <div class="mb-6">
            <h3 class="text-2xl font-bold mb-2 text-gradient-orange">
                👤 Fingerprinting Protection Demo
            </h3>
            <p class="text-neutral-300 text-sm">
                See how Brave protects you from advanced browser fingerprinting techniques
            </p>
        </div>

        <!-- Overall Protection Score -->
        <div class="glass-strong rounded-lg p-6 mb-6 text-center">
            <div class="text-5xl font-bold text-green-400 mb-2">
                {{ protectionStats.score }}%
            </div>
            <div class="text-lg font-semibold mb-4">Fingerprinting Protection</div>
            <div class="flex justify-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>{{ protectionStats.high }} High</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>{{ protectionStats.medium }} Medium</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>{{ protectionStats.low }} Low</span>
                </div>
            </div>
        </div>

        <!-- Toggle Button -->
        <div class="flex justify-center mb-6">
            <button @click="showComparison = !showComparison" class="px-6 py-3 rounded-lg font-medium transition-all"
                :class="showComparison
                    ? 'bg-green-600 hover:bg-green-700 neon-glow'
                    : 'bg-bravePurple hover:bg-purple-700'">
                {{ showComparison ? '🛡️ Brave Protection ON' : '⚠️ Show Without Protection' }}
            </button>
        </div>

        <!-- Fingerprinting Techniques Grid -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="item in fingerprintData" :key="item.category" @click="showDetail(item)"
                class="glass rounded-lg p-4 cursor-pointer hover:scale-105 transition-all border-2"
                :class="getProtectionBg(item.protectionLevel)">
                <div class="flex items-start gap-3 mb-3">
                    <i :class="item.icon" class="text-2xl text-bravePurple"></i>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm mb-1">{{ item.category }}</h4>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-medium" :class="getProtectionColor(item.protectionLevel)">
                                {{ item.protectionLevel.toUpperCase() }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="showComparison" class="space-y-2 text-xs">
                    <div class="p-2 bg-red-900/20 border border-red-700/30 rounded">
                        <div class="text-red-400 font-medium mb-1">❌ Without Brave:</div>
                        <div class="text-neutral-300 truncate">{{ item.normalValue }}</div>
                    </div>
                    <div class="p-2 bg-green-900/20 border border-green-700/30 rounded">
                        <div class="text-green-400 font-medium mb-1">✅ With Brave:</div>
                        <div class="text-neutral-300 truncate">{{ item.braveValue }}</div>
                    </div>
                </div>
                <div v-else class="text-xs text-neutral-400">
                    Click to see protection details
                </div>
            </div>
        </div>

        <!-- Info Box -->
        <div class="glass-strong rounded-lg p-6 mt-6 border-2 border-bravePurple/30">
            <h4 class="font-semibold mb-2 text-bravePurple"><i class="bi-lock-fill"></i> What is Browser Fingerprinting?
            </h4>
            <p class="text-sm text-neutral-300 mb-3">
                Browser fingerprinting is a tracking technique that collects information about your browser
                configuration and device to create a unique "fingerprint." This fingerprint can track you
                across websites even without cookies.
            </p>
            <p class="text-sm text-neutral-300">
                <strong class="text-braveOrange">Brave's Protection:</strong> Brave randomizes and blocks
                fingerprinting attempts, making your browser blend in with millions of others. This breaks
                the tracking chain while maintaining website functionality.
            </p>
        </div>

        <!-- Detail Modal -->
        <Teleport to="body">
            <div v-if="selectedItem" @click="closeDetail"
                class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div @click.stop
                    class="glass-strong rounded-xl p-6 max-w-2xl w-full border-2 border-bravePurple/50 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-4xl">{{ selectedItem.icon }}</div>
                            <div>
                                <h3 class="text-xl font-bold">{{ selectedItem.category }}</h3>
                                <span class="text-sm font-medium"
                                    :class="getProtectionColor(selectedItem.protectionLevel)">
                                    {{ selectedItem.protectionLevel.toUpperCase() }} PROTECTION
                                </span>
                            </div>
                        </div>
                        <button @click="closeDetail"
                            class="text-2xl text-neutral-400 hover:text-white transition-colors">
                            ×
                        </button>
                    </div>

                    <p class="text-neutral-300 mb-6">{{ selectedItem.description }}</p>

                    <div class="space-y-4">
                        <div class="p-4 bg-red-900/20 border-2 border-red-700/50 rounded-lg">
                            <div class="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                <span>❌</span> Without Brave Protection
                            </div>
                            <div class="text-neutral-200 font-mono text-sm break-all">
                                {{ selectedItem.normalValue }}
                            </div>
                        </div>

                        <div class="p-4 bg-green-900/20 border-2 border-green-700/50 rounded-lg">
                            <div class="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                <span>✅</span> With Brave Protection
                            </div>
                            <div class="text-neutral-200 font-mono text-sm break-all">
                                {{ selectedItem.braveValue }}
                            </div>
                        </div>
                    </div>

                    <button @click="closeDetail"
                        class="w-full mt-6 px-4 py-3 rounded-lg bg-bravePurple hover:bg-purple-700 transition-all font-medium">
                        Close
                    </button>
                </div>
            </div>
        </Teleport>
    </Card>
</template>
