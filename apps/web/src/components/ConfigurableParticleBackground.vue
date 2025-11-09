<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

/*
  PERFORMANCE & VISUAL TUNING — tweak these constants for quick experimentation
  Note: Many of these directly affect GPU/CPU cost. Increase gradually and
  test on low-end devices or with DevTools Performance.
*/

// 1) FPS cap — limits max frames per second to reduce GPU/CPU load
//    Lower = less smooth but cheaper; Higher = smoother but more costly
const FPS_CAP = 120;

// 2) Particle density multiplier — scales how many particles we spawn
//    Lower = fewer particles (cheaper), Higher = more particles (richer but heavier)
const DENSITY_MULTIPLIER = 3;

// 3) Maximum blur filter (px) — caps the blur used for far-depth particles
//    Lower = cheaper (less canvas filter work), Higher = softer depth-of-field look but more GPU cost
const MAX_BLUR_PX = 0;

// 4) Particle size scaling factor — global size multiplier for all particles
//    Lower = smaller particles (cheaper to draw), Higher = larger particles (more coverage)
const PARTICLE_SIZE_SCALE = 0.9;

// 5) Group boost speed multiplier range — coordinated bursts of speed for subsets of particles
//    Narrower/lower range = calmer motion, Wider/higher = more lively motion (slightly more CPU)
const GROUP_BOOST_MIN = 0;
const GROUP_BOOST_MAX = 2;

// 6) Parallax effect strength factor — how strongly the background tracks scroll
//    Lower = subtler motion (easier on sensitive users), Higher = more noticeable parallax
const PARALLAX_STRENGTH = 0.035;

// 7) Twinkle/Shimmer effect — particles randomly brighten and fade (like stars twinkling)
//    Enable for magical starfield effect; disable for steadier particles
const ENABLE_TWINKLE = true;
const TWINKLE_SPEED = 0.02; // How fast particles twinkle (0.01 = slow, 0.03 = fast)
const TWINKLE_INTENSITY = 1; // How much brightness varies (0.2 = subtle, 0.6 = dramatic)

// 8) Base particle drift speed — controls the ambient floating motion (before boosts/mouse)
//    Lower = calmer, more static field; Higher = more active, flowing motion
const BASE_DRIFT_SPEED = 0.08; // 0.05 = slow gentle drift, 0.25 = faster ambient flow

// --- INTERNAL CONSTANTS (usually no need to change) ---
const BASE_DENSITY_DIVISOR = 14000; // Base density; lower means more particles per area
const GROUP_COUNT = 20;              // How many independent groups can boost
const MAX_ACTIVE_GROUPS = 2;        // Limit simultaneous active boosts
const EASE_FACTOR = 0.1;            // Parallax easing (lower = smoother, higher = snappier)

// Brand colors (single source of truth palette)
const brandColors = [
    { r: 251, g: 84, b: 43 },   // braveOrange
    { r: 124, g: 58, b: 237 },  // bravePurple
    { r: 14, g: 165, b: 233 }   // braveBlue
];

// Canvas + anim state
const canvas = ref<HTMLCanvasElement | null>(null);
let animationId = 0;
let parallaxRaf = 0;
let lastTime = performance.now();
const FRAME_DURATION = 1000 / FPS_CAP;

let particles: Particle[] = [];
let mouse = { x: 0, y: 0 };

// Smooth parallax state
let currentOffset = 0;
let targetOffset = 0;

type GroupBoost = {
    active: boolean;
    timeLeft: number;
    cooldown: number;
    multiplier: number;
    // Smooth deceleration phase
    decelerating: boolean;
    decelProgress: number; // 0..1, progress through deceleration
};
let groupBoosts: GroupBoost[] = Array.from({ length: GROUP_COUNT }, () => ({
    active: false,
    timeLeft: 0,
    cooldown: Math.floor(180 + Math.random() * 360), // 3-9s before first boost
    multiplier: 1,
    decelerating: false,
    decelProgress: 0
}));

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseVx: number;
    baseVy: number;
    color: { r: number; g: number; b: number };
    colorIndex: number;
    colorProgress: number; // 0..1 toward next color
    colorSpeed: number;
    z: number; // depth in [0..1], 0 = near, 1 = far
    groupId: number;
    // Twinkle/shimmer state
    twinklePhase: number; // 0..2π, cycles for shimmer effect
    twinkleOffset: number; // Random phase offset so particles don't sync

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.z = Math.random(); // distribute depths
        const speedScale = 0.4 + 0.6 * (1 - this.z); // near moves more, far less
        const sizeScale = (0.5 + 0.8 * (1 - this.z)) * PARTICLE_SIZE_SCALE; // near larger, far smaller

        this.vx = ((Math.random() - 0.5) * 0.5) * speedScale;
        this.vy = ((Math.random() - 0.5) * 0.5) * speedScale;
        this.baseVx = ((Math.random() - 0.5) * BASE_DRIFT_SPEED) * speedScale;
        this.baseVy = ((Math.random() - 0.5) * BASE_DRIFT_SPEED) * speedScale;
        this.size = (Math.random() * 1.5 + 0.9) * sizeScale;

        this.colorIndex = Math.floor(Math.random() * brandColors.length);
        this.colorProgress = Math.random();
        this.colorSpeed = 0.001 + Math.random() * 0.002;
        this.color = { ...brandColors[this.colorIndex] };

        this.groupId = Math.floor(Math.random() * GROUP_COUNT);

        // Initialize twinkle with random phase offset so particles don't all shimmer in sync
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }

    update(width: number, height: number, mouseX: number, mouseY: number, speedMultiplier: number) {
        // Color morphing
        this.colorProgress += this.colorSpeed;
        if (this.colorProgress >= 1) {
            this.colorProgress = 0;
            this.colorIndex = (this.colorIndex + 1) % brandColors.length;
        }
        const currentColor = brandColors[this.colorIndex];
        const nextColor = brandColors[(this.colorIndex + 1) % brandColors.length];

        // Interpolate color
        this.color.r = currentColor.r + (nextColor.r - currentColor.r) * this.colorProgress;
        this.color.g = currentColor.g + (nextColor.g - currentColor.g) * this.colorProgress;
        this.color.b = currentColor.b + (nextColor.b - currentColor.b) * this.colorProgress;

        // Mouse repulsion (nearer reacts a bit more)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
            const force = ((100 - dist) / 100) * (1 - this.z);
            this.vx -= (dx / Math.max(1, dist)) * force * 0.2;
            this.vy -= (dy / Math.max(1, dist)) * force * 0.2;
        }

        // Move with optional boost
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        // Wrap
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Damping + drift restoration
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vx += this.baseVx * 0.05 * speedMultiplier;
        this.vy += this.baseVy * 0.05 * speedMultiplier;

        // Update twinkle phase if enabled
        if (ENABLE_TWINKLE) {
            this.twinklePhase += TWINKLE_SPEED;
            if (this.twinklePhase > Math.PI * 2) this.twinklePhase -= Math.PI * 2;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const depthFactor = 1 - this.z; // 0 = far, 1 = near
        // Non-linear alpha to emphasize near brightness
        let alpha = Math.min(1, 0.18 + 1 * Math.pow(depthFactor, 0.6));

        // Apply twinkle/shimmer effect if enabled
        if (ENABLE_TWINKLE) {
            // Use sine wave with random offset for smooth shimmer
            const shimmer = Math.sin(this.twinklePhase + this.twinkleOffset);
            // Map -1..1 to a brightness multiplier (1 - intensity..1 + intensity)
            const twinkleFactor = 1 + shimmer * TWINKLE_INTENSITY;
            alpha = Math.min(1, alpha * twinkleFactor);
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        // Depth-of-field: blur only farthest particles (clamped to MAX_BLUR_PX)
        const baseBlur = this.z > 0.75 ? Math.round((this.z - 0.75) * MAX_BLUR_PX * 4) : 0; // 0..MAX
        const blurPx = Math.min(MAX_BLUR_PX, baseBlur);
        ctx.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';

        // Brighten color slightly for near particles by mixing with white
        const brightenMix = 0 + 0.4 * Math.pow(depthFactor, 1);
        const r = Math.min(255, Math.round(this.color.r + (255 - this.color.r) * brightenMix));
        const g = Math.min(255, Math.round(this.color.g + (255 - this.color.g) * brightenMix));
        const b = Math.min(255, Math.round(this.color.b + (255 - this.color.b) * brightenMix));
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        if (depthFactor > 0.85) ctx.globalCompositeOperation = 'lighter';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

onMounted(() => {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    const resize = () => {
        if (!canvas.value) return;
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles (base density * multiplier)
    const count = Math.floor((canvas.value.width * canvas.value.height) / BASE_DENSITY_DIVISOR * DENSITY_MULTIPLIER);
    for (let i = 0; i < count; i++) particles.push(new Particle(canvas.value.width, canvas.value.height));

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Parallax scroll with easing
    const updateParallax = () => {
        if (!canvas.value) return;
        currentOffset += (targetOffset - currentOffset) * EASE_FACTOR;
        canvas.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
        if (Math.abs(targetOffset - currentOffset) > 0.1) parallaxRaf = requestAnimationFrame(updateParallax);
    };
    const onScroll = () => {
        const scrollTop = window.scrollY || window.pageYOffset || 0;
        targetOffset = scrollTop * PARALLAX_STRENGTH;
        cancelAnimationFrame(parallaxRaf);
        parallaxRaf = requestAnimationFrame(updateParallax);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    targetOffset = (window.scrollY || 0) * PARALLAX_STRENGTH;
    currentOffset = targetOffset;
    if (canvas.value) canvas.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`;

    // Animation loop (respects FPS cap)
    const animate = (time: number) => {
        const delta = time - lastTime;
        if (delta < FRAME_DURATION) {
            animationId = requestAnimationFrame(animate);
            return; // skip to honor FPS cap
        }
        lastTime = time;

        if (!canvas.value || !ctx) return;
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        // Update group boost timers with smooth deceleration
        const DECEL_DURATION = 90; // frames to decelerate (1.5s at 60fps, 2s at 45fps)
        let activeGroups = groupBoosts.filter(g => g.active || g.decelerating).length;
        for (let i = 0; i < groupBoosts.length; i++) {
            const g = groupBoosts[i];

            if (g.decelerating) {
                // Smooth deceleration phase
                g.decelProgress += 1 / DECEL_DURATION;
                if (g.decelProgress >= 1) {
                    g.decelerating = false;
                    g.decelProgress = 0;
                    activeGroups -= 1;
                }
            } else if (g.active) {
                g.timeLeft -= 1;
                if (g.timeLeft <= 0) {
                    // Start deceleration instead of stopping abruptly
                    g.active = false;
                    g.decelerating = true;
                    g.decelProgress = 0;
                    g.cooldown = Math.floor(300 + Math.random() * 600); // 5-15s until next
                }
            } else {
                g.cooldown -= 1;
                if (g.cooldown <= 0 && activeGroups < MAX_ACTIVE_GROUPS) {
                    g.active = true;
                    g.timeLeft = Math.floor(180 + Math.random() * 240); // 3-7s boost
                    g.multiplier = GROUP_BOOST_MIN + Math.random() * (GROUP_BOOST_MAX - GROUP_BOOST_MIN);
                    activeGroups += 1;
                }
            }
        }

        // Update + draw particles with smoothed speed multiplier
        particles.forEach(p => {
            const g = groupBoosts[p.groupId];
            let m = 1;
            if (g?.active) {
                m = g.multiplier;
            } else if (g?.decelerating) {
                // Ease out using cubic easing: 1 - (1-t)^3
                const t = g.decelProgress;
                const easeOut = 1 - Math.pow(1 - t, 3);
                // Lerp from multiplier to 1
                m = g.multiplier + (1 - g.multiplier) * easeOut;
            }
            p.update(canvas.value!.width, canvas.value!.height, mouse.x, mouse.y, m);
            p.draw(ctx);
        });

        animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    onBeforeUnmount(() => {
        cancelAnimationFrame(animationId);
        cancelAnimationFrame(parallaxRaf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', onScroll);
    });
});
</script>

<template>
    <canvas ref="canvas" class="fixed inset-0 pointer-events-none z-0" style="will-change: transform;"
        aria-hidden="true"></canvas>
</template>
