<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFloating, offset, flip, shift, arrow } from '@floating-ui/vue';
import BaseModal from './BaseModal.vue';
import { useFlowNodes, type FlowNode } from '../composables/useFlowNodes';

const router = useRouter();
const { nodes, getNode, getConnectedNodes } = useFlowNodes();

// Tooltip text for interactive nodes
const tooltips: Record<string, string> = {
    u2: 'Send a one-time BAT tip from the page contribution panel for immediate creator support.',
    u3: 'Enable monthly contributions; requires a custodial-connected Rewards account.',
    u4: 'Auto-distribute BAT based on attention (time spent) across sites and channels you visit.',
    c1: 'Register for Brave Creators to receive tips and show as verified to Rewards users.',
    c2: 'Complete domain or channel verification so supporters see the blue check and can tip confidently.',
    c3: 'Connect payout: custodial account (Uphold, Gemini, bitFlyer) or self-custody ETH/SOL address.',
    c4: 'Receive on-demand tips, recurring contributions, and auto-contributions once verified and connected.'
};

// Navigation mapping for node clicks
const navigationMap: Record<string, string> = {
    c1: '/wallet#creator-signup',
    c2: '/wallet#creator-verification',
    c3: '/wallet#creator-payout',
    c4: '/wallet#creator-earnings',
    u2: '/wallet#rewards',
    u3: '/wallet#rewards',
    u4: '/wallet#rewards'
};

const activeTooltip = ref<string | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });

const showTooltip = (id: string, event: MouseEvent) => {
    if (tooltips[id]) {
        activeTooltip.value = id;
        tooltipPosition.value = { x: event.clientX, y: event.clientY + 20 };
    }
};

const hideTooltip = () => {
    activeTooltip.value = null;
};

const handleNodeClick = (id: string) => {
    // New modal-based interaction
    const node = getNode(id);
    if (node) {
        openNodeModal(node);
        return;
    }

    // Fallback to old navigation
    const route = navigationMap[id];
    if (route) router.push(route);
};

// Modal state
const modalOpen = ref(false);
const selectedNode = ref<FlowNode | null>(null);

// Hover and active states for path highlighting
const hoveredNodeId = ref<string | null>(null);
const focusedNodeId = ref<string | null>(null);
const activePath = ref<Set<string>>(new Set());

// Compute active path based on hovered node
function computeActivePath(nodeId: string | null) {
    if (!nodeId) {
        activePath.value.clear();
        return;
    }

    const node = getNode(nodeId);
    if (!node) return;

    // Only include the hovered node itself, not connected nodes
    const pathNodes = new Set<string>([nodeId]);

    activePath.value = pathNodes;
}

function handleNodeHoverEnter(nodeId: string) {
    hoveredNodeId.value = nodeId;
    computeActivePath(nodeId);
}

function handleNodeHoverLeave() {
    hoveredNodeId.value = null;
    activePath.value.clear();
}

function openNodeModal(node: FlowNode) {
    console.log('Opening modal for node:', node.id, 'CTAs:', node.ctas);
    selectedNode.value = node;
    modalOpen.value = true;
}

function closeModal() {
    modalOpen.value = false;
    selectedNode.value = null;
}

// Check if a node or edge is active (part of hovered path)
function isNodeActive(nodeId: string): boolean {
    return activePath.value.has(nodeId);
}

// Keyboard navigation
function handleGlobalKeydown(event: KeyboardEvent) {
    if (modalOpen.value) return; // Let modal handle its own keys

    const currentNodeId = focusedNodeId.value;

    if (event.key === 'Enter' && currentNodeId) {
        event.preventDefault();
        const node = getNode(currentNodeId);
        if (node) openNodeModal(node);
        return;
    }

    if (!currentNodeId) return;

    const currentNode = getNode(currentNodeId);
    if (!currentNode || !currentNode.connectedTo) return;

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();

        const connectedNodes = getConnectedNodes(currentNodeId);
        if (connectedNodes.length === 0) return;

        // Find current index among connected nodes
        let nextNode: FlowNode | undefined;

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            nextNode = connectedNodes[0];
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            nextNode = connectedNodes[connectedNodes.length - 1];
        }

        if (nextNode) {
            focusedNodeId.value = nextNode.id;
            // Focus the DOM element
            const element = document.querySelector(`[data-node-id="${nextNode.id}"]`) as HTMLElement;
            element?.focus();
            computeActivePath(nextNode.id);
        }
    }
}

function handleNodeFocus(nodeId: string) {
    focusedNodeId.value = nodeId;
    computeActivePath(nodeId);
}

function handleNodeBlur() {
    focusedNodeId.value = null;
    activePath.value.clear();
}

// Overlay SVG + anchors
const wrap = ref<HTMLElement | null>(null);
const svg = ref<SVGSVGElement | null>(null);

// Container refs for cross-lane connectors
const setupContainer = ref<HTMLElement | null>(null);
const usersContainer = ref<HTMLElement | null>(null);
const creatorsContainer = ref<HTMLElement | null>(null);

// Node anchors
// Setup nodes
const n0 = ref<HTMLElement | null>(null);
const n1 = ref<HTMLElement | null>(null);
const n2 = ref<HTMLElement | null>(null);
const n3 = ref<HTMLElement | null>(null);

// Users lane nodes
const u1Card = ref<HTMLElement | null>(null);
const u2Card = ref<HTMLElement | null>(null);
const u3Card = ref<HTMLElement | null>(null);
const u4Card = ref<HTMLElement | null>(null);
const uRow = ref<HTMLElement | null>(null); // container for u2/u3/u4 (for layout only)
const u5 = ref<HTMLElement | null>(null);

// Creators lane nodes
const c1Card = ref<HTMLElement | null>(null);
const c2Card = ref<HTMLElement | null>(null);
const c3Card = ref<HTMLElement | null>(null);
const c4Card = ref<HTMLElement | null>(null);

// Container size for viewBox mapping
const boxWidth = ref(1200);
const boxHeight = ref(800);

// Brand colors from design system - using braveBlue consistently
const brandColors = ['#0EA5E9']; // braveBlue

// Stable color assignment per edge ID
function getEdgeColor(edgeId: string): string {
    // Always return braveBlue
    return '#0EA5E9';
}

// Map color hex to marker name
function getMarkerName(color: string): string {
    return 'blue';
}

// Stable color assignment per node ID (for hover glow effect)
function getNodeColor(nodeId: string): string {
    // Always return braveBlue
    return '#0EA5E9';
}

// Get RGB values from hex color for box-shadow
function hexToRgba(hex: string, alpha: number = 0.5): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Get dynamic box-shadow style for active node
function getNodeStyle(nodeId: string) {
    if (!isNodeActive(nodeId)) return {};
    const color = getNodeColor(nodeId);
    return {
        boxShadow: `0 0 16px ${hexToRgba(color, 0.5)}`
    };
}

type Edge = { id: string; d: string; color: string };
const edges = reactive<Edge[]>([]);

let ro: ResizeObserver | null = null;

function anchor(el: Element, box: DOMRect, side: 'bottom' | 'top' | 'left' | 'right') {
    const r = el.getBoundingClientRect();
    switch (side) {
        case 'bottom':
            return { x: r.left + r.width / 2 - box.left, y: r.bottom - box.top };
        case 'top':
            return { x: r.left + r.width / 2 - box.left, y: r.top - box.top };
        case 'left':
            return { x: r.left - box.left, y: r.top + r.height / 2 - box.top };
        case 'right':
            return { x: r.right - box.left, y: r.top + r.height / 2 - box.top };
    }
}

function quadPath(a: { x: number; y: number }, b: { x: number; y: number }, bend = 60) {
    const cx = (a.x + b.x) / 2; // control x halfway
    const cy = Math.min(a.y, b.y) + bend; // control y below the top to angle downward
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function straightPath(a: { x: number; y: number }, b: { x: number; y: number }) {
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

function layoutEdges() {
    if (!wrap.value) return;
    const box = wrap.value.getBoundingClientRect();
    boxWidth.value = Math.max(1, Math.round(box.width));
    boxHeight.value = Math.max(1, Math.round(box.height));

    const list: Edge[] = [];

    // Cross edges from bottom of Setup container to top of Users/Creators containers
    if (setupContainer.value && usersContainer.value) {
        const a = anchor(setupContainer.value, box, 'bottom');
        const b = anchor(usersContainer.value, box, 'top');
        if (a && b) list.push({ id: 'setup->users', d: quadPath(a, b, 60), color: getEdgeColor('setup->users') });
    }
    if (setupContainer.value && creatorsContainer.value) {
        const a = anchor(setupContainer.value, box, 'bottom');
        const b = anchor(creatorsContainer.value, box, 'top');
        if (a && b) list.push({ id: 'setup->creators', d: quadPath(a, b, 60), color: getEdgeColor('setup->creators') });
    }

    // Internal vertical edges: Setup
    if (n0.value && n1.value) {
        const a = anchor(n0.value, box, 'bottom');
        const b = anchor(n1.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n0-n1', d: quadPath(a, b, 40), color: getEdgeColor('setup-n0-n1') });
    }
    if (n1.value && n2.value) {
        const a = anchor(n1.value, box, 'bottom');
        const b = anchor(n2.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n1-n2', d: quadPath(a, b, 40), color: getEdgeColor('setup-n1-n2') });
    }
    if (n2.value && n3.value) {
        const a = anchor(n2.value, box, 'bottom');
        const b = anchor(n3.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n2-n3', d: quadPath(a, b, 40), color: getEdgeColor('setup-n2-n3') });
    }

    // Internal vertical edges: Users (connect grandchildren)
    // Straight lines from u1Card to the three cards below it
    if (u1Card.value && u2Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u2Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u2', d: straightPath(a, b), color: getEdgeColor('users-u1-u2') });
    }
    if (u1Card.value && u3Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u3Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u3', d: straightPath(a, b), color: getEdgeColor('users-u1-u3') });
    }
    if (u1Card.value && u4Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u4Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u4', d: straightPath(a, b), color: getEdgeColor('users-u1-u4') });
    }
    // Straight lines from the three cards to u5 (keep same x coordinate for straight down)
    if (u2Card.value && u5.value) {
        const a = anchor(u2Card.value, box, 'bottom');
        const u5Rect = u5.value.getBoundingClientRect();
        const b = { x: a.x, y: u5Rect.top - box.top }; // Same x as starting point
        list.push({ id: 'users-u2-u5', d: straightPath(a, b), color: getEdgeColor('users-u2-u5') });
    }
    if (u3Card.value && u5.value) {
        const a = anchor(u3Card.value, box, 'bottom');
        const u5Rect = u5.value.getBoundingClientRect();
        const b = { x: a.x, y: u5Rect.top - box.top }; // Same x as starting point
        list.push({ id: 'users-u3-u5', d: straightPath(a, b), color: getEdgeColor('users-u3-u5') });
    }
    if (u4Card.value && u5.value) {
        const a = anchor(u4Card.value, box, 'bottom');
        const u5Rect = u5.value.getBoundingClientRect();
        const b = { x: a.x, y: u5Rect.top - box.top }; // Same x as starting point
        list.push({ id: 'users-u4-u5', d: straightPath(a, b), color: getEdgeColor('users-u4-u5') });
    }

    // Internal vertical edges: Creators
    if (c1Card.value && c2Card.value) {
        const a = anchor(c1Card.value, box, 'bottom');
        const b = anchor(c2Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c1-c2', d: quadPath(a, b, 40), color: getEdgeColor('creators-c1-c2') });
    }
    if (c2Card.value && c3Card.value) {
        const a = anchor(c2Card.value, box, 'bottom');
        const b = anchor(c3Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c2-c3', d: quadPath(a, b, 40), color: getEdgeColor('creators-c2-c3') });
    }
    if (c3Card.value && c4Card.value) {
        const a = anchor(c3Card.value, box, 'bottom');
        const b = anchor(c4Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c3-c4', d: quadPath(a, b, 40), color: getEdgeColor('creators-c3-c4') });
    }

    edges.splice(0, edges.length, ...list);
}

onMounted(async () => {
    await nextTick();
    layoutEdges();
    ro = new ResizeObserver(() => layoutEdges());
    [
        wrap.value,
        setupContainer.value, usersContainer.value, creatorsContainer.value,
        n0.value, n1.value, n2.value, n3.value,
        u1Card.value, u2Card.value, u3Card.value, u4Card.value, uRow.value, u5.value,
        c1Card.value, c2Card.value, c3Card.value, c4Card.value,
    ].forEach((el) => el && ro!.observe(el));
    window.addEventListener('resize', layoutEdges);
    window.addEventListener('scroll', layoutEdges, { passive: true });
    window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', layoutEdges);
    window.removeEventListener('scroll', layoutEdges);
    window.removeEventListener('keydown', handleGlobalKeydown);
    ro?.disconnect();
});
</script>

<template>
    <div ref="wrap" class="relative w-full">
        <!-- Overlay SVG: draws connectors between HTML nodes -->
        <svg ref="svg" class="pointer-events-none absolute inset-0 w-full h-full z-20"
            :viewBox="`0 0 ${boxWidth} ${boxHeight}`" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
                <!-- Markers for each brand color -->
                <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="3"
                    orient="auto-start-reverse">
                    <path d="M0,0 L0,6 L9,3 z" fill="#7C3AED" />
                </marker>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3"
                    orient="auto-start-reverse">
                    <path d="M0,0 L0,6 L9,3 z" fill="#0EA5E9" />
                </marker>
                <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="9" refY="3"
                    orient="auto-start-reverse">
                    <path d="M0,0 L0,6 L9,3 z" fill="#FB542B" />
                </marker>
                <!-- Active state marker -->
                <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="9" refY="3"
                    orient="auto-start-reverse">
                    <path d="M0,0 L0,6 L9,3 z" fill="#ff6a00" />
                </marker>
            </defs>
            <path v-for="e in edges" :key="e.id" :d="e.d" :stroke="e.color" stroke-width="2.5"
                :class="{ 'edge-muted': hoveredNodeId }" fill="none"
                :marker-end="`url(#arrow-${getMarkerName(e.color)})`" />
        </svg>

        <!-- Content laid out with Flex/Grid so it reflows naturally -->
        <div
            class="w-full overflow-x-auto overflow-y-visible pb-4 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
            <div class="flex flex-col gap-24 lg:gap-26">
                <!-- Row 1: Setup centered -->
                <div class="w-full flex justify-center">
                    <div ref="setupContainer"
                        class="glass rounded-2xl p-6 flex flex-col items-center gap-4 w-[520px] h-[480px]">
                        <h3 class="text-white text-[20px] font-semibold flex items-center gap-2">
                            <i class="bi bi-gear-fill text-gradient-blue"></i>
                            Setup
                        </h3>
                        <div class="flex-1 flex flex-col gap-4 w-full justify-between">
                            <div ref="n0" data-node-id="n0" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 w-full text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('n0'), 'node-active': isNodeActive('n0') }]"
                                :style="getNodeStyle('n0')" @mouseenter="handleNodeHoverEnter('n0')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('n0')" @blur="handleNodeBlur"
                                @click="handleNodeClick('n0')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Set up Brave + BAT
                            </div>
                            <div ref="n1" data-node-id="n1" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 w-full text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('n1'), 'node-active': isNodeActive('n1') }]"
                                :style="getNodeStyle('n1')" @mouseenter="handleNodeHoverEnter('n1')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('n1')" @blur="handleNodeBlur"
                                @click="handleNodeClick('n1')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Enable Brave Rewards
                            </div>
                            <div ref="n2" data-node-id="n2" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 w-full text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('n2'), 'node-active': isNodeActive('n2') }]"
                                :style="getNodeStyle('n2')" @mouseenter="handleNodeHoverEnter('n2')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('n2')" @blur="handleNodeBlur"
                                @click="handleNodeClick('n2')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                <div>Choose payout: Custodial</div>
                                <div>or Self‑custody</div>
                            </div>
                            <div ref="n3" data-node-id="n3" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 w-full text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('n3'), 'node-active': isNodeActive('n3') }]"
                                :style="getNodeStyle('n3')" @mouseenter="handleNodeHoverEnter('n3')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('n3')" @blur="handleNodeBlur"
                                @click="handleNodeClick('n3')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Get BAT: Earn via ads or add funds
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Users and Creators adjacent -->
                <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 place-items-center">
                    <!-- Users lane -->
                    <div ref="usersContainer" class="glass rounded-2xl p-6 flex flex-col gap-4 w-[520px] h-[480px]">
                        <h3
                            class="text-white text-[20px] font-semibold text-center flex items-center justify-center gap-2">
                            <i class="bi bi-people-fill text-gradient-blue"></i>
                            Users
                        </h3>
                        <div class="flex-1 flex flex-col gap-4 justify-between">
                            <div ref="u1Card" data-node-id="u1" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('u1'), 'node-active': isNodeActive('u1') }]"
                                :style="getNodeStyle('u1')" @mouseenter="handleNodeHoverEnter('u1')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('u1')" @blur="handleNodeBlur"
                                @click="handleNodeClick('u1')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Find verified creators – blue check in URL bar
                            </div>
                            <div ref="uRow" class="flex gap-3">
                                <div ref="u2Card" data-node-id="u2" tabindex="0"
                                    :class="['glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('u2'), 'node-active': isNodeActive('u2') }]"
                                    :style="getNodeStyle('u2')" @mouseenter="handleNodeHoverEnter('u2')"
                                    @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('u2')"
                                    @blur="handleNodeBlur" @click="handleNodeClick('u2')">
                                    <i
                                        class="bi bi-info-circle-fill absolute top-1 right-1 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                    Tip on‑demand
                                </div>
                                <div ref="u3Card" data-node-id="u3" tabindex="0"
                                    :class="['glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('u3'), 'node-active': isNodeActive('u3') }]"
                                    :style="getNodeStyle('u3')" @mouseenter="handleNodeHoverEnter('u3')"
                                    @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('u3')"
                                    @blur="handleNodeBlur" @click="handleNodeClick('u3')">
                                    <i
                                        class="bi bi-info-circle-fill absolute top-1 right-1 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                    Set recurring tip
                                </div>
                                <div ref="u4Card" data-node-id="u4" tabindex="0"
                                    :class="['glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('u4'), 'node-active': isNodeActive('u4') }]"
                                    :style="getNodeStyle('u4')" @mouseenter="handleNodeHoverEnter('u4')"
                                    @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('u4')"
                                    @blur="handleNodeBlur" @click="handleNodeClick('u4')">
                                    <i
                                        class="bi bi-info-circle-fill absolute top-1 right-1 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                    Auto‑contribute
                                </div>
                            </div>
                            <div ref="u5" data-node-id="u5" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('u5'), 'node-active': isNodeActive('u5') }]"
                                :style="getNodeStyle('u5')" @mouseenter="handleNodeHoverEnter('u5')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('u5')" @blur="handleNodeBlur"
                                @click="handleNodeClick('u5')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Privacy‑preserving ads; no personal data leaves browser
                            </div>
                        </div>
                    </div>

                    <!-- Creators lane -->
                    <div ref="creatorsContainer" class="glass rounded-2xl p-6 flex flex-col gap-4 w-[520px] h-[480px]">
                        <h3
                            class="text-white text-[20px] font-semibold text-center flex items-center justify-center gap-2">
                            <i class="bi bi-palette-fill text-gradient-blue"></i>
                            Creators
                        </h3>
                        <div class="flex-1 flex flex-col gap-4 justify-between">
                            <div ref="c1Card" data-node-id="c1" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('c1'), 'node-active': isNodeActive('c1') }]"
                                :style="getNodeStyle('c1')" @mouseenter="handleNodeHoverEnter('c1')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('c1')" @blur="handleNodeBlur"
                                @click="handleNodeClick('c1')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Join Brave Creators
                            </div>
                            <div ref="c2Card" data-node-id="c2" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('c2'), 'node-active': isNodeActive('c2') }]"
                                :style="getNodeStyle('c2')" @mouseenter="handleNodeHoverEnter('c2')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('c2')" @blur="handleNodeBlur"
                                @click="handleNodeClick('c2')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Verify site/channel
                            </div>
                            <div ref="c3Card" data-node-id="c3" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('c3'), 'node-active': isNodeActive('c3') }]"
                                :style="getNodeStyle('c3')" @mouseenter="handleNodeHoverEnter('c3')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('c3')" @blur="handleNodeBlur"
                                @click="handleNodeClick('c3')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Connect payout: Uphold/Gemini/bitFlyer or ETH/SOL
                            </div>
                            <div ref="c4Card" data-node-id="c4" tabindex="0"
                                :class="['glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none transition-all duration-300 hover:scale-105 relative group', { 'node-muted': hoveredNodeId && !isNodeActive('c4'), 'node-active': isNodeActive('c4') }]"
                                :style="getNodeStyle('c4')" @mouseenter="handleNodeHoverEnter('c4')"
                                @mouseleave="handleNodeHoverLeave" @focus="handleNodeFocus('c4')" @blur="handleNodeBlur"
                                @click="handleNodeClick('c4')">
                                <i
                                    class="bi bi-info-circle-fill absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity"></i>
                                Receive BAT tips and contributions
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- BaseModal for node details -->
        <BaseModal v-if="selectedNode" :open="modalOpen" :title="selectedNode.whyMatters"
            :bullets="selectedNode.bullets" :ctas="selectedNode.ctas" @close="closeModal">
            <div class="flex items-center gap-3 mb-4">
                <i :class="['text-3xl', selectedNode.icon, 'text-gradient-blue']"></i>
                <h3 class="text-xl font-semibold text-white">{{ selectedNode.label }}</h3>
            </div>
            <p class="text-text-100 mb-4">{{ selectedNode.summary }}</p>
        </BaseModal>

        <!-- Floating tooltip (old system, keeping for backward compatibility) -->
        <Teleport to="body">
            <div v-if="activeTooltip"
                :style="{ position: 'fixed', left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px', zIndex: 9999 }"
                class="glass-strong rounded-lg p-3 max-w-xs shadow-lg pointer-events-none transform -translate-x-1/2">
                <p class="text-sm text-gray-200 leading-relaxed">{{ tooltips[activeTooltip] }}</p>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
/* Design system alignment */
svg {
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
}

/* Node states */
.node-muted {
    opacity: 0.35;
    filter: grayscale(0.5);
}

.node-active {
    transform: scale(1.02);
    transition: transform var(--dur-med) var(--ease-standard), box-shadow var(--dur-med) var(--ease-standard);
}

/* Edge states */
.edge-muted {
    opacity: 0.2;
    transition: opacity var(--dur-med) var(--ease-standard);
}

.edge-active {
    opacity: 1;
    filter: drop-shadow(0 0 6px rgba(14, 165, 233, 0.6));
}

/* Arrow animation - always active on all edges */
svg path[stroke] {
    stroke-dasharray: 8 4;
    animation: dash-flow 1.5s linear infinite;
}

@keyframes dash-flow {
    to {
        stroke-dashoffset: -12;
    }
}

/* Custom scrollbar for horizontal overflow */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(14, 165, 233, 0.3);
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(14, 165, 233, 0.5);
}

/* Custom scrollbar for horizontal overflow */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(14, 165, 233, 0.3);
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(14, 165, 233, 0.5);
}
</style>
