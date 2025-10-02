import { Item } from '../../types';
import { Edit2, Trash2, Circle } from 'lucide-react';

interface TimelineLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function TimelineLayout({ items, onEdit, onDelete }: TimelineLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600"></div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            id={`item-${item.id}`}
            className="relative pl-20 animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-slate-900 shadow-lg glow-border z-10">
              <Circle className="w-full h-full text-white p-0.5" fill="currentColor" />
            </div>

            <div className="glass-morphism hover:shimmer-effect rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white break-words">
                    {item.title}
                  </h3>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
