import { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Lightbulb, 
  Cpu, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Hash,
  GitBranch,
  Target,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export const EducationalSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Understanding the Problem</h2>
      </div>

      {/* For Everyone */}
      <CollapsibleSection 
        title="The Problem (Explain to Anyone)" 
        icon={<Lightbulb className="w-5 h-5 text-amber-500" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-800 font-medium">
              "When a delivery driver has 15 packages to deliver, what order should they visit the addresses to minimize driving time?"
            </p>
          </div>
          
          <p className="text-gray-700">
            This seemingly simple question is actually one of the most famous problems in computer science. 
            Every day, millions of delivery drivers, salespeople, and field service technicians face this challenge.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">$100B+</div>
              <p className="text-sm text-gray-600">Annual savings potential worldwide</p>
            </div>
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">30%</div>
              <p className="text-sm text-gray-600">Average distance reduction with optimization</p>
            </div>
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">15!</div>
              <p className="text-sm text-gray-600">Possible routes for 15 stops</p>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Why is this hard?</h4>
            <p className="text-blue-800 text-sm">
              With just 15 delivery stops, there are over <strong>1.3 trillion</strong> possible routes to consider! 
              Even with a supercomputer checking 1 billion routes per second, it would take 20 minutes to try them all. 
              With 25 stops, it would take longer than the age of the universe!
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* For Engineers */}
      <CollapsibleSection 
        title="The CS (Explain to Engineers)" 
        icon={<Code2 className="w-5 h-5 text-blue-500" />}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-800 font-mono text-sm">
              "This is the <strong>Traveling Salesman Problem (TSP)</strong> - NP-hard. 
              I implement multiple solutions: exact DP solution for small inputs (n≤20), 
              approximation algorithms (Christofides, 2-opt) for larger inputs, 
              and A* pathfinding for real-time routing."
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Complexity Analysis
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-red-600 border-red-300">NP-Hard</Badge>
                  <span className="font-medium">Brute Force</span>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">O(n!)</code>
                <p className="text-xs text-gray-600 mt-1">Check all permutations</p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-green-600 border-green-300">Exact</Badge>
                  <span className="font-medium">Held-Karp (DP)</span>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">O(n² × 2ⁿ)</code>
                <p className="text-xs text-gray-600 mt-1">Dynamic programming with bitmask</p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-300">1.5-approx</Badge>
                  <span className="font-medium">Christofides</span>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">O(n³)</code>
                <p className="text-xs text-gray-600 mt-1">MST + perfect matching</p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-300">Heuristic</Badge>
                  <span className="font-medium">2-Opt</span>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">O(n² × iter)</code>
                <p className="text-xs text-gray-600 mt-1">Local search improvement</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Algorithm Implementations
            </h4>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Exact DP (Held-Karp)</span>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`// State: dp[mask][i] = min distance to visit nodes in mask, end at i
// Transition: dp[mask][i] = min(dp[mask ^ (1<<i)][j] + dist[j][i])
// Time: O(n² × 2ⁿ), Space: O(n × 2ⁿ)

function heldKarp(points) {
  const n = points.length;
  const dp = new Map();
  
  // Base case: from start to each node
  for (let i = 1; i < n; i++) {
    dp.set(\`\${1 | (1<<i)},\${i}\`, dist(0, i));
  }
  
  // Build up subsets
  for (let mask = 0; mask < (1<<n); mask++) {
    for (let end = 0; end < n; end++) {
      if (!(mask & (1<<end))) continue;
      // Try all possible previous nodes
      for (let prev = 0; prev < n; prev++) {
        const newDist = dp.get(\`\${mask^(1<<end)},\${prev}\`) + dist(prev, end);
        dp.set(\`\${mask},\${end}\`, min(dp.get(\`\${mask},\${end}\`), newDist));
      }
    }
  }
  
  return dp.get(\`\${(1<<n)-1},\${n-1}\`);
}`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">2-Opt Local Search</span>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`// Iteratively improve by swapping edges
// If dist(i,i+1) + dist(j,j+1) > dist(i,j) + dist(i+1,j+1)
// Then reverse path from i+1 to j

function twoOpt(route) {
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const delta = -dist(i,i+1) - dist(j,j+1) 
                      + dist(i,j) + dist(i+1,j+1);
        if (delta < 0) { // Improvement found
          reverse(route, i+1, j);
          improved = true;
        }
      }
    }
  }
  return route;
}`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-sm">A* Pathfinding</span>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`// f(n) = g(n) + h(n)
// g(n): cost from start to n
// h(n): heuristic (Euclidean distance to goal)

function aStar(start, goal) {
  const openSet = new PriorityQueue((a,b) => a.f < b.f);
  const gScore = new Map();
  
  openSet.push({ node: start, f: heuristic(start, goal) });
  gScore.set(start, 0);
  
  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    
    if (current.node === goal) {
      return reconstructPath(current);
    }
    
    for (const neighbor of getNeighbors(current.node)) {
      const tentativeG = gScore.get(current.node) + dist(current.node, neighbor);
      
      if (tentativeG < (gScore.get(neighbor) || Infinity)) {
        gScore.set(neighbor, tentativeG);
        const f = tentativeG + heuristic(neighbor, goal);
        openSet.push({ node: neighbor, f, parent: current });
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>

          <Separator />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Why NP-Hard Matters</h4>
                <p className="text-sm text-amber-800 mt-1">
                  The TSP is NP-hard, meaning there is no known polynomial-time algorithm that solves all instances optimally, 
                  and finding one would prove P = NP, one of the Millennium Prize Problems with a $1,000,000 reward. 
                  This is why we use approximation algorithms and heuristics for real-world instances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Algorithm Selection Guide */}
      <CollapsibleSection 
        title="When to Use Each Algorithm" 
        icon={<Clock className="w-5 h-5 text-green-500" />}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h5 className="font-semibold text-gray-900">Exact DP (Held-Karp)</h5>
              <p className="text-sm text-gray-600">Use when: n ≤ 20, need guaranteed optimal solution</p>
              <p className="text-xs text-gray-500 mt-1">Example: Small delivery routes, critical path optimization</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h5 className="font-semibold text-gray-900">Christofides</h5>
              <p className="text-sm text-gray-600">Use when: Need theoretical guarantee, metric TSP</p>
              <p className="text-xs text-gray-500 mt-1">Example: Network design, guaranteed service levels</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h5 className="font-semibold text-gray-900">2-Opt</h5>
              <p className="text-sm text-gray-600">Use when: Medium-sized problems, good balance</p>
              <p className="text-xs text-gray-500 mt-1">Example: Daily delivery routes, real-time optimization</p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h5 className="font-semibold text-gray-900">A* Pathfinding</h5>
              <p className="text-sm text-gray-600">Use when: Obstacles, road networks, real-time constraints</p>
              <p className="text-xs text-gray-500 mt-1">Example: Traffic-aware routing, construction zones</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default EducationalSection;
