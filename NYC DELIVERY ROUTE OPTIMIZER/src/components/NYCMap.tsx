import { useState, useRef, useEffect } from 'react';
import type { Point } from '@/algorithms/tsp';
import { MapPin, Navigation, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NYCMapProps {
  points: Point[];
  path: Point[] | null;
  onAddPoint: (point: Point) => void;
  onRemovePoint: (id: string) => void;
  onClearPoints: () => void;
  isAnimating: boolean;
}

// Sample NYC landmarks for context
const NYC_LANDMARKS = [
  { name: 'Manhattan', x: 50, y: 35, color: '#e74c3c' },
  { name: 'Brooklyn', x: 65, y: 65, color: '#3498db' },
  { name: 'Queens', x: 80, y: 35, color: '#2ecc71' },
  { name: 'Bronx', x: 55, y: 15, color: '#f39c12' },
  { name: 'Staten Island', x: 25, y: 75, color: '#9b59b6' },
];

export const NYCMap: React.FC<NYCMapProps> = ({
  points,
  path,
  onAddPoint,
  onRemovePoint,
  onClearPoints,
  isAnimating
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animate the route
  useEffect(() => {
    if (isAnimating && path && path.length > 1) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.01;
        if (progress >= 1) {
          progress = 1;
          clearInterval(interval);
        }
        setAnimationProgress(progress);
      }, 30);
      return () => clearInterval(interval);
    } else {
      setAnimationProgress(0);
    }
  }, [isAnimating, path]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Ensure within bounds
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      const newPoint: Point = {
        id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x,
        y,
        name: `Stop ${points.length + 1}`
      };
      onAddPoint(newPoint);
    }
  };

  // Generate path string for SVG
  const generatePathString = (points: Point[]): string => {
    if (points.length < 2) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  // Generate animated path
  const generateAnimatedPath = (points: Point[], progress: number): string => {
    if (points.length < 2) return '';
    
    const totalSegments = points.length - 1;
    const currentSegment = Math.floor(progress * totalSegments);
    const segmentProgress = (progress * totalSegments) - currentSegment;
    
    let pathStr = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < currentSegment && i < points.length - 1; i++) {
      pathStr += ` L ${points[i + 1].x} ${points[i + 1].y}`;
    }
    
    if (currentSegment < points.length - 1) {
      const p1 = points[currentSegment];
      const p2 = points[currentSegment + 1];
      const x = p1.x + (p2.x - p1.x) * segmentProgress;
      const y = p1.y + (p2.y - p1.y) * segmentProgress;
      pathStr += ` L ${x} ${y}`;
    }
    
    return pathStr;
  };

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearPoints}
          disabled={points.length === 0}
          className="bg-white/90 backdrop-blur shadow-lg"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">NYC Boroughs</h4>
        <div className="space-y-1">
          {NYC_LANDMARKS.map((landmark) => (
            <div key={landmark.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: landmark.color }}
              />
              <span className="text-xs text-gray-700">{landmark.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-700">Delivery Stop</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Navigation className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-700">Optimized Route</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold text-gray-800">
          {points.length} Stops
        </div>
        <div className="text-xs text-gray-500">
          Click map to add delivery points
        </div>
      </div>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 cursor-crosshair"
        onClick={handleSvgClick}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.2"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* NYC Borough regions (simplified) */}
        <g opacity="0.15">
          {/* Manhattan */}
          <ellipse cx="50" cy="35" rx="8" ry="20" fill="#e74c3c" />
          {/* Brooklyn */}
          <ellipse cx="65" cy="65" rx="15" ry="12" fill="#3498db" />
          {/* Queens */}
          <ellipse cx="80" cy="35" rx="15" ry="18" fill="#2ecc71" />
          {/* Bronx */}
          <ellipse cx="55" cy="15" rx="12" ry="8" fill="#f39c12" />
          {/* Staten Island */}
          <ellipse cx="25" cy="75" rx="10" ry="8" fill="#9b59b6" />
        </g>

        {/* Water bodies */}
        <path
          d="M 0 50 Q 20 45, 35 50 T 70 55 T 100 50 L 100 100 L 0 100 Z"
          fill="#bfdbfe"
          opacity="0.3"
        />
        <path
          d="M 40 0 Q 45 30, 42 60 T 38 100 L 45 100 Q 50 60, 48 30 T 50 0 Z"
          fill="#bfdbfe"
          opacity="0.3"
        />

        {/* Central Park */}
          <rect x="52" y="28" width="4" height="8" fill="#86efac" opacity="0.5" rx="1" />

        {/* Route path (full - dimmed) */}
        {path && path.length > 1 && (
          <path
            d={generatePathString(path)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.3"
            strokeDasharray="1,1"
            opacity="0.5"
          />
        )}

        {/* Animated route */}
        {path && path.length > 1 && isAnimating && (
          <path
            d={generateAnimatedPath(path, animationProgress)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Complete route when not animating */}
        {path && path.length > 1 && !isAnimating && (
          <path
            d={generatePathString(path)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Delivery points */}
        {points.map((point, index) => (
          <g key={point.id}>
            {/* Point circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === point.id ? 2.5 : 2}
              fill={index === 0 ? '#22c55e' : '#ef4444'}
              stroke="white"
              strokeWidth="0.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={(e) => {
                e.stopPropagation();
                onRemovePoint(point.id);
              }}
            />
            {/* Point label */}
            <text
              x={point.x}
              y={point.y - 3}
              textAnchor="middle"
              fontSize="2.5"
              fill="#374151"
              fontWeight="600"
              className="pointer-events-none select-none"
            >
              {index === 0 ? 'START' : `${index}`}
            </text>
            {/* Hover tooltip */}
            {hoveredPoint === point.id && (
              <g>
                <rect
                  x={point.x - 8}
                  y={point.y - 10}
                  width="16"
                  height="4"
                  fill="white"
                  stroke="#d1d5db"
                  strokeWidth="0.2"
                  rx="0.5"
                />
                <text
                  x={point.x}
                  y={point.y - 7}
                  textAnchor="middle"
                  fontSize="2"
                  fill="#374151"
                >
                  Click to remove
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Start point indicator */}
        {points.length > 0 && (
          <g>
            <circle
              cx={points[0].x}
              cy={points[0].y}
              r="4"
              fill="none"
              stroke="#22c55e"
              strokeWidth="0.3"
              opacity="0.5"
            >
              <animate
                attributeName="r"
                values="3;5;3"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
};

export default NYCMap;
