"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function KineticSculpture({ totalSpent }: { totalSpent: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Map spending to scale and distortion
    const scale = useMemo(() => Math.max(1, Math.min(2.5, totalSpent / 5000 + 1)), [totalSpent]);
    const distortion = useMemo(() => Math.min(0.8, totalSpent / 10000), [totalSpent]);
    const speed = useMemo(() => Math.max(1, totalSpent / 2000), [totalSpent]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.01;

            // Gentle floating animation
            const time = state.clock.getElapsedTime();
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} scale={scale}>
            <octahedronGeometry args={[1, 0]} />
            <MeshDistortMaterial
                color="#FFFFFF"
                speed={speed}
                distort={distortion}
                wireframe
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}

export function FinancialCore3D({ totalSpent = 0 }: { totalSpent?: number }) {
    return (
        <div className="w-full h-full min-h-[400px] relative pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <KineticSculpture totalSpent={totalSpent} />
                </Float>

                {/* Decorative Bauhaus Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#FF4D4D" transparent opacity={0.2} />
                </mesh>
            </Canvas>
        </div>
    );
}
