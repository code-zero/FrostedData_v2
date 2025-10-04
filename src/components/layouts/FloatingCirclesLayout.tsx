import { useState, useEffect, useRef } from 'react';
import { Item } from '../../types';
import { Pencil, Trash2, Clock } from 'lucide-react';

interface FloatingCirclesLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

interface CirclePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  row: number;
  color: string;
}

const CIRCLE_SIZE = 160;
const ROW_HEIGHT = 200;
const PADDING = 20;

const COLORS = [
  'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
  'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30',
  'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
  'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/30 dark:to-slate-700/30',
  'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30',
  'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30',
  'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30',
];

export default function FloatingCirclesLayout({ items, onEdit, onDelete }: FloatingCirclesLayoutProps) {
  const [positions, setPositions] = useState<Map<string, CirclePosition>>(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const circlesPerRow = Math.floor((containerWidth - PADDING * 2) / (CIRCLE_SIZE + PADDING));
    const newPositions = new Map<string, CirclePosition>();

    items.forEach((item, index) => {
      if (!positions.has(item.id)) {
        const row = Math.floor(index / circlesPerRow);
        const colInRow = index % circlesPerRow;

        const startX = PADDING + colInRow * (CIRCLE_SIZE + PADDING) + (Math.random() * 30 - 15);
        const startY = PADDING + row * ROW_HEIGHT + (Math.random() * 20 - 10);

        newPositions.set(item.id, {
          x: startX,
          y: startY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 0,
          row,
          color: COLORS[index % COLORS.length]
        });
      } else {
        newPositions.set(item.id, positions.get(item.id)!);
      }
    });

    setPositions(newPositions);
  }, [items]);

  useEffect(() => {
    if (items.length === 0 || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    const animationFrame = setInterval(() => {
      setPositions(prev => {
        const updated = new Map(prev);
        const positionsArray = Array.from(updated.entries());

        positionsArray.forEach(([id, pos]) => {
          let { x, y, vx, vy, row, color } = pos;

          x += vx;
          y += vy;

          const minX = PADDING;
          const maxX = containerWidth - CIRCLE_SIZE - PADDING;
          const minY = PADDING + row * ROW_HEIGHT - 30;
          const maxY = PADDING + row * ROW_HEIGHT + 30;

          if (x <= minX || x >= maxX) {
            vx = -vx;
            x = Math.max(minX, Math.min(maxX, x));
          }
          if (y <= minY || y >= maxY) {
            vy = -vy;
            y = Math.max(minY, Math.min(maxY, y));
          }

          positionsArray.forEach(([otherId, otherPos]) => {
            if (id !== otherId && Math.abs(otherPos.row - row) <= 1) {
              const dx = x - otherPos.x;
              const dy = y - otherPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = CIRCLE_SIZE + 10;

              if (distance < minDistance && distance > 0) {
                const angle = Math.atan2(dy, dx);
                const force = (minDistance - distance) * 0.05;

                vx += Math.cos(angle) * force;
                vy += Math.sin(angle) * force;

                const maxSpeed = 1.2;
                const speed = Math.sqrt(vx * vx + vy * vy);
                if (speed > maxSpeed) {
                  vx = (vx / speed) * maxSpeed;
                  vy = (vy / speed) * maxSpeed;
                }
              }
            }
          });

          updated.set(id, { x, y, vx, vy, row, color });
        });

        return updated;
      });
    }, 30);

    return () => clearInterval(animationFrame);
  }, [items]);

  const totalRows = Math.ceil(items.length / Math.floor((containerRef.current?.offsetWidth || 1000) / (CIRCLE_SIZE + PADDING)));
  const containerHeight = Math.max(totalRows * ROW_HEIGHT + PADDING * 2, 600);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: `${containerHeight}px` }}
    >
      {items.map((item) => {
        const pos = positions.get(item.id);
        if (!pos) return null;

        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            id={`item-${item.id}`}
            className="absolute transition-transform duration-200 ease-out"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${CIRCLE_SIZE}px`,
              height: `${CIRCLE_SIZE}px`,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              zIndex: isHovered ? 50 : 10
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className={`w-full h-full rounded-full shadow-lg hover:shadow-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer transition-shadow duration-200 border border-slate-200/50 dark:border-slate-700/50 ${pos.color}`}>
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 line-clamp-2 px-1 text-sm leading-tight">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2 px-1 mb-2 text-xs leading-snug">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mb-2">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                <div className={`flex gap-1.5 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full transition-colors duration-200 shadow-md"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 shadow-md"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
