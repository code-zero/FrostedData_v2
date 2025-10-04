import { useState, useEffect } from 'react';
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
  size: number;
}

export default function FloatingCirclesLayout({ items, onEdit, onDelete }: FloatingCirclesLayoutProps) {
  const [positions, setPositions] = useState<Map<string, CirclePosition>>(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const newPositions = new Map<string, CirclePosition>();

    items.forEach((item, index) => {
      if (!positions.has(item.id)) {
        const size = 140 + Math.random() * 80;
        newPositions.set(item.id, {
          x: Math.random() * (window.innerWidth - size - 100) + 50,
          y: Math.random() * (window.innerHeight - size - 200) + 100,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size
        });
      } else {
        newPositions.set(item.id, positions.get(item.id)!);
      }
    });

    setPositions(newPositions);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;

    const animationFrame = setInterval(() => {
      setPositions(prev => {
        const updated = new Map(prev);

        updated.forEach((pos, id) => {
          let { x, y, vx, vy, size } = pos;

          x += vx;
          y += vy;

          const maxX = window.innerWidth - size - 50;
          const maxY = window.innerHeight - size - 100;

          if (x <= 50 || x >= maxX) {
            vx = -vx;
            x = Math.max(50, Math.min(maxX, x));
          }
          if (y <= 100 || y >= maxY) {
            vy = -vy;
            y = Math.max(100, Math.min(maxY, y));
          }

          updated.set(id, { x, y, vx, vy, size });
        });

        return updated;
      });
    }, 30);

    return () => clearInterval(animationFrame);
  }, [items]);

  return (
    <div className="relative w-full min-h-[calc(100vh-200px)]">
      {items.map((item) => {
        const pos = positions.get(item.id);
        if (!pos) return null;

        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            id={`item-${item.id}`}
            className="absolute transition-all duration-300 ease-out"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              zIndex: isHovered ? 50 : 10
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="w-full h-full rounded-full glass-morphism shadow-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 px-2"
                    style={{ fontSize: `${Math.max(14, pos.size / 12)}px` }}>
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-3 px-2 mb-2"
                     style={{ fontSize: `${Math.max(11, pos.size / 18)}px` }}>
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mb-3">
                  <Clock className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                <div className={`flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
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
