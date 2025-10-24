<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    const route = navigationMap[id];
    if (route) router.push(route);
};

// Overlay SVG + anchors
const wrap = ref<HTMLElement | null>(null);
const svg = ref<SVGSVGElement | null>(null);

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

type Edge = { id: string; d: string };
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

function layoutEdges() {
    if (!wrap.value) return;
    const box = wrap.value.getBoundingClientRect();
    boxWidth.value = Math.max(1, Math.round(box.width));
    boxHeight.value = Math.max(1, Math.round(box.height));

    const list: Edge[] = [];

    // Cross edges from last setup to first users/creators
    if (n3.value && u1Card.value) {
        const a = anchor(n3.value, box, 'bottom');
        const b = anchor(u1Card.value, box, 'top');
        if (a && b) list.push({ id: 'setup->users', d: quadPath(a, b, 60) });
    }
    if (n3.value && c1Card.value) {
        const a = anchor(n3.value, box, 'bottom');
        const b = anchor(c1Card.value, box, 'top');
        if (a && b) list.push({ id: 'setup->creators', d: quadPath(a, b, 60) });
    }

    // Internal vertical edges: Setup
    if (n0.value && n1.value) {
        const a = anchor(n0.value, box, 'bottom');
        const b = anchor(n1.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n0-n1', d: quadPath(a, b, 40) });
    }
    if (n1.value && n2.value) {
        const a = anchor(n1.value, box, 'bottom');
        const b = anchor(n2.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n1-n2', d: quadPath(a, b, 40) });
    }
    if (n2.value && n3.value) {
        const a = anchor(n2.value, box, 'bottom');
        const b = anchor(n3.value, box, 'top');
        if (a && b) list.push({ id: 'setup-n2-n3', d: quadPath(a, b, 40) });
    }

    // Internal vertical edges: Users (connect grandchildren)
    if (u1Card.value && u2Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u2Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u2', d: quadPath(a, b, 30) });
    }
    if (u1Card.value && u3Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u3Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u3', d: quadPath(a, b, 30) });
    }
    if (u1Card.value && u4Card.value) {
        const a = anchor(u1Card.value, box, 'bottom');
        const b = anchor(u4Card.value, box, 'top');
        if (a && b) list.push({ id: 'users-u1-u4', d: quadPath(a, b, 30) });
    }
    if (u2Card.value && u5.value) {
        const a = anchor(u2Card.value, box, 'bottom');
        const b = anchor(u5.value, box, 'top');
        if (a && b) list.push({ id: 'users-u2-u5', d: quadPath(a, b, 30) });
    }
    if (u3Card.value && u5.value) {
        const a = anchor(u3Card.value, box, 'bottom');
        const b = anchor(u5.value, box, 'top');
        if (a && b) list.push({ id: 'users-u3-u5', d: quadPath(a, b, 30) });
    }
    if (u4Card.value && u5.value) {
        const a = anchor(u4Card.value, box, 'bottom');
        const b = anchor(u5.value, box, 'top');
        if (a && b) list.push({ id: 'users-u4-u5', d: quadPath(a, b, 30) });
    }

    // Internal vertical edges: Creators
    if (c1Card.value && c2Card.value) {
        const a = anchor(c1Card.value, box, 'bottom');
        const b = anchor(c2Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c1-c2', d: quadPath(a, b, 40) });
    }
    if (c2Card.value && c3Card.value) {
        const a = anchor(c2Card.value, box, 'bottom');
        const b = anchor(c3Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c2-c3', d: quadPath(a, b, 40) });
    }
    if (c3Card.value && c4Card.value) {
        const a = anchor(c3Card.value, box, 'bottom');
        const b = anchor(c4Card.value, box, 'top');
        if (a && b) list.push({ id: 'creators-c3-c4', d: quadPath(a, b, 40) });
    }

    edges.splice(0, edges.length, ...list);
}

onMounted(async () => {
    await nextTick();
    layoutEdges();
    ro = new ResizeObserver(() => layoutEdges());
    [
        wrap.value,
        n0.value, n1.value, n2.value, n3.value,
        u1Card.value, u2Card.value, u3Card.value, u4Card.value, uRow.value, u5.value,
        c1Card.value, c2Card.value, c3Card.value, c4Card.value,
    ].forEach((el) => el && ro!.observe(el));
    window.addEventListener('resize', layoutEdges);
    window.addEventListener('scroll', layoutEdges, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', layoutEdges);
    window.removeEventListener('scroll', layoutEdges);
    ro?.disconnect();
});
</script>

<template>
    <div ref="wrap" class="relative w-full">
        <!-- Overlay SVG: draws connectors between HTML nodes -->
        <svg ref="svg" class="pointer-events-none absolute inset-0 w-full h-full z-20"
            :viewBox="`0 0 ${boxWidth} ${boxHeight}`" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
                    <path d="M0,0 L0,6 L9,3 z" fill="#9aa3ff" />
                </marker>
            </defs>
            <path v-for="e in edges" :key="e.id" :d="e.d" stroke="#9aa3ff" stroke-width="2.5" fill="none"
                marker-end="url(#arrow)" />
        </svg>

        <!-- Content laid out with Flex/Grid so it reflows naturally -->
        <div
            class="w-full overflow-x-auto overflow-y-visible pb-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
            <div class="flex flex-col gap-8">
                <!-- Row 1: Setup centered -->
                <div class="w-full flex justify-center">
                    <div class="glass rounded-2xl p-6 flex flex-col items-center gap-4 w-[520px] h-[360px]">
                        <h3 class="text-white text-[20px] font-semibold">Setup</h3>
                        <div class="flex-1 flex flex-col gap-4 w-full justify-between">
                            <div ref="n0" class="glass-strong rounded-xl px-4 py-3 w-full text-center">Set up Brave +
                                BAT</div>
                            <div ref="n1" class="glass-strong rounded-xl px-4 py-3 w-full text-center">Enable Brave
                                Rewards</div>
                            <div ref="n2" class="glass-strong rounded-xl px-4 py-3 w-full text-center">
                                <div>Choose payout: Custodial</div>
                                <div>or Self‑custody</div>
                            </div>
                            <div ref="n3" class="glass-strong rounded-xl px-4 py-3 w-full text-center">Get BAT: Earn via
                                ads
                                or add funds</div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Users and Creators adjacent -->
                <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 place-items-center">
                    <!-- Users lane -->
                    <div class="glass rounded-2xl p-6 flex flex-col gap-4 w-[520px] h-[360px]">
                        <h3 class="text-white text-[20px] font-semibold text-center">Users</h3>
                        <div class="flex-1 flex flex-col gap-4 justify-between">
                            <div ref="u1Card" class="glass-strong rounded-xl px-4 py-3 text-center">Find verified
                                creators – blue check
                                in URL bar</div>
                            <div ref="uRow" class="flex gap-3">
                                <div ref="u2Card"
                                    class="glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none"
                                    @mouseenter="(e) => showTooltip('u2', e)" @mouseleave="hideTooltip"
                                    @click="handleNodeClick('u2')">Tip on‑demand</div>
                                <div ref="u3Card"
                                    class="glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none"
                                    @mouseenter="(e) => showTooltip('u3', e)" @mouseleave="hideTooltip"
                                    @click="handleNodeClick('u3')">Set recurring tip</div>
                                <div ref="u4Card"
                                    class="glass-strong rounded-xl px-3 py-3 text-center cursor-pointer select-none"
                                    @mouseenter="(e) => showTooltip('u4', e)" @mouseleave="hideTooltip"
                                    @click="handleNodeClick('u4')">Auto‑contribute</div>
                            </div>
                            <div ref="u5" class="glass-strong rounded-xl px-4 py-3 text-center">Privacy‑preserving ads;
                                no personal
                                data leaves browser</div>
                        </div>
                    </div>

                    <!-- Creators lane -->
                    <div class="glass rounded-2xl p-6 flex flex-col gap-4 w-[520px] h-[360px]">
                        <h3 class="text-white text-[20px] font-semibold text-center">Creators</h3>
                        <div class="flex-1 flex flex-col gap-4 justify-between">
                            <div ref="c1Card"
                                class="glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none"
                                @mouseenter="(e) => showTooltip('c1', e)" @mouseleave="hideTooltip"
                                @click="handleNodeClick('c1')">Join Brave Creators</div>
                            <div ref="c2Card"
                                class="glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none"
                                @mouseenter="(e) => showTooltip('c2', e)" @mouseleave="hideTooltip"
                                @click="handleNodeClick('c2')">Verify site/channel</div>
                            <div ref="c3Card"
                                class="glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none"
                                @mouseenter="(e) => showTooltip('c3', e)" @mouseleave="hideTooltip"
                                @click="handleNodeClick('c3')">Connect payout: Uphold/Gemini/bitFlyer or ETH/SOL</div>
                            <div ref="c4Card"
                                class="glass-strong rounded-xl px-4 py-3 text-center cursor-pointer select-none"
                                @mouseenter="(e) => showTooltip('c4', e)" @mouseleave="hideTooltip"
                                @click="handleNodeClick('c4')">Receive BAT tips and contributions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tooltip overlay (positioned absolutely) -->
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

/* Custom scrollbar for horizontal overflow */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(123, 63, 242, 0.3);
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(123, 63, 242, 0.5);
}

/* Custom scrollbar for horizontal overflow */
.scrollbar-thin::-webkit-scrollbar {
    height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(123, 63, 242, 0.3);
    border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(123, 63, 242, 0.5);
}
</style>
