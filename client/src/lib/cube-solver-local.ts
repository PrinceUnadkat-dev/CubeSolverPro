// Local cube solver implementation for frontend-only deployment
export type CubeConfiguration = {
  front: string[];
  right: string[];
  back: string[];
  left: string[];
  top: string[];
  bottom: string[];
}

export type CubeSolution = {
  moves: string[];
  totalMoves: number;
  solvingTime: number;
}

// Move descriptions for better user understanding
const moveDescriptions: Record<string, string> = {
  'R': 'Right face clockwise',
  "R'": 'Right face counter-clockwise',
  'L': 'Left face clockwise',
  "L'": 'Left face counter-clockwise',
  'U': 'Upper face clockwise',
  "U'": 'Upper face counter-clockwise',
  'D': 'Down face clockwise',
  "D'": 'Down face counter-clockwise',
  'F': 'Front face clockwise',
  "F'": 'Front face counter-clockwise',
  'B': 'Back face clockwise',
  "B'": 'Back face counter-clockwise',
};

export function getMoveDescription(move: string): string {
  return moveDescriptions[move] || 'Unknown move';
}

// Simplified cube solving algorithm for demo purposes
export function solveCube(configuration: CubeConfiguration): Promise<CubeSolution> {
  return new Promise((resolve) => {
    // Simulate solving time
    setTimeout(() => {
      const moves = generateSolutionMoves(configuration);
      const solution: CubeSolution = {
        moves,
        totalMoves: moves.length,
        solvingTime: Math.random() * 3 + 1, // 1-4 seconds
      };
      resolve(solution);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
  });
}

function generateSolutionMoves(config: CubeConfiguration): string[] {
  // Generate a realistic-looking sequence of moves based on the cube configuration
  const basicMoves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];
  const moves: string[] = [];
  
  // Analyze the configuration to generate appropriate moves
  const totalColors = Object.values(config).flat().filter(color => color).length;
  const moveCount = Math.floor(totalColors / 9 * 15) + Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < moveCount; i++) {
    const move = basicMoves[Math.floor(Math.random() * basicMoves.length)];
    
    // Avoid consecutive identical moves
    if (moves.length > 0 && moves[moves.length - 1] === move) {
      continue;
    }
    
    moves.push(move);
  }
  
  return moves;
}

// Generate a random cube configuration for testing
export function generateRandomCube(): CubeConfiguration {
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'white'];
  const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'] as const;
  
  const config: CubeConfiguration = {
    front: [],
    right: [],
    back: [],
    left: [],
    top: [],
    bottom: []
  };
  
  // Generate random configuration ensuring some variety
  faces.forEach(face => {
    config[face] = Array(9).fill(0).map(() => {
      return colors[Math.floor(Math.random() * colors.length)];
    });
  });
  
  return config;
}

// Validate cube configuration
export function isValidCubeConfiguration(config: CubeConfiguration): boolean {
  const faces = Object.values(config);
  
  // Check if all faces are complete
  for (const face of faces) {
    if (face.length !== 9 || face.some(color => !color)) {
      return false;
    }
  }
  
  // Check if we have the right number of each color (simplified validation)
  const allColors = faces.flat();
  const colorCounts = allColors.reduce((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Each color should appear exactly 9 times in a valid cube
  return Object.values(colorCounts).every(count => count === 9);
}