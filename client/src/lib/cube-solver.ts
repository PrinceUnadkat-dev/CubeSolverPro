import { CubeColor, CubeFace } from "@shared/schema";

export interface CubeConfiguration {
  front: CubeColor[];
  right: CubeColor[];
  back: CubeColor[];
  left: CubeColor[];
  top: CubeColor[];
  bottom: CubeColor[];
}

export interface CubeMove {
  notation: string;
  description: string;
}

// Basic cube solving algorithm (simplified implementation)
// In a real application, you would use a proper cube solving algorithm like CFOP or Kociemba
export function solveCube(configuration: CubeConfiguration): string[] {
  // This is a simplified mock implementation
  // A real cube solver would analyze the configuration and return optimal moves
  
  const mockMoves = [
    "R", "U", "R'", "U'", "F", "R", "F'", "R'",
    "U", "R", "U'", "R'", "F", "R", "F'",
    "R", "U", "R'", "U'", "R", "U", "R'",
    "F", "R", "U", "R'", "U'", "F'"
  ];
  
  // Return a random subset of moves to simulate solving
  const numMoves = Math.floor(Math.random() * 15) + 10; // 10-25 moves
  return mockMoves.slice(0, numMoves);
}

export function getMoveDescription(move: string): string {
  const moveDescriptions: Record<string, string> = {
    "R": "Rotate right face clockwise",
    "R'": "Rotate right face counter-clockwise",
    "R2": "Rotate right face 180 degrees",
    "L": "Rotate left face clockwise",
    "L'": "Rotate left face counter-clockwise",
    "L2": "Rotate left face 180 degrees",
    "U": "Rotate top face clockwise",
    "U'": "Rotate top face counter-clockwise",
    "U2": "Rotate top face 180 degrees",
    "D": "Rotate bottom face clockwise",
    "D'": "Rotate bottom face counter-clockwise",
    "D2": "Rotate bottom face 180 degrees",
    "F": "Rotate front face clockwise",
    "F'": "Rotate front face counter-clockwise",
    "F2": "Rotate front face 180 degrees",
    "B": "Rotate back face clockwise",
    "B'": "Rotate back face counter-clockwise",
    "B2": "Rotate back face 180 degrees",
  };
  
  return moveDescriptions[move] || "Unknown move";
}

export function generateRandomConfiguration(): CubeConfiguration {
  const colors: CubeColor[] = ["white", "yellow", "red", "orange", "blue", "green"];
  const faces: CubeFace[] = ["front", "right", "back", "left", "top", "bottom"];
  
  const configuration: any = {};
  faces.forEach(face => {
    configuration[face] = Array(9).fill(0).map(() => 
      colors[Math.floor(Math.random() * colors.length)]
    );
  });
  
  return configuration as CubeConfiguration;
}
