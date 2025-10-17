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

// Smooth parallax state
let currentOffset = 0;
let targetOffset = 0;
const EASE_FACTOR = 0.1; // Lower = smoother/slower, higher = snappier

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseVx: number; // Ambient drift velocity
    baseVy: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Start with some random velocity
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        // Add subtle base drift for continuous movement
        this.baseVx = (Math.random() - 0.5) * 0.15;
        this.baseVy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 2 + 1;
    }

    update(width: number, height: number, mouseX: number, mouseY: number) {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            const force = (100 - dist) / 100;
            this.vx -= (dx / dist) * force * 0.2;
            this.vy -= (dy / dist) * force * 0.2;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Boundary check with wrapping for seamless drift
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Damping with drift restoration - always return toward base drift velocity
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Add back the ambient drift to maintain continuous movement
        this.vx += this.baseVx * 0.02;
        this.vy += this.baseVy * 0.02;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'rgba(124, 58, 237, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
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

        // Update and draw particles
        particles.forEach(p => {
            p.update(canvas.value!.width, canvas.value!.height, mouse.x, mouse.y);
            p.draw(ctx);
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(124, 58, 237, ${0.2 * (1 - dist / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
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
