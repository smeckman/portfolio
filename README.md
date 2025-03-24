# Interactive 3D Portfolio

An [immersive, interactive 3D portfolio](https://smeckman.github.io) built with Next.js, Three.js, and React Three Fiber. This project showcases professional experience and skills through an engaging 3D interface with interactive elements and dynamic animations.

## Features

- **Interactive 3D Environment**: Fully interactive 3D scene with orbital controls and dynamic camera movements
- **Animated Components**: Floating boxes with orbital animations and interactive behaviors
- **Responsive Design**: Adapts to different screen sizes with mobile device support
- **PDF Resume Viewer**: Integrated PDF viewer for resume display
- **Accessibility**: WAI-ARIA compliant with full keyboard navigation support (Work in Progress, interactive Canvas elements do not support WAI-ARIA)
- **Background Music**: Optional dramatic movie trailer music
- **Real-time Weather Integration**: Dynamic terrain visualization based on current weather data

## Technologies Used

- **Framework**: Next.js 13.5
- **3D Graphics**:
  - Three.js
- **Animation**:
  - Framer Motion
  - React Spring
- **Styling**:
  - Tailwind CSS
- **Type Safety**: TypeScript
- **PDF Handling**: React-PDF
- **Weather Data**: Open-Meteo API

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Alternatively, using Docker, create an image:
   ```bash
   docker build -t portfolio .
   ```

6. Create a container from the image:
   ```bash
   docker run -d -p 8080:80 portfolio

7. Open [http://localhost:8080](http://localhost:8080) in your browser

### Building for Production

1. Create a production build:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
├── app/
│   ├── components/     # React components
│   ├── data/          # Content configuration
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── lib/
│   └── utils.ts       # Utility functions
├── public/            # Static assets
└── types/            # TypeScript type definitions
```

## Component Architecture

### Key Components

- **Scene.tsx**: Main 3D scene container
- **Box.tsx**: Interactive 3D boxes with orbital motion
- **Ocean.tsx**: Dynamic wave animation
- **TerrainVisualization.tsx**: Weather-based terrain generation
- **PDFViewer.tsx**: Modal PDF viewer for resume
- **CameraAnimation.tsx**: Intro camera sequence

## Configuration

Content can be customized by modifying `app/data/content.ts`:

- Personal information
- About section
- Skills and categories
- Experience details

## Accessibility

The application follows WAI-ARIA guidelines with:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Alternative text for visual elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Acknowledgments

- Three.js community
- React Three Fiber team
- Next.js team
- Open-Meteo API for weather data
