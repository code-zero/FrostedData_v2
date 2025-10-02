import { Item } from '../../types';
import { CreditCard as Edit2, Trash2 } from 'lucide-react';

interface TableLayoutProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function TableLayout({ items, onEdit, onDelete }: TableLayoutProps) {
  return (
    <div className="glass-morphism shimmer-effect rounded-3xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left p-6 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Title
              </th>
              <th className="text-left p-6 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="text-left p-6 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Date
              </th>
              <th className="text-right p-6 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                id={`item-${item.id}`}
                className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200 animate-slideUp"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="p-6">
                  <div className="font-semibold text-slate-900 dark:text-white break-words">
                    {item.title}
                  </div>
                </td>
                <td className="p-6 hidden md:table-cell">
                  <div className="text-slate-600 dark:text-slate-400 max-w-md truncate">
                    {item.description || '—'}
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
