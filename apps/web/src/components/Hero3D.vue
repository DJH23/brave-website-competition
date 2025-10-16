<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const canvas = ref<HTMLCanvasElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let batGroup: THREE.Group;
let frameId = 0;

// Create BAT logo using SVG-like shapes
const createBATLogo = () => {
    const group = new THREE.Group();

    // Create the BAT triangle/shield shape using extruded geometry
    // Approximate BAT logo geometry
    const shape = new THREE.Shape();

    // Simplified BAT logo outline (triangle-ish shape)
    shape.moveTo(0, 0.8);    // Top center
    shape.lineTo(0.7, -0.3);  // Right
    shape.lineTo(0.3, -0.6);  // Bottom right
    shape.lineTo(0, -0.4);    // Bottom center
    shape.lineTo(-0.3, -0.6); // Bottom left
    shape.lineTo(-0.7, -0.3); // Left
    shape.lineTo(0, 0.8);     // Back to top

    const extrudeSettings = {
        depth: 0.15,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create materials with Brave brand colors
    const materials = [
        new THREE.MeshStandardMaterial({
            color: 0x7C3AED, // Purple
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0x7C3AED,
            emissiveIntensity: 0.2
        }),
        new THREE.MeshStandardMaterial({
            color: 0xFB542B, // Orange
            metalness: 0.4,
            roughness: 0.3,
            emissive: 0xFB542B,
            emissiveIntensity: 0.2
        })
    ];

    // Create main mesh with gradient effect using multiple materials
    const batMesh = new THREE.Mesh(geometry, materials[0]);
    group.add(batMesh);

    // Add inner glow effect
    const glowGeometry = geometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x0EA5E9,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(1.05, 1.05, 1.05);
    group.add(glowMesh);

    return group;
};

onMounted(() => {
    const width = window.innerWidth;
    const height = Math.min(520, Math.round(window.innerHeight * 0.6));

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 3.5;

    // Create and add BAT logo
    batGroup = createBATLogo();
    scene.add(batGroup);

    // Enhanced lighting for the 3D BAT logo
    const light1 = new THREE.DirectionalLight(0xFB542B, 1.5); // Orange light
    light1.position.set(3, 5, 5);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x7C3AED, 1.2); // Purple light
    light2.position.set(-3, -2, 5);
    scene.add(light2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    // Add point light for dynamic glow
    const pointLight = new THREE.PointLight(0x0EA5E9, 1, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const animate = () => {
        frameId = requestAnimationFrame(animate);

        // Smooth rotation
        batGroup.rotation.x += 0.005;
        batGroup.rotation.y += 0.008;

        // Subtle pulsing glow effect
        const time = Date.now() * 0.001;
        pointLight.intensity = 1 + Math.sin(time * 2) * 0.3;

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
        <canvas ref="canvas" role="img"
            aria-label="Animated 3D BAT logo representing Brave's innovative privacy technology"
            class="rounded-2xl border border-neutral-800/80 shadow-2xl shadow-bravePurple/20 hover:shadow-glow-purple transition-shadow duration-500 animate-fade-in"></canvas>
    </section>
</template>

<style scoped></style>
