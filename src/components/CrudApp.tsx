import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Check, LogOut, Loader2, Moon, Sun, LayoutGrid as Layout } from 'lucide-react';
import { Item, LayoutType } from '../types';
import ClassicLayout from './layouts/ClassicLayout';
import CompactLayout from './layouts/CompactLayout';
import MasonryLayout from './layouts/MasonryLayout';
import TableLayout from './layouts/TableLayout';
import TimelineLayout from './layouts/TimelineLayout';
import FloatingCirclesLayout from './layouts/FloatingCirclesLayout';

export default function CrudApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(() => {
    const saved = localStorage.getItem('layoutType');
    return (saved as LayoutType) || 'masonry';
  });
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('layoutType', currentLayout);
  }, [currentLayout]);

  const fetchItems = async () => {
    setFetchLoading(true);
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (editingItem) {
        await supabase
          .from('items')
          .update({
            title,
            description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
      } else {
        await supabase
          .from('items')
          .insert([{
            title,
            description,
            user_id: user?.id
          }]);
      }

      await fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const itemElement = document.getElementById(`item-${id}`);
    if (itemElement) {
      itemElement.style.animation = 'slideOutRight 0.3s ease-out forwards';
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    await supabase.from('items').delete().eq('id', id);
    await fetchItems();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const renderLayout = () => {
    const props = { items, onEdit: handleEdit, onDelete: handleDelete };

    switch (currentLayout) {
      case 'compact':
        return <CompactLayout {...props} />;
      case 'masonry':
        return <MasonryLayout {...props} />;
      case 'table':
        return <TableLayout {...props} />;
      case 'timeline':
        return <TimelineLayout {...props} />;
      case 'floating':
        return <FloatingCirclesLayout {...props} />;
      default:
        return <ClassicLayout {...props} />;
    }
  };

  const layouts: { type: LayoutType; name: string; description: string }[] = [
    { type: 'masonry', name: 'Masonry', description: 'Pinterest-style columns' },
    { type: 'floating', name: 'Ku Malawi Ndikobheba ❤️', description: 'Floating circles' },
    { type: 'classic', name: 'Classic Grid', description: 'Traditional card layout' },
    { type: 'compact', name: 'Compact List', description: 'Space-efficient rows' },
    { type: 'table', name: 'Table View', description: 'Structured data table' },
    { type: 'timeline', name: 'Timeline', description: 'Chronological timeline' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
              Frosted Data
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Manage your collection beautifully
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New
            </button>

            <div className="relative">
              <button
                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                className="flex items-center gap-2 px-4 py-2 glass-morphism text-slate-700 dark:text-slate-300 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layout className="w-4 h-4" />
                View
              </button>

              {showLayoutMenu && (
                <div className="absolute right-0 mt-2 w-72 glass-morphism rounded-xl shadow-xl p-2 z-50 animate-fadeIn">
                  {layouts.map((layout) => (
                    <button
                      key={layout.type}
                      onClick={() => {
                        setCurrentLayout(layout.type);
                        setShowLayoutMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        currentLayout === layout.type
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{layout.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        currentLayout === layout.type ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {layout.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 glass-morphism text-slate-700 dark:text-slate-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 glass-morphism text-slate-700 dark:text-slate-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
            <div className="glass-morphism rounded-2xl shadow-2xl p-8 w-full max-w-xl transform transition-all duration-300 scale-100 animate-slideUp">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Item' : 'New Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                    placeholder="Enter description"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {editingItem ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transform transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {fetchLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 glass-morphism rounded-2xl">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              No items yet. Create your first one.
            </p>
          </div>
        ) : (
          renderLayout()
        )}
      </div>
    </div>
  );
}
