import { useState, useEffect } from "react";
import { CubeColor, CubeFace, cubeColors } from "@shared/schema";

interface FaceInputProps {
  currentFace: number;
  cubeData: Record<CubeFace, (CubeColor | null)[]>;
  onFaceChange: (face: CubeFace, index: number, color: CubeColor) => void;
  onNavigate: (direction: number) => void;
}

const faces: CubeFace[] = ["front", "right", "back", "left", "top", "bottom"];
const faceNames = ["Front", "Right", "Back", "Left", "Top", "Bottom"];

export default function FaceInput({ currentFace, cubeData, onFaceChange, onNavigate }: FaceInputProps) {
  const [selectedColor, setSelectedColor] = useState<CubeColor | null>(null);
  const [animating, setAnimating] = useState(false);

  const currentFaceName = faces[currentFace];
  const currentFaceDisplayName = faceNames[currentFace];

  const getColorStyle = (color: CubeColor): React.CSSProperties => {
    const colorStyles: Record<CubeColor, React.CSSProperties> = {
      white: { backgroundColor: '#ffffff', border: '2px solid #e2e8f0' },
      yellow: { backgroundColor: '#fbbf24' },
      red: { backgroundColor: '#ef4444' },
      orange: { backgroundColor: '#f97316' },
      blue: { backgroundColor: '#3b82f6' },
      green: { backgroundColor: '#10b981' }
    };
    return colorStyles[color];
  };

  const handleSquareClick = (index: number) => {
    if (!selectedColor) return;
    onFaceChange(currentFaceName, index, selectedColor);
  };

  const isFaceComplete = (face: CubeFace): boolean => {
    return cubeData[face].every(color => color !== null);
  };

  const handleNavigate = (direction: number) => {
    setAnimating(true);
    setTimeout(() => {
      onNavigate(direction);
      setAnimating(false);
    }, 200);
  };

  const canNavigateNext = () => {
    if (currentFace === faces.length - 1) {
      return faces.every(face => isFaceComplete(face));
    }
    return isFaceComplete(currentFaceName);
  };

  useEffect(() => {
    // Auto-select first color if none selected
    if (!selectedColor) {
      setSelectedColor('white');
    }
  }, [selectedColor]);

  return (
    <div className="face-input-container">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Color the <span className="text-blue-600 font-bold">{currentFaceDisplayName}</span> Face
      </h3>
      
      {/* Face Progress */}
      <div className="face-progress mb-6">
        <div className="flex justify-center space-x-2 mb-4">
          {faces.map((face, index) => (
            <span 
              key={face}
              className={`face-indicator ${
                index === currentFace ? 'active' : 
                isFaceComplete(face) ? 'completed' : ''
              }`}
              data-face={face}
            >
              {face.charAt(0).toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="color-palette mb-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Select Color:</h4>
        <div className="grid grid-cols-3 gap-3">
          {cubeColors.map((color) => (
            <button
              key={color}
              className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
              style={getColorStyle(color)}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
      </div>

      {/* Face Grid */}
      <div className={`face-grid mb-6 transition-all duration-200 ${animating ? 'opacity-50 scale-95' : ''}`}>
        <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
          {Array(9).fill(0).map((_, index) => {
            const color = cubeData[currentFaceName][index];
            return (
              <div
                key={index}
                className={`face-square ${color ? 'filled' : ''}`}
                style={color ? getColorStyle(color) : {}}
                onClick={() => handleSquareClick(index)}
                data-position={index}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button 
          className="nav-btn secondary"
          onClick={() => handleNavigate(-1)}
          disabled={currentFace === 0}
        >
          Previous
        </button>
        <button 
          className="nav-btn primary"
          onClick={() => handleNavigate(1)}
          disabled={!canNavigateNext()}
        >
          {currentFace === faces.length - 1 ? 'Solve Cube' : 'Next Face'}
        </button>
      </div>
    </div>
  );
}
