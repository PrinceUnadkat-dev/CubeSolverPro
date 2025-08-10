import { useEffect, useRef } from "react";
import { CubeConfiguration } from "@/lib/cube-solver";

interface CubeVisualizerProps {
  configuration: CubeConfiguration;
  className?: string;
  autoRotate?: boolean;
  size?: { width: number; height: number };
}

export default function CubeVisualizer({ 
  configuration, 
  className = "", 
  autoRotate = true,
  size = { width: 320, height: 320 }
}: CubeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cubeRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();

  const getColorHex = (color: string): number => {
    const colors: Record<string, number> = {
      white: 0xffffff,
      yellow: 0xfbbf24,
      red: 0xef4444,
      orange: 0xf97316,
      blue: 0x3b82f6,
      green: 0x10b981
    };
    return colors[color] || 0xcccccc;
  };

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined' || !(window as any).THREE) return;

    const THREE = (window as any).THREE;
    const canvas = canvasRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(size.width, size.height);
    renderer.setClearColor(0xf1f5f9, 1);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create cube
    const cubeGroup = new THREE.Group();
    const cubeSize = 0.9;
    const gap = 0.1;

    // Create 27 small cubes (3x3x3)
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          
          // Default materials (gray)
          const materials = [
            new THREE.MeshLambertMaterial({ color: 0xcccccc }), // right
            new THREE.MeshLambertMaterial({ color: 0xcccccc }), // left  
            new THREE.MeshLambertMaterial({ color: 0xcccccc }), // top
            new THREE.MeshLambertMaterial({ color: 0xcccccc }), // bottom
            new THREE.MeshLambertMaterial({ color: 0xcccccc }), // front
            new THREE.MeshLambertMaterial({ color: 0xcccccc })  // back
          ];

          // Apply colors based on configuration and position
          const isVisibleFace = (face: string, x: number, y: number, z: number) => {
            switch (face) {
              case 'right': return x === 2;
              case 'left': return x === 0;
              case 'top': return y === 2;
              case 'bottom': return y === 0;
              case 'front': return z === 2;
              case 'back': return z === 0;
              default: return false;
            }
          };

          const getFaceIndex = (face: string, x: number, y: number, z: number) => {
            switch (face) {
              case 'right':
                return (2 - z) * 3 + (2 - y);
              case 'left':
                return z * 3 + (2 - y);
              case 'top':
                return z * 3 + x;
              case 'bottom':
                return (2 - z) * 3 + x;
              case 'front':
                return x * 3 + (2 - y);
              case 'back':
                return (2 - x) * 3 + (2 - y);
              default:
                return 0;
            }
          };

          // Apply face colors
          const faces = ['right', 'left', 'top', 'bottom', 'front', 'back'];
          faces.forEach((face, materialIndex) => {
            if (isVisibleFace(face, x, y, z)) {
              const faceIndex = getFaceIndex(face, x, y, z);
              const faceKey = face as keyof CubeConfiguration;
              if (configuration[faceKey] && configuration[faceKey][faceIndex]) {
                materials[materialIndex].color.setHex(getColorHex(configuration[faceKey][faceIndex]));
              }
            }
          });

          const smallCube = new THREE.Mesh(geometry, materials);
          smallCube.position.set(
            (x - 1) * (cubeSize + gap),
            (y - 1) * (cubeSize + gap),
            (z - 1) * (cubeSize + gap)
          );

          cubeGroup.add(smallCube);
        }
      }
    }

    cubeRef.current = cubeGroup;
    scene.add(cubeGroup);

    // Camera position
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (autoRotate && cubeRef.current) {
        cubeRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, [configuration, autoRotate, size.width, size.height]);

  const rotateCube = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!cubeRef.current) return;

    switch (direction) {
      case 'left':
        cubeRef.current.rotation.y -= Math.PI / 4;
        break;
      case 'right':
        cubeRef.current.rotation.y += Math.PI / 4;
        break;
      case 'up':
        cubeRef.current.rotation.x -= Math.PI / 4;
        break;
      case 'down':
        cubeRef.current.rotation.x += Math.PI / 4;
        break;
    }
  };

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-80 bg-slate-100 rounded-xl shadow-inner"
        width={size.width}
        height={size.height}
      />
      
      {/* Cube Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button 
          onClick={() => rotateCube('left')} 
          className="control-btn"
          aria-label="Rotate left"
        >
          <span>↶</span>
        </button>
        <button 
          onClick={() => rotateCube('right')} 
          className="control-btn"
          aria-label="Rotate right"
        >
          <span>↷</span>
        </button>
        <button 
          onClick={() => rotateCube('up')} 
          className="control-btn"
          aria-label="Rotate up"
        >
          <span>↑</span>
        </button>
        <button 
          onClick={() => rotateCube('down')} 
          className="control-btn"
          aria-label="Rotate down"
        >
          <span>↓</span>
        </button>
      </div>
    </div>
  );
}
