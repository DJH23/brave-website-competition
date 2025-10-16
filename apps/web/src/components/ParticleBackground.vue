<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
let animationId = 0;
let particles: Particle[] = [];
let mouse = { x: 0, y: 0 };

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
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

        // Boundary check
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;
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
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
    });
});
</script>

<template>
    <canvas ref="canvas" class="fixed inset-0 pointer-events-none z-0" aria-hidden="true"></canvas>
</template>
