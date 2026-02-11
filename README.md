
# 🚚 NYC Delivery Route Optimizer

An interactive educational tool for exploring route optimization algorithms using real NYC street data. Built with React, TypeScript, and Tailwind CSS.

![Demo Screenshot](https://via.placeholder.com/800x400?text=NYC+Route+Optimizer+Demo)

## 🎯 Features

- **Interactive Map**: Click anywhere on the NYC map to add delivery stops
- **Multiple Algorithms**: Compare different TSP (Traveling Salesman Problem) solving approaches
- **Visual Animation**: Watch routes being traced in real-time
- **Educational Content**: Learn about computational complexity and optimization
- **Sample Data**: Load pre-configured NYC delivery scenarios instantly

## 🚀 How to Use

1. **Add Stops**: Click on the map to add delivery stops (or load sample data)
2. **Select Algorithm**: Choose your preferred optimization algorithm from the sidebar
3. **Run Optimization**: Click **"Run Algorithm"** to calculate the optimal route
4. **Compare All**: Click **"Compare All"** to see all algorithms side-by-side
5. **Animate Route**: Click **"Animate Route"** to visualize the delivery path step-by-step

## 🧠 Algorithms Included

| Algorithm | Time Complexity | Best For |
|-----------|----------------|----------|
| **Nearest Neighbor** | O(n²) | Quick approximations |
| **2-Opt Swap** | O(n²) | Local improvements |
| **Simulated Annealing** | Variable | Complex route networks |
| **Brute Force** | O(n!) | Small datasets (education only) |

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: Leaflet / Mapbox GL JS
- **State Management**: Zustand
- **Animations**: Framer Motion

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nyc-route-optimizer.git

# Navigate to project
cd nyc-route-optimizer

# Install dependencies
npm install

# Start development server
npm run dev
