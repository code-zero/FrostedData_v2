import { Item } from '../../types';
import { Edit2, Trash2, Clock } from 'lucide-react';

interface MasonryLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function MasonryLayout({ items, onEdit, onDelete }: MasonryLayoutProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          id={`item-${item.id}`}
          className="glass-morphism hover:shimmer-effect rounded-3xl shadow-2xl p-6 break-inside-avoid transform transition-all duration-300 hover:scale-[1.02] animate-slideUp"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white break-words mb-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {item.description && (
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-sm break-words">
              {item.description}
            </p>
          )}

          <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 py-2 px-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
