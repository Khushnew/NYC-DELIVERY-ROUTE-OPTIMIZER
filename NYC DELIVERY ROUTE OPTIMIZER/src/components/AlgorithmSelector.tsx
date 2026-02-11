import type { AlgorithmType } from '@/algorithms/tsp';
import { 
  Calculator, 
  Zap, 
  GitBranch, 
  Route, 
  Target,
  Clock,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlgorithmOption {
  value: AlgorithmType;
  label: string;
  description: string;
  complexity: string;
  accuracy: string;
  icon: React.ReactNode;
  color: string;
  bestFor: string;
}

const ALGORITHMS: AlgorithmOption[] = [
  {
    value: 'exact-dp',
    label: 'Exact DP (Held-Karp)',
    description: 'Dynamic programming solution that finds the optimal route. Guaranteed best result but exponential time complexity.',
    complexity: 'O(n² × 2ⁿ)',
    accuracy: 'Optimal',
    icon: <Calculator className="w-5 h-5" />,
    color: 'bg-green-500',
    bestFor: 'n ≤ 20 stops'
  },
  {
    value: 'nearest-neighbor',
    label: 'Nearest Neighbor',
    description: 'Greedy algorithm that always visits the closest unvisited stop. Fast but can produce suboptimal routes.',
    complexity: 'O(n²)',
    accuracy: '~25% above optimal',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-yellow-500',
    bestFor: 'Quick approximations'
  },
  {
    value: '2-opt',
    label: '2-Opt Local Search',
    description: 'Iteratively improves a route by swapping edges. Good balance between speed and quality.',
    complexity: 'O(n² × iter)',
    accuracy: '~5-10% above optimal',
    icon: <GitBranch className="w-5 h-5" />,
    color: 'bg-blue-500',
    bestFor: 'Medium-sized problems'
  },
  {
    value: 'christofides',
    label: 'Christofides',
    description: '1.5-approximation algorithm using MST and perfect matching. Theoretical guarantee for metric TSP.',
    complexity: 'O(n³)',
    accuracy: '≤ 1.5× optimal',
    icon: <Route className="w-5 h-5" />,
    color: 'bg-purple-500',
    bestFor: 'Metric TSP instances'
  },
  {
    value: 'astar',
    label: 'A* Pathfinding',
    description: 'Real-time pathfinding that avoids obstacles. Useful when considering traffic or road networks.',
    complexity: 'O(E + V log V)',
    accuracy: 'Optimal (per segment)',
    icon: <Target className="w-5 h-5" />,
    color: 'bg-orange-500',
    bestFor: 'Obstacle avoidance'
  }
];

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
  pointCount: number;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selected,
  onSelect,
  pointCount
}) => {
  const isDPLimited = pointCount > 20;

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Select Algorithm</h3>
          {isDPLimited && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
              <AlertCircle className="w-3 h-3 mr-1" />
              DP limited (n &gt; 20)
            </Badge>
          )}
        </div>
        
        <div className="grid gap-2">
          {ALGORITHMS.map((algo) => {
            const isDisabled = algo.value === 'exact-dp' && isDPLimited;
            const isSelected = selected === algo.value;
            
            return (
              <Tooltip key={algo.value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => !isDisabled && onSelect(algo.value)}
                    disabled={isDisabled}
                    className={`
                      relative flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {/* Algorithm icon */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white
                      ${algo.color}
                    `}>
                      {algo.icon}
                    </div>
                    
                    {/* Algorithm info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{algo.label}</span>
                        {isSelected && (
                          <Badge className="bg-blue-500 text-white text-xs">Selected</Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {algo.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{algo.complexity}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <TrendingDown className="w-3 h-3" />
                          <span>{algo.accuracy}</span>
                        </div>
                      </div>
                      
                      {/* Best for badge */}
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Best for: {algo.bestFor}
                        </Badge>
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">{algo.label}</p>
                    <p className="text-sm">{algo.description}</p>
                    <div className="text-xs text-gray-400">
                      <p>Time Complexity: {algo.complexity}</p>
                      <p>Accuracy: {algo.accuracy}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AlgorithmSelector;
