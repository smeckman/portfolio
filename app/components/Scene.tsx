'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LightbulbIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '../data/content';
import Box from './Box';
import CameraAnimation from './CameraAnimation';
import CenteredName from './CenteredName';
import Ocean from './Ocean';
import PDFViewer from './PDFViewer';
import PlayJingle from './PlayJingle';
import Image from 'next/image';
import TerrainVisualization from './TerrainVisualization';

/**
 * Main scene component that orchestrates the 3D interactive portfolio
 * @component
 * @returns {JSX.Element} Rendered scene component
 */
const Scene: React.FC = () => {
  /**
   * State for responsive design and mobile detection
   */
  const [isNotMobile, setisNotMobile] = useState<boolean>(
    typeof window === 'undefined' || window.matchMedia("(min-width: 512px)").matches
  );
  const [matches, setMatches] = useState<boolean>(
    typeof window === 'undefined' || window.matchMedia("(min-width: 512px)").matches
  );

  /**
   * State for component behavior and animation control
   */
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isIntroFinished, setIntroFinished] = useState<boolean>(false);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true);

  /**
   * Refs for DOM elements
   */
  const detailsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  /**
   * Configuration for interactive sections
   */
  const sections = [
    { id: 'about', text: 'About', radius: 5, speed: 0.5 },
    { id: 'experience', text: 'Experience', radius: 4, speed: 0.3 },
    { id: 'skills', text: 'Skills', radius: 6, speed: 0.7 },
  ];

  /**
   * Effect hook to handle media queries, click outside detection,
   * escape key press, and orbital animation timeout
   */
  useEffect(() => {
    // Media query listener for responsive design
    window.matchMedia("(min-width: 512px)")
      .addEventListener('change', e => setMatches(e.matches));
      
    /**
     * Handler for clicks outside the active section
     * @param {MouseEvent} event - Click event
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node) &&
        canvasRef.current &&
        !canvasRef.current.contains(event.target as Node)
      ) {
        setActiveSection(null);
      }
    };

    /**
     * Handler for escape key press
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSection(null);
      }
    };

    // Timer to stop orbital animation after 15 seconds
    const timer = setTimeout(() => {
      setIsOrbiting(false);
    }, 15000);

    // Event listeners setup
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-100" role="main" aria-label="Interactive 3D Portfolio">
      {/* Mobile rotation prompt */}
      {!matches ? (
        <div role="alert" aria-live="polite">
          <Image src="https://smeckman.github.io/resources/rotatephone.gif"
                 alt="Please rotate your phone to landscape mode for better viewing"
                 width={0}
                 height={0}
                 sizes="100vw"
                 style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ) : (
        <div>
          {/* Audio control button */}
          {isIntroFinished ? (
            <PlayJingle setIntroFinished={setIntroFinished}
                        setIsOrbiting={setIsOrbiting}
            />
          ) : null
          }

          {/* Animation control button */}
          <button
            onClick={() => setIsOrbiting(!isOrbiting)}
            className="fixed top-4 right-4 z-50 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white/100 transition-colors"
            aria-label={isOrbiting ? "Stop animation" : "Start animation"}
            aria-pressed={!isOrbiting}
          >
            {isOrbiting ? (
              <PauseIcon className="w-6 h-6 text-gray-800" aria-hidden="true" />
            ) : (
              <PlayIcon className="w-6 h-6 text-gray-800" aria-hidden="true" />
            )}
          </button>

          {/* 3D Scene Canvas */}
          <div ref={canvasRef}
               className="h-screen"
               role="region"
               aria-label="3D Interactive Scene"
             >
            <Canvas shadows>
              {/* Camera Controls when the intro is finished, otherwise show the */}
              {/* animated intro sequence */}
              {isIntroFinished ? (
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  minPolarAngle={0}
                  maxPolarAngle={Math.PI}
                  maxDistance={30}
                  minDistance={2}
                  enableDamping={true}
                  dampingFactor={0.05}
                />
              ) : (
                <CameraAnimation setIntroFinished={setIntroFinished} />
              )}

              {/* Scene Configuration */}
              <color attach="background" args={['#f7fafc']} />

              {/* Lighting Setup */}
              <ambientLight intensity={1} />
              <directionalLight
                position={[5, 10, 5]}
                intensity={2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
              />
              <pointLight position={[-5, 10, -5]} intensity={1} castShadow />

              {/* Scene Environment */}
              <fog attach="fog" args={['#f7fafc', 10, 25]} />

              {/* Scene Content */}
              <CenteredName />
              <Ocean />
              <TerrainVisualization />

              {/* Interactive Boxes */}
              {sections.map((section, index) => (
                <Box
                  key={section.id}
                  radius={section.radius}
                  speed={section.speed}
                  text={section.text}
                  isActive={activeSection === section.id}
                  isOrbiting={isOrbiting}
                  isNotMobile={isNotMobile}
                  staticPosition={[(index - 1) * 2.5, -2, 5]} // Horizontal alignment
                  onClick={() =>
                    setActiveSection((prev) =>
                      prev === section.id ? null : section.id
                    )
                  }
                />
              ))}
            </Canvas>
          </div>

          {/* Content Panels */}
          <AnimatePresence mode="wait">
            {activeSection && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white/90 text-gray-900 backdrop-blur-sm"
                role="dialog"
                aria-labelledby={`${activeSection}-title`}
              >
                <motion.div
                  ref={detailsRef}
                  className="relative max-w-2xl mx-auto p-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Close Button */}
                  <motion.button
                    onClick={() => setActiveSection(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close details"
                  >
                    <XIcon className="w-5 h-5" aria-hidden="true" />
                  </motion.button>

                  {/* About Section Content */}
                  {activeSection === 'about' && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      role="article"
                    >
                      <h2 id="about-title" className="text-2xl font-bold mb-4">
                        {content.about.title}
                      </h2>
                      <p>{content.about.description}</p>
                    </motion.div>
                  )}

                  {/* Experience Section Content */}
                  {activeSection === 'experience' && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      role="article"
                    >
                      <h2 id="experience-title" className="text-2xl font-bold mb-4">
                        {content.experience.title}
                      </h2>
                      <div className="text-xl">Click for resume: <PDFViewer /></div>
                    </motion.div>
                  )}

                  {/* Skills Section Content */}
                  {activeSection === 'skills' && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      role="article"
                    >
                      <h2 id="skills-title" className="text-2xl font-bold mb-4 flex items-center gap-2">
                        {content.skills.title}{' '}
                        <LightbulbIcon className="w-6 h-6 text-yellow-500" aria-hidden="true" />
                      </h2>
                      <div className="grid grid-cols-3 gap-4"
                           role="list"
                           aria-label="Skills categories"
                      >
                        {content.skills.categories.map((category, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-gray-50/80 p-4 rounded-lg shadow-sm"
                            role="listitem"
                          >
                            <h3 className="font-semibold">{category.category}</h3>
                            <p className="text-sm text-gray-600">
                              {category.items
                              .map(
                                (item, index) => item.url
                                  ? (
                                    <a className="text-blue-800 hover:text-blue-500"
                                       href={item.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       key="{item.text}"
                                       aria-label={`${item.text} (opens in new tab)`}
                                    >
                                      {item.text}
                                      {index < category.items.length - 1 ? ', ' : ''}
                                    </a>
                                  ) : (
                                    <span key={item.text}>
                                      {item.text}
                                      {index < category.items.length - 1 ? ', ' : ''}
                                    </span>
                                  )
                              )}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Scene;