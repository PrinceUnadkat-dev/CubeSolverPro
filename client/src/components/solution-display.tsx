import { useState } from "react";
import { getMoveDescription } from "@/lib/cube-solver";
import CubeVisualizer from "./cube-visualizer";
import { CubeConfiguration } from "@/lib/cube-solver";

interface SolutionDisplayProps {
  solution: {
    moves: string[];
    totalMoves: number;
    solvingTime: number;
  };
  originalConfiguration: CubeConfiguration;
  onRestart: () => void;
  onExport: () => void;
}

export default function SolutionDisplay({ 
  solution, 
  originalConfiguration, 
  onRestart, 
  onExport 
}: SolutionDisplayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Generate solved configuration (all faces same color)
  const solvedConfiguration: CubeConfiguration = {
    front: Array(9).fill('green'),
    right: Array(9).fill('orange'),
    back: Array(9).fill('blue'),
    left: Array(9).fill('red'),
    top: Array(9).fill('yellow'),
    bottom: Array(9).fill('white')
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Solution Steps */}
      <div>
        <div className="solution-stats mb-6">
          <div className="stat-item">
            <span className="stat-label">Total Moves:</span>
            <span className="stat-value">{solution.totalMoves}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Solving Time:</span>
            <span className="stat-value">{solution.solvingTime.toFixed(1)}s</span>
          </div>
        </div>
        
        <div className="solution-steps">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Step-by-Step Solution:</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {solution.moves.map((move, index) => (
              <div 
                key={index}
                className={`solution-step cursor-pointer transition-all duration-200 ${
                  currentStep === index ? 'ring-2 ring-primary ring-opacity-50 bg-blue-50' : 'hover:bg-slate-100'
                }`}
                onClick={() => handleStepClick(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="step-number-badge">{index + 1}</div>
                <span className="step-move">{move}</span>
                <span className="step-description">{getMoveDescription(move)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Cube State */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Solved Cube</h3>
        <CubeVisualizer 
          configuration={solvedConfiguration}
          autoRotate={true}
          size={{ width: 320, height: 320 }}
        />
        
        <div className="mt-6 space-y-3">
          <button 
            onClick={onRestart}
            className="nav-btn primary w-full"
          >
            Solve Another Cube
          </button>
          <button 
            onClick={onExport}
            className="nav-btn secondary w-full"
          >
            Export Solution
          </button>
        </div>
      </div>
    </div>
  );
}
