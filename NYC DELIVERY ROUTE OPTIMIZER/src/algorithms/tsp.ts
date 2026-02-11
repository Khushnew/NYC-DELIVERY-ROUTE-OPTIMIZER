// TSP Algorithms Implementation
// Traveling Salesman Problem - NP-hard optimization

export interface Point {
  id: string;
  x: number;
  y: number;
  name: string;
}

export interface RouteResult {
  path: Point[];
  distance: number;
  timeMs: number;
  algorithm: string;
}

// Euclidean distance between two points
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Calculate total route distance
export function calculateRouteDistance(path: Point[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += distance(path[i], path[i + 1]);
  }
  return total;
}

// ==================== EXACT DP SOLUTION (Held-Karp) ====================
// Time: O(n² × 2ⁿ), Space: O(n × 2ⁿ)
// Optimal for n ≤ 20

export function solveTSPExactDP(points: Point[]): RouteResult {
  const startTime = performance.now();
  const n = points.length;
  
  if (n <= 1) {
    return { path: points, distance: 0, timeMs: 0, algorithm: 'Exact DP (Held-Karp)' };
  }
  
  // dp[mask][i] = minimum distance to visit all nodes in mask, ending at node i
  const dp: Map<string, number> = new Map();
  const parent: Map<string, number> = new Map();
  
  // Initialize: from node 0 to each other node
  for (let i = 1; i < n; i++) {
    const mask = 1 | (1 << i);
    dp.set(`${mask},${i}`, distance(points[0], points[i]));
    parent.set(`${mask},${i}`, 0);
  }
  
  // Build up subsets of increasing size
  for (let subsetSize = 3; subsetSize <= n; subsetSize++) {
    for (let mask = 0; mask < (1 << n); mask++) {
      if (__builtin_popcount(mask) !== subsetSize || !(mask & 1)) continue;
      
      for (let end = 1; end < n; end++) {
        if (!(mask & (1 << end))) continue;
        
        const prevMask = mask ^ (1 << end);
        let minDist = Infinity;
        let bestPrev = -1;
        
        for (let prev = 1; prev < n; prev++) {
          if (!(prevMask & (1 << prev))) continue;
          
          const key = `${prevMask},${prev}`;
          const prevDist = dp.get(key);
          if (prevDist !== undefined) {
            const newDist = prevDist + distance(points[prev], points[end]);
            if (newDist < minDist) {
              minDist = newDist;
              bestPrev = prev;
            }
          }
        }
        
        if (minDist < Infinity) {
          dp.set(`${mask},${end}`, minDist);
          parent.set(`${mask},${end}`, bestPrev);
        }
      }
    }
  }
  
  // Find optimal tour ending back at node 0
  const fullMask = (1 << n) - 1;
  let minTour = Infinity;
  let lastNode = -1;
  
  for (let i = 1; i < n; i++) {
    const key = `${fullMask},${i}`;
    const dist = dp.get(key);
    if (dist !== undefined) {
      const tourDist = dist + distance(points[i], points[0]);
      if (tourDist < minTour) {
        minTour = tourDist;
        lastNode = i;
      }
    }
  }
  
  // Reconstruct path
  const path: Point[] = [points[0]];
  let mask = fullMask;
  let curr = lastNode;
  
  while (curr !== 0) {
    path.push(points[curr]);
    const prev = parent.get(`${mask},${curr}`);
    if (prev === undefined) break;
    mask ^= (1 << curr);
    curr = prev;
  }
  
  path.push(points[0]); // Return to start
  path.reverse();
  
  const endTime = performance.now();
  
  return {
    path,
    distance: minTour,
    timeMs: endTime - startTime,
    algorithm: 'Exact DP (Held-Karp)'
  };
}

// Count set bits
function __builtin_popcount(n: number): number {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// ==================== NEAREST NEIGHBOR (Greedy) ====================
// Time: O(n²), Space: O(n)
// Fast but not optimal

export function solveTSPNearestNeighbor(points: Point[]): RouteResult {
  const startTime = performance.now();
  const n = points.length;
  
  if (n <= 1) {
    return { path: points, distance: 0, timeMs: 0, algorithm: 'Nearest Neighbor' };
  }
  
  const visited = new Set<number>();
  const path: Point[] = [points[0]];
  visited.add(0);
  
  let current = 0;
  let totalDistance = 0;
  
  while (visited.size < n) {
    let nearest = -1;
    let minDist = Infinity;
    
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const dist = distance(points[current], points[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
    }
    
    if (nearest !== -1) {
      visited.add(nearest);
      path.push(points[nearest]);
      totalDistance += minDist;
      current = nearest;
    }
  }
  
  // Return to start
  totalDistance += distance(points[current], points[0]);
  path.push(points[0]);
  
  const endTime = performance.now();
  
  return {
    path,
    distance: totalDistance,
    timeMs: endTime - startTime,
    algorithm: 'Nearest Neighbor (Greedy)'
  };
}

// ==================== 2-OPT IMPROVEMENT ====================
// Time: O(n² × iterations), Space: O(n)
// Local search improvement

export function solveTSP2Opt(points: Point[]): RouteResult {
  const startTime = performance.now();
  
  if (points.length <= 2) {
    return { path: points, distance: calculateRouteDistance(points), timeMs: 0, algorithm: '2-Opt' };
  }
  
  // Start with nearest neighbor solution
  let nnResult = solveTSPNearestNeighbor(points);
  let path = nnResult.path.slice(0, -1); // Remove return to start for 2-opt
  let improved = true;
  let iterations = 0;
  const maxIterations = 1000;
  
  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;
    
    for (let i = 0; i < path.length - 1; i++) {
      for (let j = i + 2; j < path.length; j++) {
        // Calculate change in distance if we swap edges (i, i+1) and (j, j+1)
        // with (i, j) and (i+1, j+1)
        const a = path[i];
        const b = path[i + 1];
        const c = path[j];
        const d = j + 1 < path.length ? path[j + 1] : path[0];
        
        const currentDist = distance(a, b) + distance(c, d);
        const newDist = distance(a, c) + distance(b, d);
        
        if (newDist < currentDist - 0.0001) {
          // Reverse the segment between i+1 and j
          let left = i + 1;
          let right = j;
          while (left < right) {
            [path[left], path[right]] = [path[right], path[left]];
            left++;
            right--;
          }
          improved = true;
        }
      }
    }
  }
  
  path.push(path[0]); // Return to start
  
  const endTime = performance.now();
  
  return {
    path,
    distance: calculateRouteDistance(path),
    timeMs: endTime - startTime,
    algorithm: '2-Opt Local Search'
  };
}

// ==================== CHRISTOFIDES ALGORITHM ====================
// Time: O(n³), Space: O(n²)
// 1.5-approximation for metric TSP

export function solveTSPChristofides(points: Point[]): RouteResult {
  const startTime = performance.now();
  const n = points.length;
  
  if (n <= 2) {
    return { path: points, distance: calculateRouteDistance(points), timeMs: 0, algorithm: 'Christofides' };
  }
  
  // Step 1: Compute Minimum Spanning Tree (MST) using Prim's algorithm
  const mst = primMST(points);
  
  // Step 2: Find odd-degree vertices in MST
  const degrees = new Array(n).fill(0);
  for (const [u, v] of mst) {
    degrees[u]++;
    degrees[v]++;
  }
  
  const oddVertices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (degrees[i] % 2 === 1) {
      oddVertices.push(i);
    }
  }
  
  // Step 3: Find minimum weight perfect matching on odd vertices
  const matching = minimumWeightPerfectMatching(points, oddVertices);
  
  // Step 4: Combine MST and matching to create Eulerian multigraph
  const multigraph: [number, number][] = [...mst, ...matching];
  
  // Step 5: Find Eulerian tour
  const eulerianTour = findEulerianTour(multigraph, n);
  
  // Step 6: Shortcut to get Hamiltonian cycle
  const visited = new Set<number>();
  const path: Point[] = [];
  
  for (const node of eulerianTour) {
    if (!visited.has(node)) {
      visited.add(node);
      path.push(points[node]);
    }
  }
  
  path.push(points[eulerianTour[0]]); // Return to start
  
  const endTime = performance.now();
  
  return {
    path,
    distance: calculateRouteDistance(path),
    timeMs: endTime - startTime,
    algorithm: 'Christofides (1.5-approx)'
  };
}

// Prim's MST algorithm
function primMST(points: Point[]): [number, number][] {
  const n = points.length;
  const inMST = new Array(n).fill(false);
  const key = new Array(n).fill(Infinity);
  const parent = new Array(n).fill(-1);
  
  key[0] = 0;
  
  for (let count = 0; count < n; count++) {
    // Find minimum key vertex not in MST
    let u = -1;
    let minKey = Infinity;
    for (let i = 0; i < n; i++) {
      if (!inMST[i] && key[i] < minKey) {
        minKey = key[i];
        u = i;
      }
    }
    
    if (u === -1) break;
    
    inMST[u] = true;
    
    // Update keys of adjacent vertices
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const dist = distance(points[u], points[v]);
        if (dist < key[v]) {
          key[v] = dist;
          parent[v] = u;
        }
      }
    }
  }
  
  const edges: [number, number][] = [];
  for (let i = 1; i < n; i++) {
    if (parent[i] !== -1) {
      edges.push([parent[i], i]);
    }
  }
  
  return edges;
}

// Minimum weight perfect matching (greedy approximation for simplicity)
function minimumWeightPerfectMatching(points: Point[], vertices: number[]): [number, number][] {
  const matching: [number, number][] = [];
  const available = new Set(vertices);
  
  while (available.size > 1) {
    let minDist = Infinity;
    let bestPair: [number, number] = [-1, -1];
    
    const availArray = Array.from(available);
    for (let i = 0; i < availArray.length; i++) {
      for (let j = i + 1; j < availArray.length; j++) {
        const dist = distance(points[availArray[i]], points[availArray[j]]);
        if (dist < minDist) {
          minDist = dist;
          bestPair = [availArray[i], availArray[j]];
        }
      }
    }
    
    if (bestPair[0] !== -1) {
      matching.push(bestPair);
      available.delete(bestPair[0]);
      available.delete(bestPair[1]);
    }
  }
  
  return matching;
}

// Find Eulerian tour using Hierholzer's algorithm
function findEulerianTour(edges: [number, number][], _n: number): number[] {
  const adj: Map<number, number[]> = new Map();
  
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }
  
  const tour: number[] = [];
  const stack: number[] = [0];
  
  while (stack.length > 0) {
    const curr = stack[stack.length - 1];
    const neighbors = adj.get(curr);
    
    if (neighbors && neighbors.length > 0) {
      const next = neighbors.pop()!;
      // Remove edge from other end
      const otherNeighbors = adj.get(next)!;
      const idx = otherNeighbors.indexOf(curr);
      if (idx !== -1) otherNeighbors.splice(idx, 1);
      stack.push(next);
    } else {
      tour.push(stack.pop()!);
    }
  }
  
  return tour.reverse();
}

// ==================== A* PATHFINDING ====================
// For real-time routing between points

interface AStarNode {
  point: Point;
  g: number; // Cost from start
  h: number; // Heuristic (estimated cost to goal)
  f: number; // Total cost (g + h)
  parent?: AStarNode;
}

export function aStarPathfinding(
  start: Point,
  goal: Point,
  obstacles: Point[] = [],
  gridSize: number = 100
): RouteResult {
  const startTime = performance.now();
  
  // Simple A* on a grid
  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();
  
  const startNode: AStarNode = {
    point: start,
    g: 0,
    h: distance(start, goal),
    f: distance(start, goal)
  };
  
  openSet.push(startNode);
  
  const obstacleSet = new Set(obstacles.map(o => `${Math.round(o.x)},${Math.round(o.y)}`));
  
  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    const key = `${current.point.x},${current.point.y}`;
    if (closedSet.has(key)) continue;
    closedSet.add(key);
    
    // Check if reached goal
    if (distance(current.point, goal) < 1) {
      // Reconstruct path
      const path: Point[] = [];
      let node: AStarNode | undefined = current;
      while (node) {
        path.unshift(node.point);
        node = node.parent;
      }
      
      const endTime = performance.now();
      
      return {
        path,
        distance: current.g,
        timeMs: endTime - startTime,
        algorithm: 'A* Pathfinding'
      };
    }
    
    // Generate neighbors
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    
    for (const [dx, dy] of directions) {
      const newX = current.point.x + dx * 2;
      const newY = current.point.y + dy * 2;
      
      // Check bounds and obstacles
      if (newX < 0 || newX > gridSize || newY < 0 || newY > gridSize) continue;
      if (obstacleSet.has(`${Math.round(newX)},${Math.round(newY)}`)) continue;
      
      const neighborPoint: Point = { id: `${newX},${newY}`, x: newX, y: newY, name: '' };
      const gScore = current.g + distance(current.point, neighborPoint);
      
      const neighbor: AStarNode = {
        point: neighborPoint,
        g: gScore,
        h: distance(neighborPoint, goal),
        f: gScore + distance(neighborPoint, goal),
        parent: current
      };
      
      openSet.push(neighbor);
    }
  }
  
  // No path found, return direct path
  const endTime = performance.now();
  
  return {
    path: [start, goal],
    distance: distance(start, goal),
    timeMs: endTime - startTime,
    algorithm: 'A* Pathfinding (Direct)'
  };
}

// ==================== SOLVER DISPATCHER ====================

export type AlgorithmType = 'exact-dp' | 'nearest-neighbor' | '2-opt' | 'christofides' | 'astar';

export function solveTSP(points: Point[], algorithm: AlgorithmType): RouteResult {
  switch (algorithm) {
    case 'exact-dp':
      return points.length <= 20 
        ? solveTSPExactDP(points)
        : { ...solveTSPNearestNeighbor(points), algorithm: 'Nearest Neighbor (DP limit exceeded)' };
    case 'nearest-neighbor':
      return solveTSPNearestNeighbor(points);
    case '2-opt':
      return solveTSP2Opt(points);
    case 'christofides':
      return solveTSPChristofides(points);
    case 'astar':
      // For A*, we need to route between consecutive points
      if (points.length < 2) {
        return { path: points, distance: 0, timeMs: 0, algorithm: 'A* Pathfinding' };
      }
      let totalDist = 0;
      const fullPath: Point[] = [points[0]];
      const startTime = performance.now();
      
      for (let i = 0; i < points.length - 1; i++) {
        const result = aStarPathfinding(points[i], points[i + 1]);
        totalDist += result.distance;
        fullPath.push(...result.path.slice(1));
      }
      
      // Return to start
      const returnPath = aStarPathfinding(fullPath[fullPath.length - 1], points[0]);
      totalDist += returnPath.distance;
      fullPath.push(...returnPath.path.slice(1));
      
      const endTime = performance.now();
      
      return {
        path: fullPath,
        distance: totalDist,
        timeMs: endTime - startTime,
        algorithm: 'A* Pathfinding (Multi-point)'
      };
    default:
      return solveTSPNearestNeighbor(points);
  }
}

// Compare all algorithms
export function compareAlgorithms(points: Point[]): RouteResult[] {
  const algorithms: AlgorithmType[] = ['exact-dp', 'nearest-neighbor', '2-opt', 'christofides'];
  
  // Only run exact DP if n <= 20
  const toRun = points.length <= 20 
    ? algorithms 
    : algorithms.filter(a => a !== 'exact-dp');
  
  return toRun.map(algo => solveTSP(points, algo));
}
