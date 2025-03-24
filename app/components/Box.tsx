import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';

/**
 * Props interface for the Box component
 * @interface BoxProps
 * @property {number} radius - The orbital radius of the box
 * @property {number} speed - The orbital speed of the box
 * @property {string} text - The text to display on the box faces
 * @property {() => void} onClick - Click handler function
 * @property {boolean} isActive - Whether the box is currently selected
 * @property {boolean} isOrbiting - Whether the box is currently in orbit
 * @property {boolean} isNotMobile - Whether the viewport is non-mobile
 * @property {[number, number, number]} staticPosition - Position when not orbiting
 */
type BoxProps = {
  radius: number;
  speed: number;
  text: string;
  onClick: () => void;
  isActive: boolean;
  isOrbiting: boolean;
  isNotMobile: boolean;
  staticPosition: [number, number, number];
};

/**
 * Interactive 3D box component with orbital motion and text display
 * @component
 * @param {BoxProps} props - Component properties
 * @returns {ReactElement} Rendered box component
 */
const Box: React.FC<BoxProps> = ({
  radius,
  speed,
  text,
  onClick,
  isActive,
  isOrbiting,
  isNotMobile,
  staticPosition
}) => {
  // Refs and state management
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isShuddering, setIsShuddering] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([radius, 0, 0]);
  const [shouldPulse, setShouldPulse] = useState(false);
  const time = useRef<number>(Math.random() * 100);

  // Spring animation for scale
  const { scale } = useSpring({
    scale: shouldPulse ? 1.3 : hovered ? 1.1 : 1,
    config: shouldPulse ? { tension: 100, friction: 10 } : config.wobbly,
  });

  // Spring animation for position
  const { position: springPosition } = useSpring({
    position: isOrbiting ? position : staticPosition,
    config: { tension: 120, friction: 14 },
  });

  /**
   * Effect hook to handle pulsing animation
   * Triggers a double pulse animation after 10 seconds
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPulse(true);
      setTimeout(() => {
        setShouldPulse(false);
        setTimeout(() => {
          setShouldPulse(true);
          setTimeout(() => {
            setShouldPulse(false);
          }, 250);
        }, 250);
      }, 250);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Spring animation for shuddering effect
  const { rotation } = useSpring({
    rotation: isShuddering ? [0.2, 0.2, 0.2] : [0, 0, 0],
    config: {
      mass: 1,
      tension: 200,
      friction: 10,
      precision: 0.001,
    },
  });

  /**
   * Frame update handler for orbital motion and rotation
   */
  useFrame(() => {
    if (isOrbiting) {
      time.current += 0.01;
      const x = Math.cos(time.current * speed) * radius;
      const y = 0;
      const z = Math.sin(time.current * speed) * radius;
      setPosition([x, y, z]);

      if (meshRef.current && !isShuddering) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
    } else {
      if(meshRef.current) {
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.y = 0;
      }
    }
  });

  /**
   * Click handler with shuddering animation
   */
  const handleClick = () => {
    setIsShuddering(true);
    onClick();

    setTimeout(() => {
      setIsShuddering(false);
    }, 150);
  };

  // Determine display text based on state and content
  const displayText = (hovered || shouldPulse || (!isOrbiting && !isNotMobile))
    ? text
    : text === 'About'
    ? 'ℹ️'
    : text === 'Skills'
    ? '🔧'
    : text === 'Experience'
    ? '💼'
    : text;

  return (
    <animated.group
      ref={meshRef}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      position={springPosition}
      rotation={rotation.get() as unknown as THREE.Euler}
    >
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4} castShadow>
        <meshStandardMaterial
          color={isActive ? '#ff6b6b' : hovered ? '#4dabf7' : '#228be6'}
          roughness={0.3}
          metalness={0.4}
        />
      </RoundedBox>
      {/* Text elements for each face of the box */}
      {/* Front */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>
      {/* Back */}
      <Text
        position={[0, 0, -0.51]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        {displayText}
      </Text>
      {/* Left */}
      <Text
        position={[-0.51, 0, 0]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        {displayText}
      </Text>
      {/* Right */}
      <Text
        position={[0.51, 0, 0]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
      >
        {displayText}
      </Text>
      {/* Top */}
      <Text
        position={[0, 0.51, 0]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {displayText}
      </Text>
      {/* Bottom */}
      <Text
        position={[0, -0.51, 0]}
        fontSize={hovered ? 0.15 : 0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        {displayText}
      </Text>
    </animated.group>
  );
};

export default Box;