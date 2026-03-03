import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const Cube = ({ position, colorHex }) => {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // The cube should rise when the mouse is above it
        const targetY = hovered ? position[1] + 0.6 : position[1];

        // Smoothly interpolate the Y position
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 12);

        // Slightly intensify the edge color on hover
        const intensity = hovered ? 1 : 0.6;
        meshRef.current.children[0].material.opacity = THREE.MathUtils.lerp(
            meshRef.current.children[0].material.opacity,
            intensity,
            delta * 8
        );
    });

    return (
        <group>
            {/* The Base glowing square underneath each cube matching its color */}
            <mesh position={[position[0], -0.55, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.05, 1.05]} />
                <meshBasicMaterial color={colorHex} transparent opacity={0.4} />
            </mesh>

            <mesh
                ref={meshRef}
                position={position}
                onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'default'; }}
            >
                <boxGeometry args={[1, 1, 1]} />
                {/* 
                  The cubes in the new image are solid, pitch black, non-reflective. 
                  MeshBasicMaterial with color #000 is perfect. 
                */}
                <meshBasicMaterial color="#000000" />

                {/* Glowing neon edges */}
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
                    <lineBasicMaterial
                        color={colorHex}
                        transparent
                        opacity={0.6}
                        linewidth={2}
                    />
                </lineSegments>
            </mesh>
        </group>
    );
};

const IsometricGrid = () => {
    const groupRef = useRef();

    // Grid generation matching the 3x4 layout from the image
    const cubes = useMemo(() => {
        const arr = [];
        const gridX = 3;
        const gridZ = 4;
        const spacing = 1.35; // Space between cubes

        // To center the grid
        const offsetX = (gridX - 1) * spacing / 2;
        const offsetZ = (gridZ - 1) * spacing / 2;

        for (let x = 0; x < gridX; x++) {
            for (let z = 0; z < gridZ; z++) {
                const posX = x * spacing - offsetX;
                const posZ = z * spacing - offsetZ;

                // Gradient calculation based on position (bottom-left purple, top-right cyan)
                // Normalize positions roughly from 0 to 1
                const nx = x / Math.max(1, gridX - 1);
                const nz = z / Math.max(1, gridZ - 1);

                // Mix factor combining X and Z to draw a diagonal gradient
                const mixFactor = (nx * 0.5) + ((1 - nz) * 0.5);

                const cubeColor = new THREE.Color().lerpColors(
                    new THREE.Color('#9d4edd'), // Purple
                    new THREE.Color('#00ffff'), // Cyan
                    mixFactor
                );

                arr.push(
                    <Cube
                        key={`cube-${x}-${z}`}
                        position={[posX, 0, posZ]}
                        colorHex={cubeColor}
                    />
                );
            }
        }
        return arr;
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Base isometric rotation
        const baseRotX = Math.atan(1 / Math.sqrt(2));
        const baseRotY = -Math.PI / 4;

        // Very subtle parallax so it feels alive but matches the still image closely
        const targetRotX = baseRotX + (state.pointer.y * 0.05);
        const targetRotY = baseRotY + (state.pointer.x * 0.05);

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
    });

    return (
        <group ref={groupRef} position={[3, -0.5, 0]} scale={1.4}>
            {cubes}
        </group>
    );
};

export default function CubesScene() {
    return (
        // Canvas is transparent to let CSS body background through
        <Canvas
            camera={{ position: [0, 0, 15], fov: 32 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            style={{ pointerEvents: 'auto' }}
        >
            <IsometricGrid />

            {/* Intensive bloom for the bright edge lines and base squares */}
            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.1}
                    intensity={2.0}
                    mipmapBlur
                />
            </EffectComposer>
        </Canvas>
    );
}
