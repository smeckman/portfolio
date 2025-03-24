import { Text } from '@react-three/drei';
import { content } from '../data/content';

/**
 * Component that renders a centered 3D text displaying the name
 * @component
 * @returns {JSX.Element} Rendered text component
 */
const CenteredName: React.FC = () => {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={1.5}
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjQ.ttf"
      color="#1a202c"
      anchorX="center"
      anchorY="middle"
      letterSpacing={-0.1}
      strokeWidth={0.25}
      strokeColor="#000000"
      fontWeight={700}
    >
      {content.name}
    </Text>
  );
};

export default CenteredName;
