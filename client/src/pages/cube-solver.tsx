import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { solveCube, generateRandomCube, type CubeConfiguration, type CubeSolution } from "@/lib/cube-solver-local";
import { ArrowRight, ArrowLeft, RotateCcw, Download, Check, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppStep = 'color-input' | 'solving' | 'solution';
type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export default function CubeSolver() {
  const [currentStep, setCurrentStep] = useState<AppStep>('color-input');
  const [currentFace, setCurrentFace] = useState(0);
  const [selectedColor, setSelectedColor] = useState<CubeColor>('white');
  const [animatingFace, setAnimatingFace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cubeData, setCubeData] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    const faceNames = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    faceNames.forEach(face => {
      initial[face] = Array(9).fill('');
    });
    return initial;
  });
  const [solution, setSolution] = useState<CubeSolution | null>(null);
  const { toast } = useToast();

  const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
  const faceNames = ['Front Face', 'Right Face', 'Back Face', 'Left Face', 'Top Face', 'Bottom Face'];
  const colors: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

  const handleSolveCube = async () => {
    if (!isAllFacesComplete()) {
      toast({
        title: "Incomplete Configuration",
        description: "Please complete all cube faces before solving",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentStep('solving');
    
    try {
      const solution = await solveCube(cubeData as CubeConfiguration);
      setSolution(solution);
      setCurrentStep('solution');
      toast({
        title: "Solution Found!",
        description: `Solved in ${solution.totalMoves} moves`,
      });
    } catch (error) {
      toast({
        title: "Solving Error",
        description: "Failed to solve the cube. Please check your configuration.",
        variant: "destructive",
      });
      setCurrentStep('color-input');
    } finally {
      setIsLoading(false);
    }
  };

  const getColorStyle = (color: string): React.CSSProperties => {
    const colorStyles: Record<string, React.CSSProperties> = {
      white: { backgroundColor: '#ffffff', border: '2px solid #e2e8f0' },
      yellow: { backgroundColor: '#fbbf24', border: '2px solid #f59e0b' },
      red: { backgroundColor: '#ef4444', border: '2px solid #dc2626' },
      orange: { backgroundColor: '#f97316', border: '2px solid #ea580c' },
      blue: { backgroundColor: '#3b82f6', border: '2px solid #2563eb' },
      green: { backgroundColor: '#10b981', border: '2px solid #059669' }
    };
    return colorStyles[color];
  };

  const handleSquareClick = (index: number) => {
    const currentFaceName = faces[currentFace];
    setCubeData(prev => ({
      ...prev,
      [currentFaceName]: prev[currentFaceName].map((c, i) => i === index ? selectedColor : c)
    }));
  };

  const isFaceComplete = (faceIndex: number) => {
    return cubeData[faces[faceIndex]].every(color => color !== '');
  };

  const isAllFacesComplete = () => {
    return Object.values(cubeData).every(face => 
      face.every(color => color !== '')
    );
  };

  const handleNextFace = () => {
    if (!isFaceComplete(currentFace)) return;
    
    if (currentFace < faces.length - 1) {
      setAnimatingFace(true);
      setTimeout(() => {
        setCurrentFace(prev => prev + 1);
        setAnimatingFace(false);
      }, 300);
    } else if (isAllFacesComplete()) {
      handleSolveCube();
    }
  };

  const handlePrevFace = () => {
    if (currentFace > 0) {
      setAnimatingFace(true);
      setTimeout(() => {
        setCurrentFace(prev => prev - 1);
        setAnimatingFace(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentStep('color-input');
    setCurrentFace(0);
    setSolution(null);
    
    const resetCubeData: Record<string, string[]> = {};
    faces.forEach(face => {
      resetCubeData[face] = Array(9).fill('');
    });
    setCubeData(resetCubeData);
  };

  const handleExport = () => {
    if (!solution) return;
    
    const exportData = {
      moves: solution.moves,
      totalMoves: solution.totalMoves,
      solvingTime: solution.solvingTime,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rubiks-solution-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Solution Exported",
      description: "Solution has been downloaded as JSON file",
    });
  };

  const handleGenerateRandom = () => {
    const randomConfig = generateRandomCube();
    setCubeData(randomConfig);
    toast({
      title: "Random Configuration Generated",
      description: "A random cube configuration has been created for you to solve",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-100 text-center">Rubik's Cube Solver</h1>
          <p className="text-slate-300 text-center mt-2">Follow the steps to solve your cube</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex flex-col items-center ${currentStep === 'color-input' ? 'text-blue-500' : currentStep === 'solving' || currentStep === 'solution' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep === 'color-input' ? 'bg-blue-500 text-white' : currentStep === 'solving' || currentStep === 'solution' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {currentStep === 'solving' || currentStep === 'solution' ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium mt-2">Select Colors</span>
            </div>
            
            <div className={`h-0.5 w-16 ${currentStep === 'solving' || currentStep === 'solution' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'solving' ? 'text-blue-500' : currentStep === 'solution' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep === 'solving' ? 'bg-blue-500 text-white' : currentStep === 'solution' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {currentStep === 'solution' ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium mt-2">Solve Cube</span>
            </div>
            
            <div className={`h-0.5 w-16 ${currentStep === 'solution' ? 'bg-green-500' : 'bg-slate-600'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep === 'solution' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep === 'solution' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                3
              </div>
              <span className="text-sm font-medium mt-2">View Solution</span>
            </div>
          </div>
        </div>

        {/* Color Input Section */}
        {currentStep === 'color-input' && (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-100 mb-2">
                Color the {faceNames[currentFace]}
              </h2>
              <p className="text-slate-300">
                Select a color and click on the squares to color the current face
              </p>
              
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleGenerateRandom} 
                  variant="outline" 
                  className="text-sm"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Generate Random Cube
                </Button>
              </div>
            </div>

            {/* Face Progress Indicators */}
            <div className="flex justify-center space-x-3 mb-8">
              {faces.map((_, index) => (
                <div key={index} className="text-center">
                  <div 
                    className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      index === currentFace 
                        ? 'bg-blue-500 text-white ring-2 ring-blue-400' 
                        : isFaceComplete(index) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {faces[index].charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{faces[index]}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Color Palette */}
              <div className="order-2 lg:order-1">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Select Color</h3>
                <div className="grid grid-cols-3 gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-16 h-16 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md ${
                        selectedColor === color ? 'ring-4 ring-slate-800 scale-105' : ''
                      }`}
                      style={getColorStyle(color)}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
                <div className="text-center mt-4">
                  <span className="text-sm text-slate-300 capitalize">Selected: {selectedColor}</span>
                </div>
              </div>

              {/* Face Grid */}
              <div className="order-1 lg:order-2">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  {faceNames[currentFace]}
                </h3>
                <div className={`transition-all duration-300 ${animatingFace ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                  <div className="grid grid-cols-3 gap-2 max-w-64 mx-auto bg-slate-700 p-4 rounded-xl">
                    {Array(9).fill(0).map((_, index) => {
                      const color = cubeData[faces[currentFace]][index];
                      return (
                        <div
                          key={index}
                          className={`w-16 h-16 border-2 border-slate-600 rounded-md cursor-pointer transition-all duration-200 hover:border-blue-400 ${
                            color ? 'border-slate-300' : 'bg-slate-600'
                          }`}
                          style={color ? getColorStyle(color) : {}}
                          onClick={() => handleSquareClick(index)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                onClick={handlePrevFace}
                disabled={currentFace === 0}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-slate-400">
                  Face {currentFace + 1} of {faces.length}
                </span>
              </div>
              
              <Button 
                onClick={handleNextFace}
                disabled={!isFaceComplete(currentFace)}
                className="flex items-center space-x-2"
              >
                <span>{currentFace === faces.length - 1 ? 'Solve Cube' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Solving Section */}
        {currentStep === 'solving' && (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700 animate-fade-in">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-xl animate-spin" style={{
                background: 'linear-gradient(45deg, #3b82f6, #10b981, #f59e0b, #ef4444, #8b5cf6, #06b6d4)'
              }}></div>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Solving Your Cube...</h2>
              <p className="text-slate-300 mb-6">Calculating the optimal solution</p>
              <div className="w-full max-w-md mx-auto h-2 bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                    animation: 'progress 3s ease-out forwards'
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Solution Section */}
        {currentStep === 'solution' && solution && (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700 animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-100 mb-6 text-center">Solution Complete!</h2>
            
            {/* Solution Stats */}
            <div className="flex justify-center gap-8 mb-8 p-6 bg-slate-700 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{solution.totalMoves}</div>
                <div className="text-sm text-slate-300">Total Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{solution.solvingTime.toFixed(1)}s</div>
                <div className="text-sm text-slate-300">Solving Time</div>
              </div>
            </div>

            {/* Solution Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Step-by-Step Solution:</h3>
              <div className="grid gap-2 max-h-80 overflow-y-auto">
                {solution.moves.map((move: string, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-slate-700 rounded-lg border-l-4 border-blue-500 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-slate-100 mr-2">{move}</span>
                    <span className="text-slate-300 text-sm">
                      {move.includes("'") ? "Counter-clockwise" : "Clockwise"} rotation
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleRestart}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Solve Another Cube</span>
              </Button>
              <Button 
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Solution</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}