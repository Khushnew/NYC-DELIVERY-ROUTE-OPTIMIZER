
# 🚚 NYC Delivery Route Optimizer

### Traveling Salesman Problem (TSP) Solver

An interactive visualization and implementation of classic and modern algorithms used to solve the **Traveling Salesman Problem (TSP)** — demonstrated through NYC delivery route optimization.

---

## 🚚 About

When a delivery driver has multiple packages to deliver across NYC, what order should they visit each address to minimize total driving distance?

This project provides:

- Interactive NYC map
- Multiple TSP algorithms
- Real-time visualization
- Algorithm comparison tools
- Performance & complexity insights

It demonstrates both **theoretical computer science concepts** and **practical route optimization techniques** used in logistics and delivery systems.

---

## 📊 Why This Problem Matters

- 💰 **$100B+** potential global annual savings from route optimization
- 📉 **~30% average distance reduction** using optimized routes
- 🔢 **15! = 1.3 trillion** possible routes for just 15 stops

With 25 stops, brute force would take **longer than the age of the universe**.

This is why algorithm design matters.

---

# 🗺️ Features

### Map Interaction
- Click anywhere on the NYC map to add delivery stops
- Supports all five boroughs:
  - Manhattan
  - Brooklyn
  - Queens
  - Bronx
  - Staten Island
- Animate optimized routes
- Clear and reload routes
- Load sample data

---

# 🧠 Implemented Algorithms

## 1️⃣ Exact DP (Held-Karp)

**Dynamic Programming solution**

- ✅ Guaranteed optimal
- ❌ Exponential time complexity
- 📈 Time: `O(n² × 2ⁿ)`
- 🧮 Space: `O(n × 2ⁿ)`
- 🎯 Best for: `n ≤ 20`

Used when absolute optimality is required.

---

## 2️⃣ Nearest Neighbor (Greedy)

**Always visit closest unvisited stop**

- ⚡ Very fast
- ❌ Can be suboptimal
- 📈 Time: `O(n²)`
- 📉 ~25% above optimal
- 🎯 Best for quick approximations

---

## 3️⃣ 2-Opt Local Search (Selected Default)

**Edge-swapping improvement heuristic**

- 🔄 Iteratively improves route
- ⚖️ Great speed/quality balance
- 📈 Time: `O(n² × iterations)`
- 📉 ~5–10% above optimal
- 🎯 Best for medium-sized problems

---

## 4️⃣ Christofides Algorithm

**1.5-Approximation algorithm**

- 🌲 Minimum Spanning Tree
- 🔁 Perfect matching
- 📐 Metric TSP guarantee
- 📈 Time: `O(n³)`
- 📉 ≤ 1.5× optimal
- 🎯 Best for theoretical guarantees

---

## 5️⃣ A* Pathfinding

**Real-time shortest path routing**

- 🧭 Handles obstacles
- 🚦 Can incorporate traffic
- 📈 Time: `O(E + V log V)`
- ✅ Optimal per segment
- 🎯 Best for road-network routing

---

# 🖱️ How to Use

1. Click on the NYC map to add delivery stops
2. Select an algorithm
3. Click **Run Algorithm**
4. Compare with other algorithms
5. Click **Animate Route** to visualize

---

# 🔬 Understanding the Traveling Salesman Problem

## Explain to Anyone

> "If a driver has 15 deliveries, what order minimizes driving distance?"

Simple question. Extremely hard problem.

---

## Explain to Engineers

The Traveling Salesman Problem (TSP) is:

- NP-Hard
- Combinatorial optimization
- Core problem in operations research

We implement:
- Exact Dynamic Programming
- Approximation algorithms
- Heuristic local search
- Graph-based pathfinding

---

# 📈 Complexity Overview

| Approach | Algorithm | Time Complexity | Guarantee |
|-----------|------------|----------------|------------|
| Brute Force | Permutations | O(n!) | Optimal |
| Exact | Held-Karp | O(n² × 2ⁿ) | Optimal |
| Approximation | Christofides | O(n³) | ≤1.5× optimal |
| Heuristic | 2-Opt | O(n² × iter) | Near optimal |
| Greedy | Nearest Neighbor | O(n²) | No guarantee |

---

# 💻 Core Implementations

## Held-Karp (Dynamic Programming)

```javascript
// State: dp[mask][i] = min distance to visit nodes in mask, end at i
// Transition: dp[mask][i] = min(dp[mask ^ (1<<i)][j] + dist[j][i])
// Time: O(n² × 2ⁿ)

function heldKarp(points) {
  const n = points.length;
  const dp = new Map();
  
  for (let i = 1; i < n; i++) {
    dp.set(`${1 | (1<<i)},${i}`, dist(0, i));
  }

  for (let mask = 0; mask < (1<<n); mask++) {
    for (let end = 0; end < n; end++) {
      if (!(mask & (1<<end))) continue;

      for (let prev = 0; prev < n; prev++) {
        const newDist = dp.get(`${mask^(1<<end)},${prev}`) + dist(prev, end);
        dp.set(`${mask},${end}`, Math.min(
          dp.get(`${mask},${end}`) || Infinity,
          newDist
        ));
      }
    }
  }

  return dp.get(`${(1<<n)-1},${n-1}`);
}
