import { useMemo, useRef } from "react";
import { VoiceState } from "../types/type";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

export const NeuralSphere: React.FC<{ voiceState: VoiceState }> = ({
  voiceState,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const particleCount = 200;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 1.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      speeds[i] = 0.2 + Math.random() * 0.8;
      radii[i] = r;
    }

    return { positions, speeds, radii };
  }, []);

  const sphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uState: { value: 0 },
        uColor: { value: new THREE.Color("#00ff88") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uState;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 pos = position;
          float noise = sin(pos.x * 4.0 + uTime) * cos(pos.y * 4.0 + uTime) * sin(pos.z * 4.0 + uTime);
          float displacement = noise * 0.05 * (1.0 + uState * 0.5);
          pos += normal * displacement;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uState;

        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + uState * 3.0);

          vec3 color = uColor * (0.2 + fresnel * 0.8) * pulse;
          float alpha = 0.3 + fresnel * 0.4;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  const stateValue = useMemo(() => {
    switch (voiceState) {
      case "idle":
        return 0;
      case "listening":
        return 1;
      case "thinking":
        return 2;
      case "speaking":
        return 3;
      case "ready":
        return 0.5;
      default:
        return 0;
    }
  }, [voiceState]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    sphereMaterial.uniforms.uTime.value = time;
    sphereMaterial.uniforms.uState.value = THREE.MathUtils.lerp(
      sphereMaterial.uniforms.uState.value,
      stateValue,
      0.05,
    );

    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      const targetScale =
        voiceState === "listening"
          ? 1.15
          : voiceState === "thinking"
            ? 1.05
            : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05,
      );
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const speed =
          particles.speeds[i] *
          (voiceState === "thinking"
            ? 3
            : voiceState === "listening"
              ? 1.5
              : 0.5);
        const angle = time * speed + i * 0.1;
        const r = particles.radii[i] + Math.sin(time * 0.5 + i) * 0.1;
        positions[i * 3] = r * Math.cos(angle) * Math.sin(i * 0.5);
        positions[i * 3 + 1] = r * Math.sin(angle) * Math.sin(i * 0.5);
        positions[i * 3 + 2] = r * Math.cos(i * 0.5);
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y =
        time * 0.05 * (voiceState === "thinking" ? 2 : 1);
    }

    if (glowRef.current) {
      const glowScale =
        1.2 + Math.sin(time * 2) * 0.05 * (voiceState === "speaking" ? 2 : 1);
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(time * 1.5) * 0.05 * (voiceState === "speaking" ? 2 : 1);
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={sphereMaterial}>
        <sphereGeometry args={[1.5, 64, 64]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.15} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
            args={[particles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#00ff88"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ff88" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#00cc6a" />
    </group>
  );
};

export const GlobeAI: React.FC<{ voiceState: VoiceState }> = ({
  voiceState,
}) => (
  <div className="w-100 h-100 -mt-16 relative z-10">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <NeuralSphere voiceState={voiceState} />
    </Canvas>
  </div>
);
