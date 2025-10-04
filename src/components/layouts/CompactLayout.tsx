import { Item } from '../../types';
import { Pencil, Trash2, Calendar } from 'lucide-react';

interface CompactLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function CompactLayout({ items, onEdit, onDelete }: CompactLayoutProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          id={`item-${item.id}`}
          className="glass-morphism hover:shimmer-effect rounded-2xl shadow-lg p-5 transform transition-all duration-300 hover:shadow-2xl animate-slideUp"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
