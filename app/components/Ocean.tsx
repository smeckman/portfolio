import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Component that creates an animated wave-like ground effect
 * @component
 * @returns {JSX.Element} Rendered ground component
 */
const Ocean: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  /**
   * Create and configure the ground geometry
   * Uses sine waves to create an undulating surface
   */
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 64, 64);
    const positions = geo.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] = Math.sin(x * 0.3) * Math.sin(z * 0.3) * 2;
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  /**
   * Frame update handler for animating the ground
   * Updates vertex positions to create wave animation
   */
  useFrame(() => {
    timeRef.current += 0.001;
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] =
          Math.sin(x * 0.3 + timeRef.current) * Math.sin(z * 0.3) * 2 +
          Math.cos(x * 0.2) * Math.cos(z * 0.2) * 1.5;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      {/* Animated wave mesh */}
      <mesh
        ref={meshRef}
        receiveShadow
        castShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4, 0]}
        geometry={geometry}
      >
        <meshStandardMaterial
          color="#0455aa"
          roughness={0.8}
          metalness={0.2}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      {/* Base ground plane */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4.1, 0]}
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#112d5c" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
};

export default Ocean;
