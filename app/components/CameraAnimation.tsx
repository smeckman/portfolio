import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSpring } from '@react-spring/three';
import { useFrame } from '@react-three/fiber';

/**
 * Props interface for the CameraAnimation component
 * @interface CameraAnimationProps
 * @property {Dispatch<SetStateAction<boolean>>} setIntroFinished - Callback to signal animation completion
 */
type CameraAnimationProps = {
  setIntroFinished: Dispatch<SetStateAction<boolean>>;
};

/**
 * Component that handles the initial camera animation sequence
 * @component
 * @param {CameraAnimationProps} props - Component properties
 * @returns {null} This component doesn't render any visible elements
 */
const CameraAnimation: React.FC<CameraAnimationProps> = ({
  setIntroFinished,
}) => {
  // Define camera animation positions
  const startPosition = [0, 30, 0];
  const endPosition = [0, -2, 10];

  // Spring animation configuration
  const [{ cameraPosition }, api] = useSpring(() => ({
    cameraPosition: startPosition,
    config: {
      mass: 1,
      tension: 20,
      friction: 30,
    },
    onRest: (result) => {
      if (result.finished) {
        setIntroFinished(true);
      }
    },
  }));

  /**
   * Effect hook to start the camera animation
   */
  useEffect(() => {
    api.start({
      cameraPosition: endPosition,
    });
  }, [api]);

  /**
   * Frame update handler for camera position and orientation
   */
  useFrame(({ camera }) => {
    const [x, y, z] = cameraPosition.get();
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default CameraAnimation;
