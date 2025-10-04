import { Item } from '../../types';
import { Pencil, Trash2, Clock } from 'lucide-react';

interface MasonryLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function MasonryLayout({ items, onEdit, onDelete }: MasonryLayoutProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-5">
      {items.map((item, index) => (
        <div
          key={item.id}
          id={`item-${item.id}`}
          className="glass-morphism rounded-2xl shadow-lg hover:shadow-xl p-5 mb-5 break-inside-avoid transform transition-all duration-300 hover:scale-[1.01] animate-slideUp group"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white break-words leading-snug mb-1.5">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                {new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {item.description && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm break-words">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
