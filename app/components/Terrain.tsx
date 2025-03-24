import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BASE_HEIGHT = 3.5; // Keeps the terrain lower down
const GRID_SIZE = 50; // Number of vertices in the terrain grid (50x50)

/**
 * Props for the Terrain component that receives temperature data
 * to influence the terrain generation
 */
interface TerrainProps {
  temperature: number;
}

/**
 * Terrain component that generates and renders a 3D terrain mesh
 * The terrain's height and appearance are influenced by the temperature
 */
const Terrain: React.FC<TerrainProps> = ({ temperature }) => {
  // Reference to the mesh object for animations and updates
  const meshRef = useRef<THREE.Mesh>(null);

  // Create a plane geometry with a fixed grid size
  // Using useState to memoize the geometry creation
  const [geometry] = useState<THREE.PlaneGeometry>(() => {
    // 10x10 units in size, subdivided into GRID_SIZE segments
    const geo = new THREE.PlaneGeometry(20, 20, GRID_SIZE - 1, GRID_SIZE - 1);
    return geo;
  });

  // Update the terrain heightmap when temperature changes
  useEffect(() => {
    if (!meshRef.current) return;

    // Get access to the vertex positions
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Iterate through all vertices (each vertex has x,y,z coordinates)
    for (let i = 0; i < positions.length; i += 3) {
      // Calculate grid coordinates from the vertex index
      const x = Math.floor((i / 3) % GRID_SIZE);
      const y = Math.floor((i / 3) / GRID_SIZE);
      
      // Generate height using a simple pseudo-Perlin noise
      // This creates an organic-looking terrain with peaks and valleys
      const noise = Math.sin(x * 0.2) * Math.cos(y * 0.2) +
                   Math.sin(x * 0.1 + y * 0.2) * 0.5;
      
      // Scale the terrain height based on temperature
      // Higher temperatures create more pronounced terrain features
      const temperatureInfluence = temperature / 50; // Normalize temperature influence
      positions[i + 2] = (noise * (1 + temperatureInfluence)) - BASE_HEIGHT;
    }

    // Mark the geometry for update and recompute normals for proper lighting
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [temperature, geometry]);

  // Animate the terrain by slowly rotating it
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} />
      {/* Create a wireframe material with a blue color */}
      <meshPhongMaterial
        color={new THREE.Color(0x3b82f6)}
        wireframe={true}
        side={THREE.DoubleSide}
        shininess={100}
      />
    </mesh>
  );
}

export default Terrain;
