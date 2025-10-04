import { Item } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

interface ClassicLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function ClassicLayout({ items, onEdit, onDelete }: ClassicLayoutProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          id={`item-${item.id}`}
          className="glass-morphism hover:shimmer-effect rounded-3xl shadow-3xl p-8 transform transition-all duration-300 hover:scale-[1.02] animate-slideUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex-1 break-words">
              {item.title}
            </h3>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(item)}
                className="p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Pencil className="w-5 h-5" />
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
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed break-words">
              {item.description}
            </p>
          )}

          <div className="text-sm text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
            {new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
