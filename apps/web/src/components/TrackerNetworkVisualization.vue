<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'
import Card from './Card.vue'
import { defineConfigs } from 'v-network-graph'
import 'v-network-graph/lib/style.css'
// Lightweight radial layout without d3-force to avoid typings/runtime issues

// Network data structure
type NodeId = string
type EdgeId = string

interface Node {
    name: string
    color: string
    size: number
    type: 'website' | 'tracker' | 'blocked'
}

interface Edge {
    source: NodeId
    target: NodeId
    color: string
    type: 'attempt' | 'blocked' | 'allowed'
}

const nodes = reactive<Record<NodeId, Node>>({
    website: { name: 'Your Website', color: '#a855f7', size: 30, type: 'website' },
})

const edges = reactive<Record<EdgeId, Edge>>({})

const stats = ref({
    blocked: 0,
    attempted: 0,
    allowed: 1 // website itself
})

// Mock tracker data
const trackerPool = [
    { id: 'ga', name: 'Google Analytics', color: '#ef4444', category: 'Analytics' },
    { id: 'fb', name: 'Facebook Pixel', color: '#3b82f6', category: 'Social' },
    { id: 'dc', name: 'DoubleClick', color: '#f59e0b', category: 'Advertising' },
    { id: 'am', name: 'Amazon Ads', color: '#f59e0b', category: 'Advertising' },
    { id: 'tw', name: 'Twitter Widget', color: '#3b82f6', category: 'Social' },
    { id: 'ms', name: 'Microsoft Clarity', color: '#ef4444', category: 'Analytics' },
    { id: 'co', name: 'Comscore', color: '#ef4444', category: 'Analytics' },
    { id: 'tb', name: 'Taboola', color: '#f59e0b', category: 'Advertising' },
    { id: 'ou', name: 'Outbrain', color: '#f59e0b', category: 'Advertising' },
    { id: 'li', name: 'LinkedIn Insight', color: '#3b82f6', category: 'Social' }
]

let animationInterval: number | null = null
let trackerIndex = 0

// Reveal on scroll
const trackerHeadingRef = ref<HTMLElement | null>(null)
const { hasBeenVisible: trackerHeadingVisible } = useIntersectionObserver(trackerHeadingRef, { threshold: 0.1, once: true })

const layouts = ref({
    nodes: Object.fromEntries(Object.keys(nodes).map(id => [id, { x: 0, y: 0 }]))
})

// v-network-graph configuration (using helper to keep defaults)
const configs = reactive(defineConfigs({
    view: { panEnabled: true, zoomEnabled: true }
}))

// Simple radial layout around the website node (no force engine)
const initLayout = () => {
    const ids = Object.keys(nodes)
    const others = ids.filter(id => id !== 'website')
    const radius = 150
    const center = { x: 0, y: 0 }
    layouts.value.nodes['website'] = { x: center.x, y: center.y }
    others.forEach((id, idx) => {
        const angle = (idx / others.length) * Math.PI * 2
        layouts.value.nodes[id] = {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        }
    })
}

// Simulate tracker blocking activity
const addTracker = () => {
    if (trackerIndex >= trackerPool.length) {
        trackerIndex = 0
    }

    const tracker = trackerPool[trackerIndex]
    const isBlocked = Math.random() > 0.2 // 80% blocked

    // Add tracker node
    const id = tracker.id + Date.now()
    nodes[id] = {
        name: tracker.name,
        color: isBlocked ? '#10b981' : tracker.color,
        size: isBlocked ? 15 : 20,
        type: isBlocked ? 'blocked' : 'tracker'
    }
    edges['e_' + id] = {
        source: 'website',
        target: id,
        color: isBlocked ? '#10b981' : '#ef4444',
        type: isBlocked ? 'blocked' : 'attempt'
    }
    // Update layout positions
    initLayout()

    // Update stats
    stats.value.attempted++
    if (isBlocked) {
        stats.value.blocked++
    } else {
        stats.value.allowed++
    }

    trackerIndex++

    // Remove old trackers to keep visualization clean
    const currentNodeCount = Object.keys(nodes).length
    if (currentNodeCount > 15) {
        const removableIds = Object.keys(nodes).filter(id => id !== 'website')
        const removeId = removableIds[0]
        delete nodes[removeId]
        Object.keys(edges).forEach(eid => {
            if (edges[eid].target === removeId) delete edges[eid]
        })
        delete layouts.value.nodes[removeId]
        initLayout()
    }
}

const startSimulation = () => {
    if (animationInterval) return

    // Add trackers periodically
    animationInterval = window.setInterval(() => {
        addTracker()
    }, 1500)

    // Add initial burst
    for (let i = 0; i < 5; i++) {
        setTimeout(() => addTracker(), i * 300)
    }
}

const stopSimulation = () => {
    if (animationInterval) {
        clearInterval(animationInterval)
        animationInterval = null
    }
}

const resetSimulation = () => {
    stopSimulation()
    // Clear all nodes except website
    Object.keys(nodes).forEach(id => { if (id !== 'website') delete nodes[id] })
    // Clear edges
    Object.keys(edges).forEach(eid => delete edges[eid])
    // Reset layouts
    layouts.value = { nodes: { website: { x: 0, y: 0 } } }
    // Reset stats and tracker state
    stats.value = { blocked: 0, attempted: 0, allowed: 1 }
    trackerIndex = 0
    initLayout()
}

onMounted(() => {
    // Auto-start after a brief delay
    setTimeout(() => { initLayout(); startSimulation() }, 500)
})

onUnmounted(() => {
    stopSimulation()
    // no-op
})
</script>

<template>
    <Card variant="highlight" class="overflow-hidden">
        <div class="mb-6">
            <h3 ref="trackerHeadingRef"
                class="text-2xl font-bold mb-2 text-gradient-rainbow transition-all duration-700"
                :class="{ 'opacity-0 translate-y-8': !trackerHeadingVisible, 'opacity-100 translate-y-0': trackerHeadingVisible }">
                <i class="bi bi-diagram-3" aria-hidden="true"></i> Real-Time Tracker Network
            </h3>
            <p class="text-neutral-300 text-sm">
                Watch as Brave Shields blocks trackers attempting to connect to your current browsing session
            </p>
        </div>

        <!-- Stats Dashboard -->
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="glass p-4 rounded-lg text-center">
                <div class="text-3xl font-bold text-green-600">{{ stats.blocked }}</div>
                <div class="text-xs text-neutral-400 mt-1">Blocked</div>
            </div>
            <div class="glass p-4 rounded-lg text-center">
                <div class="text-3xl font-bold text-red-600">{{ stats.attempted }}</div>
                <div class="text-xs text-neutral-400 mt-1">Attempted</div>
            </div>
            <div class="glass p-4 rounded-lg text-center">
                <div class="text-3xl font-bold text-bravePurple">
                    {{ Math.round((stats.blocked / Math.max(stats.attempted, 1)) * 100) }}%
                </div>
                <div class="text-xs text-neutral-400 mt-1">Block Rate</div>
            </div>
        </div>

        <!-- Network Visualization -->
        <div class="glass-strong rounded-lg p-4 mb-6 min-h-[400px] flex items-center justify-center">
            <v-network-graph :nodes="nodes" :edges="edges" :layouts="layouts" :configs="configs"
                class="w-full h-[400px]">
                <template #node="{ nodeId }">
                    <circle v-if="nodes[nodeId]" :r="Math.max(6, nodes[nodeId]?.size || 10)"
                        :fill="nodes[nodeId]?.color || '#a855f7'" />
                </template>
                <template #edge-label="{ edgeId }">
                    <span class="text-xs text-neutral-400"></span>
                </template>
            </v-network-graph>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 mb-6 text-sm">
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-bravePurple"></div>
                <span class="text-neutral-300">Your Website</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-green-500"></div>
                <span class="text-neutral-300">Blocked Tracker</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-red-500"></div>
                <span class="text-neutral-300">Attempted Connection</span>
            </div>
        </div>

        <!-- Controls -->
        <div class="flex gap-3">
            <button @click="startSimulation" :disabled="!!animationInterval"
                class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium">
                <i class="bi bi-play-fill" aria-hidden="true"></i> Start
            </button>
            <button @click="stopSimulation" :disabled="!animationInterval"
                class="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium">
                <i class="bi bi-pause-fill" aria-hidden="true"></i> Pause
            </button>
            <button @click="resetSimulation"
                class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-sm font-medium">
                <i class="bi bi-arrow-repeat" aria-hidden="true"></i> Reset
            </button>
        </div>
    </Card>
</template>

<style scoped>
.v-ng-root {
    width: 100%;
    height: 100%;
}
</style>
