<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const canvas = ref<HTMLCanvasElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let batGroup: THREE.Group;
let frameId = 0;

// BAT logo colors
const ORANGE = 0xFB542B;
const MAGENTA = 0xA0328C;
const PURPLE = 0x662D91;

const createBATLogo = () => {
  const group = new THREE.Group();

  // Define the outer triangle vertices
  const size = 1.2;
  const top = new THREE.Vector2(0, size);
  const bottomLeft = new THREE.Vector2(-size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
  const bottomRight = new THREE.Vector2(size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));

  // Define the inner (white) triangle vertices - smaller and centered
  const innerSize = 0.5;
  const innerTop = new THREE.Vector2(0, innerSize);
  const innerBottomLeft = new THREE.Vector2(-innerSize * Math.cos(Math.PI / 6), -innerSize * Math.sin(Math.PI / 6));
  const innerBottomRight = new THREE.Vector2(innerSize * Math.cos(Math.PI / 6), -innerSize * Math.sin(Math.PI / 6));

  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelSegments: 2
  };

  // LEFT ORANGE ARM (trapezoid from top to bottom-left)
  const leftArm = new THREE.Shape();
  leftArm.moveTo(top.x, top.y);
  leftArm.lineTo(bottomLeft.x, bottomLeft.y);
  leftArm.lineTo(innerBottomLeft.x, innerBottomLeft.y);
  leftArm.lineTo(innerTop.x, innerTop.y);
  leftArm.lineTo(top.x, top.y);

  const leftGeom = new THREE.ExtrudeGeometry(leftArm, extrudeSettings);
  const leftMat = new THREE.MeshStandardMaterial({
    color: ORANGE,
    metalness: 0.3,
    roughness: 0.4,
  });
  const leftMesh = new THREE.Mesh(leftGeom, leftMat);
  group.add(leftMesh);

  // RIGHT MAGENTA ARM (trapezoid from top to bottom-right)
  const rightArm = new THREE.Shape();
  rightArm.moveTo(top.x, top.y);
  rightArm.lineTo(innerTop.x, innerTop.y);
  rightArm.lineTo(innerBottomRight.x, innerBottomRight.y);
  rightArm.lineTo(bottomRight.x, bottomRight.y);
  rightArm.lineTo(top.x, top.y);

  const rightGeom = new THREE.ExtrudeGeometry(rightArm, extrudeSettings);
  const rightMat = new THREE.MeshStandardMaterial({
    color: MAGENTA,
    metalness: 0.3,
    roughness: 0.4,
  });
  const rightMesh = new THREE.Mesh(rightGeom, rightMat);
  group.add(rightMesh);

  // BOTTOM PURPLE ARM (trapezoid connecting bottom-left to bottom-right)
  const bottomArm = new THREE.Shape();
  bottomArm.moveTo(bottomLeft.x, bottomLeft.y);
  bottomArm.lineTo(bottomRight.x, bottomRight.y);
  bottomArm.lineTo(innerBottomRight.x, innerBottomRight.y);
  bottomArm.lineTo(innerBottomLeft.x, innerBottomLeft.y);
  bottomArm.lineTo(bottomLeft.x, bottomLeft.y);

  const bottomGeom = new THREE.ExtrudeGeometry(bottomArm, extrudeSettings);
  const bottomMat = new THREE.MeshStandardMaterial({
    color: PURPLE,
    metalness: 0.3,
    roughness: 0.4,
  });
  const bottomMesh = new THREE.Mesh(bottomGeom, bottomMat);
  group.add(bottomMesh);

  // Optional: Add white triangle in center (as a separate mesh for clarity)
  const whiteTriangle = new THREE.Shape();
  whiteTriangle.moveTo(innerTop.x, innerTop.y);
  whiteTriangle.lineTo(innerBottomLeft.x, innerBottomLeft.y);
  whiteTriangle.lineTo(innerBottomRight.x, innerBottomRight.y);
  whiteTriangle.lineTo(innerTop.x, innerTop.y);

  const whiteGeom = new THREE.ExtrudeGeometry(whiteTriangle, {
    depth: 0.14, // Slightly less depth so it sits behind
    bevelEnabled: false
  });
  const whiteMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF, // Pure white
  });
  const whiteMesh = new THREE.Mesh(whiteGeom, whiteMat);
  whiteMesh.position.z = -0.01; // Slightly behind
  group.add(whiteMesh);

  return group;
};

onMounted(() => {
  const width = 100;
  const height = 100;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value!,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(1);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = 3;

  batGroup = createBATLogo();
  scene.add(batGroup);

  // Enhanced lighting
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(-5, -5, 5);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const animate = () => {
    frameId = requestAnimationFrame(animate);

    batGroup.rotation.x += 0.005;
    batGroup.rotation.y += 0.008;

    renderer!.render(scene, camera);
  };
  animate();

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId);
    renderer?.dispose();
  });
});
</script>

<template>
  <canvas ref="canvas" role="img" aria-label="Animated 3D BAT logo representing Brave's innovative privacy technology"
    class="hover:shadow-glow-purple transition-shadow animate-fade-in" style="background: transparent; border: none; box-shadow: none; min-width: 64px; min-height: 64px;">
  </canvas>
</template>


<style scoped></style>
