<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const canvas = ref<HTMLCanvasElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let cube: THREE.Mesh;
let frameId = 0;

onMounted(() => {
    const width = window.innerWidth;
    const height = Math.min(520, Math.round(window.innerHeight * 0.6));

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x7C3AED, metalness: 0.2, roughness: 0.4 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(3, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const animate = () => {
        frameId = requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.012;
        renderer!.render(scene, camera);
    };
    animate();

    const onResize = () => {
        const w = window.innerWidth;
        const h = Math.min(520, Math.round(window.innerHeight * 0.6));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer!.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    onBeforeUnmount(() => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        renderer?.dispose();
    });
});
</script>

<template>
    <section class="w-full flex items-center justify-center py-10" aria-label="3D Interactive Hero Animation">
        <canvas ref="canvas" role="img" aria-label="Animated 3D cube representing Brave's innovative technology"
            class="rounded-2xl border border-neutral-800/80 shadow-2xl shadow-bravePurple/20 hover:shadow-glow-purple transition-shadow duration-500 animate-fade-in"></canvas>
    </section>
</template>

<style scoped></style>
