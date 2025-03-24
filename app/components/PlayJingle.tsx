import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Volume2Icon } from 'lucide-react';

/**
 * Props interface for the PlayJingle component
 * @interface PlayJingleProps
 * @property {Dispatch<SetStateAction<boolean>>} setIntroFinished - Callback to update intro state
 * @property {Dispatch<SetStateAction<boolean>>} setIsOrbiting - Callback to update orbiting state
 */
type PlayJingleProps = {
  setIntroFinished: Dispatch<SetStateAction<boolean>>;
  setIsOrbiting: Dispatch<SetStateAction<boolean>>;
};

/**
 * Component for playing and controlling background music
 * @component
 * @param {PlayJingleProps} props - Component properties
 * @returns {JSX.Element} Rendered audio control component
 */
const PlayJingle: React.FC<PlayJingleProps> = ({
    setIntroFinished,
    setIsOrbiting
  }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  /**
   * Effect hook to initialize audio element
   */
  useEffect(() => {
    audioRef.current = new Audio('https://smeckman.github.io/resources/resume-jingle.mp3');
    audioRef.current.loop = false;
    audioRef.current.volume = 0.4;
  }, []);

  /**
   * Toggle audio playback and update related states
   */
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        setIntroFinished(false);
        setIsOrbiting(true);
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white/100 transition-colors"
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
    >
      <Volume2Icon className="w-6 h-6 text-gray-800" />
    </button>
  );
};

export default PlayJingle;
