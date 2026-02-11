import type { RouteResult } from '@/algorithms/tsp';
import { 
  Trophy, 
  Clock, 
  Route, 
  BarChart3,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ResultsPanelProps {
  results: RouteResult[];
  currentResult: RouteResult | null;
  onAnimate: () => void;
  isAnimating: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  currentResult,
  onAnimate,
  isAnimating
}) => {
  if (results.length === 0 && !currentResult) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Route className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Results Yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add delivery stops and run an algorithm to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  const allResults = currentResult ? [currentResult, ...results.filter(r => r.algorithm !== currentResult.algorithm)] : results;
  
  // Find best result by distance
  const bestResult = allResults.reduce((best, current) => 
    current.distance < best.distance ? current : best
  , allResults[0]);

  const formatDistance = (d: number) => `${d.toFixed(2)} units`;
  const formatTime = (ms: number) => ms < 1 ? '< 1ms' : `${ms.toFixed(1)}ms`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Results Comparison
          </CardTitle>
          {currentResult && (
            <Button
              size="sm"
              onClick={onAnimate}
              disabled={isAnimating}
              variant={isAnimating ? "secondary" : "default"}
            >
              {isAnimating ? 'Animating...' : 'Animate Route'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Current Result Highlight */}
        {currentResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Current Solution</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-600">Algorithm</p>
                <p className="text-sm font-medium text-blue-900">{currentResult.algorithm}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Total Distance</p>
                <p className="text-sm font-medium text-blue-900">{formatDistance(currentResult.distance)}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Compute Time</p>
                <p className="text-sm font-medium text-blue-900">{formatTime(currentResult.timeMs)}</p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Comparison Table */}
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {allResults.map((result, index) => {
              const isBest = result.distance === bestResult.distance;
              const isCurrent = currentResult?.algorithm === result.algorithm;
              
              return (
                <div
                  key={`${result.algorithm}-${index}`}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${isBest ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}
                    ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{result.algorithm}</span>
                        {isBest && (
                          <Badge className="bg-green-500 text-white">
                            <Trophy className="w-3 h-3 mr-1" />
                            Best
                          </Badge>
                        )}
                        {isCurrent && !isBest && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Current
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Route className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDistance(result.distance)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatTime(result.timeMs)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Efficiency indicator */}
                      {result.distance > 0 && bestResult.distance > 0 && !isBest && (
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-amber-600">
                            {((result.distance / bestResult.distance - 1) * 100).toFixed(1)}% longer than optimal
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary Stats */}
        {allResults.length > 1 && (
          <>
            <Separator />
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Summary</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Algorithms tested:</span>
                  <span className="ml-2 font-medium">{allResults.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Best distance:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatDistance(bestResult.distance)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
