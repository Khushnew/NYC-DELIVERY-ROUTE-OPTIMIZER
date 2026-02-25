import { useState, useCallback } from 'react';
import type { Point, RouteResult, AlgorithmType } from '@/algorithms/tsp';
import { solveTSP, compareAlgorithms } from '@/algorithms/tsp';
import { NYCMap } from '@/components/NYCMap';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { ResultsPanel } from '@/components/ResultsPanel';
import { EducationalSection } from '@/components/EducationalSection';
import { 
  Truck, 
  Play, 
  RotateCcw, 
  BarChart3, 
  BookOpen,
  MapPin,
  Settings2,
  Github,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Toaster, toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function App() {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('2-opt');
  const [currentResult, setCurrentResult] = useState<RouteResult | null>(null);
  const [allResults, setAllResults] = useState<RouteResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComputing, setIsComputing] = useState(false);

  const handleAddPoint = useCallback((point: Point) => {
    setPoints(prev => [...prev, point]);
    toast.success(`Added ${point.name} at (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`);
  }, []);

  const handleRemovePoint = useCallback((id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
    setCurrentResult(null);
    toast.info('Delivery stop removed');
  }, []);

  const handleClearPoints = useCallback(() => {
    setPoints([]);
    setCurrentResult(null);
    setAllResults([]);
    toast.info('All stops cleared');
  }, []);

  const handleRunAlgorithm = useCallback(() => {
    if (points.length < 2) {
      toast.error('Add at least 2 delivery stops');
      return;
    }

    setIsComputing(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const result = solveTSP(points, selectedAlgorithm);
        setCurrentResult(result);
        
        // Also run comparison if we have few enough points
        if (points.length <= 15) {
          const comparisons = compareAlgorithms(points);
          setAllResults(comparisons);
        }
        
        toast.success(`Route optimized! Distance: ${result.distance.toFixed(2)} units`);
      } catch (error) {
        toast.error('Error running algorithm');
        console.error(error);
      } finally {
        setIsComputing(false);
      }
    }, 100);
  }, [points, selectedAlgorithm]);

  const handleCompareAll = useCallback(() => {
    if (points.length < 2) {
      toast.error('Add at least 2 delivery stops');
      return;
    }

    if (points.length > 15) {
      toast.warning('Too many points for comparison (max 15). Running selected algorithm only.');
      handleRunAlgorithm();
      return;
    }

    setIsComputing(true);
    
    setTimeout(() => {
      try {
        const comparisons = compareAlgorithms(points);
        setAllResults(comparisons);
        setCurrentResult(comparisons[0]); // Best result
        
        toast.success(`Compared ${comparisons.length} algorithms!`);
      } catch (error) {
        toast.error('Error comparing algorithms');
        console.error(error);
      } finally {
        setIsComputing(false);
      }
    }, 100);
  }, [points, handleRunAlgorithm]);

  const handleAnimate = useCallback(() => {
    if (!currentResult) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  }, [currentResult]);

  // Generate sample data
  const generateSampleData = useCallback(() => {
    const samplePoints: Point[] = [
      { id: 'sample-1', x: 50, y: 35, name: 'Manhattan Hub' },
      { id: 'sample-2', x: 65, y: 65, name: 'Brooklyn Stop 1' },
      { id: 'sample-3', x: 80, y: 35, name: 'Queens Stop 2' },
      { id: 'sample-4', x: 55, y: 15, name: 'Bronx Stop 3' },
      { id: 'sample-5', x: 25, y: 75, name: 'Staten Island Stop 4' },
      { id: 'sample-6', x: 60, y: 50, name: 'Brooklyn Stop 5' },
      { id: 'sample-7', x: 70, y: 25, name: 'Queens Stop 6' },
      { id: 'sample-8', x: 45, y: 45, name: 'Manhattan Stop 7' },
    ];
    
    setPoints(samplePoints);
    setCurrentResult(null);
    setAllResults([]);
    toast.success('Sample delivery route loaded!');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NYC Delivery Route Optimizer</h1>
                <p className="text-sm text-gray-500">Traveling Salesman Problem Solver</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>About NYC Delivery Route Optimizer</DialogTitle>
                    <DialogDescription>
                      A demonstration of the Traveling Salesman Problem and various optimization algorithms.
                    </DialogDescription>
                  </DialogHeader>
                  <EducationalSection />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://github.com/Khushnew/NYC-DELIVERY-OPTIMIZER" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Original
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{points.length}</div>
                    <div className="text-xs text-gray-500">Delivery Stops</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentResult ? currentResult.distance.toFixed(1) : '-'}
                    </div>
                    <div className="text-xs text-gray-500">Total Distance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Algorithm Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlgorithmSelector
                  selected={selectedAlgorithm}
                  onSelect={setSelectedAlgorithm}
                  pointCount={points.length}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleRunAlgorithm}
                  disabled={points.length < 2 || isComputing}
                >
                  {isComputing ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Computing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Algorithm
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleCompareAll}
                  disabled={points.length < 2 || isComputing}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare All
                </Button>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={generateSampleData}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Load Sample Route
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleClearPoints}
                  disabled={points.length === 0}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">How to Use</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click on the map to add delivery stops</li>
                  <li>Select an optimization algorithm</li>
                  <li>Click "Run Algorithm" to optimize</li>
                  <li>Compare results with different algorithms</li>
                  <li>Click "Animate Route" to visualize</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Center - Map */}
          <div className="lg:col-span-1">
            <Card className="h-full min-h-[500px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  NYC Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 h-[calc(100%-60px)]">
                <NYCMap
                  points={points}
                  path={currentResult?.path || null}
                  onAddPoint={handleAddPoint}
                  onRemovePoint={handleRemovePoint}
                  onClearPoints={handleClearPoints}
                  isAnimating={isAnimating}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-1">
            <div className="h-full min-h-[500px]">
              <ResultsPanel
                results={allResults}
                currentResult={currentResult}
                onAnimate={handleAnimate}
                isAnimating={isAnimating}
              />
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Understanding the Traveling Salesman Problem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EducationalSection />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>Inspired by AWS Delivery Routes Optimization Sample</p>
            <p>Built with React + TypeScript + Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
