<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props {
    parallaxFactor?: number; // 0..1, controls parallax depth
}

const props = withDefaults(defineProps<Props>(), {
    parallaxFactor: 0.035
});

const canvas = ref<HTMLCanvasElement | null>(null);
let animationId = 0;
let particles: Particle[] = [];
let mouse = { x: 0, y: 0 };
let parallaxRaf = 0;

// Brand colors from single source of truth
const brandColors = [
    { r: 251, g: 84, b: 43 },   // braveOrange
    { r: 124, g: 58, b: 237 },  // bravePurple
    { r: 14, g: 165, b: 233 }   // braveBlue
];

// Smooth parallax state
let currentOffset = 0;
let targetOffset = 0;
const EASE_FACTOR = 0.1; // Lower = smoother/slower, higher = snappier
// Group-based speed boost configuration
const GROUP_COUNT = 4; // number of particle groups that can boost independently
const MAX_ACTIVE_GROUPS = 2; // limit simultaneous boosts
type GroupBoost = { active: boolean; timeLeft: number; cooldown: number; multiplier: number };
let groupBoosts: GroupBoost[] = Array.from({ length: GROUP_COUNT }, () => ({
    active: false,
    timeLeft: 0,
    cooldown: Math.floor(180 + Math.random() * 360), // 3-9s before first boost
    multiplier: 1
}));

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseVx: number; // Ambient drift velocity
    baseVy: number;
    color: { r: number; g: number; b: number };
    colorIndex: number; // Current color in the cycle
    colorProgress: number; // 0-1, progress to next color
    colorSpeed: number; // How fast to transition
    z: number; // NEW: depth in [0..1], 0 = near, 1 = far
    // Pulse state (for occasional soft glow/pulse)
    pulseActive: boolean;
    pulseProgress: number; // 0..1 for one pulse cycle
    pulseSpeed: number; // speed of pulse progress per frame
    pulseAmp: number; // amplitude of pulse effect (size/alpha)
    pulseCooldown: number; // frames until next possible pulse
    // Group-based speed behavior
    groupId: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.z = Math.random(); // distribute depths
        const speedScale = 0.4 + 0.6 * (1 - this.z); // near moves more, far less
        const sizeScale = 0.7 + 0.9 * (1 - this.z); // near larger, far smaller

        this.vx = ((Math.random() - 0.5) * 0.5) * speedScale;
        this.vy = ((Math.random() - 0.5) * 0.5) * speedScale;
        this.baseVx = ((Math.random() - 0.5) * 0.15) * speedScale;
        this.baseVy = ((Math.random() - 0.5) * 0.15) * speedScale;
        // Slightly reduce max size (was 1..3 -> now ~1..2.6 before scaling)
        this.size = (Math.random() * 1.3 + 1.0) * sizeScale;

        // Start at random color with random progress
        this.colorIndex = Math.floor(Math.random() * brandColors.length);
        this.colorProgress = Math.random();
        this.colorSpeed = 0.001 + Math.random() * 0.002;
        this.color = { ...brandColors[this.colorIndex] };

        // Initialize pulse
        this.pulseActive = false;
        this.pulseProgress = 0;
        this.pulseSpeed = 0.006 + Math.random() * 0.01; // ~1-3s per pulse
        this.pulseAmp = 0.18 + Math.random() * 0.14; // slightly stronger amplitude
        this.pulseCooldown = Math.floor(240 + Math.random() * 600); // 4-10s

        // Assign particle to a random group for coordinated boosts
        this.groupId = Math.floor(Math.random() * GROUP_COUNT);
    }

    update(width: number, height: number, mouseX: number, mouseY: number, speedMultiplier: number) {
        // Color morphing - lerp between current and next color
        this.colorProgress += this.colorSpeed;
        if (this.colorProgress >= 1) {
            this.colorProgress = 0;
            this.colorIndex = (this.colorIndex + 1) % brandColors.length;
        }

        const currentColor = brandColors[this.colorIndex];
        const nextColor = brandColors[(this.colorIndex + 1) % brandColors.length];

        // Smooth interpolation between colors
        this.color.r = currentColor.r + (nextColor.r - currentColor.r) * this.colorProgress;
        this.color.g = currentColor.g + (nextColor.g - currentColor.g) * this.colorProgress;
        this.color.b = currentColor.b + (nextColor.b - currentColor.b) * this.colorProgress;

        // Mouse interaction scaled by depth (nearer reacts more)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
            const force = ((100 - dist) / 100) * (1 - this.z);
            this.vx -= (dx / dist) * force * 0.2;
            this.vy -= (dy / dist) * force * 0.2;
        }

        // Apply movement with optional group-based speed multiplier
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        // Boundary check with wrapping for seamless drift
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Damping with drift restoration - always return toward base drift velocity
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Add back the ambient drift to maintain continuous movement (boost aware)
        this.vx += this.baseVx * 0.02 * speedMultiplier;
        this.vy += this.baseVy * 0.02 * speedMultiplier;

        // Occasional soft pulse logic
        if (this.pulseActive) {
            this.pulseProgress += this.pulseSpeed;
            if (this.pulseProgress >= 1) {
                this.pulseActive = false;
            }
        } else {
            this.pulseCooldown -= 1;
            if (this.pulseCooldown <= 0) {
                this.pulseActive = true;
                this.pulseProgress = 0;
                // Randomize next pulse window and parameters for variation
                this.pulseCooldown = Math.floor(240 + Math.random() * 600);
                this.pulseSpeed = 0.006 + Math.random() * 0.01; // keep slower pulse on retrigger
                this.pulseAmp = 0.12 + Math.random() * 0.1;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Depth-based alpha and optional blur
        const alpha = 0.34 + 0.5 * (1 - this.z); // increased base brightness
        ctx.save();
        ctx.globalAlpha = alpha;

        // Only blur the farthest particles to suggest depth-of-field
        const baseBlur = this.z > 0.75 ? Math.round((this.z - 0.75) * 8) : 0; // 0..2px
        ctx.filter = baseBlur > 0 ? `blur(${baseBlur}px)` : 'none';

        // Pulse modulation (soft, occasional)
        const pulseFactor = this.pulseActive ? Math.sin(this.pulseProgress * Math.PI) : 0; // 0..1..0
        const sizeMultiplier = 1 + this.pulseAmp * pulseFactor;
        const effectiveSize = this.size * sizeMultiplier;
        const extraAlpha = 0.8 * this.pulseAmp * pulseFactor; // more noticeable brightening
        ctx.globalAlpha = Math.min(1, alpha + extraAlpha);

        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, effectiveSize, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow during pulse
        if (pulseFactor > 0.1) {
            const glowAlpha = 0.10 * pulseFactor; // stronger glow
            ctx.globalAlpha = glowAlpha;
            ctx.filter = `blur(${baseBlur + 6}px)`; // more blur for glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, effectiveSize * 2.0, 0, Math.PI * 2); // larger glow radius
            ctx.fill();
        }

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

    // Create particles
    const particleCount = Math.floor((canvas.value.width * canvas.value.height) / 10000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.value.width, canvas.value.height));
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Parallax effect on scroll with smooth easing
    const updateParallax = () => {
        if (!canvas.value) return;

        // Smooth lerp (linear interpolation) toward target
        currentOffset += (targetOffset - currentOffset) * EASE_FACTOR;

        // Apply transform
        canvas.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`;

        // Continue animating if not at target (threshold for stopping)
        if (Math.abs(targetOffset - currentOffset) > 0.1) {
            parallaxRaf = requestAnimationFrame(updateParallax);
        }
    };

    const onScroll = () => {
        const scrollTop = window.scrollY || window.pageYOffset || 0;
        targetOffset = scrollTop * props.parallaxFactor;

        // Ensure animation is running
        cancelAnimationFrame(parallaxRaf);
        parallaxRaf = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial position
    targetOffset = (window.scrollY || 0) * props.parallaxFactor;
    currentOffset = targetOffset;
    if (canvas.value) {
        canvas.value.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
    }

    // Animation loop
    const animate = () => {
        if (!canvas.value || !ctx) return;
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        // Update group boost timers and possibly start new boosts
        let activeGroups = groupBoosts.filter(g => g.active).length;
        for (let i = 0; i < groupBoosts.length; i++) {
            const g = groupBoosts[i];
            if (g.active) {
                g.timeLeft -= 1;
                if (g.timeLeft <= 0) {
                    g.active = false;
                    g.cooldown = Math.floor(300 + Math.random() * 600); // 5-15s until next
                }
            } else {
                g.cooldown -= 1;
                if (g.cooldown <= 0 && activeGroups < MAX_ACTIVE_GROUPS) {
                    g.active = true;
                    g.timeLeft = Math.floor(180 + Math.random() * 240); // 3-7s boost
                    g.multiplier = 1.3 + Math.random() * 0.4; // 1.3x - 1.7x speed
                    activeGroups += 1;
                }
            }
        }

        // Update all particles first
        particles.forEach(p => {
            const m = groupBoosts[p.groupId]?.active ? groupBoosts[p.groupId].multiplier : 1;
            p.update(canvas.value!.width, canvas.value!.height, mouse.x, mouse.y, m);
        });

        // Sort by depth (far to near = painter's algorithm)
        const sorted = particles.slice().sort((a, b) => b.z - a.z);

        // Draw particles in depth order
        sorted.forEach(p => {
            p.draw(ctx);
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Depth-aware connection distance
                const avgZ = (p1.z + p2.z) / 2;
                const maxDist = 150 * (0.5 + 0.5 * (1 - avgZ)); // nearer particles connect farther

                if (dist < maxDist) {
                    // Blend colors between connected particles
                    const r = Math.floor((p1.color.r + p2.color.r) / 2);
                    const g = Math.floor((p1.color.g + p2.color.g) / 2);
                    const b = Math.floor((p1.color.b + p2.color.b) / 2);

                    // Depth-aware alpha: increase visibility and add a floor
                    const baseAlpha = 0.3 * (1 - dist / maxDist); // was 0.2
                    const depthMix = 0.4 + 0.2 * (1 - avgZ); // slightly higher base for far lines
                    let depthAlpha = baseAlpha * depthMix;
                    depthAlpha = Math.max(0.06, depthAlpha); // ensure minimally visible

                    ctx.save();
                    ctx.globalAlpha = depthAlpha;
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    // Slightly thicker for nearer pairs
                    ctx.lineWidth = 1 + 0.6 * (1 - avgZ);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    };
    animate();

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
