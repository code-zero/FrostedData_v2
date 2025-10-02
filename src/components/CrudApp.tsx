import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, X, Check, LogOut, Loader2, Moon, Sun, LayoutGrid as Layout } from 'lucide-react';
import { Item, LayoutType } from '../types';
import ClassicLayout from './layouts/ClassicLayout';
import CompactLayout from './layouts/CompactLayout';
import MasonryLayout from './layouts/MasonryLayout';
import TableLayout from './layouts/TableLayout';
import TimelineLayout from './layouts/TimelineLayout';

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
    return (saved as LayoutType) || 'classic';
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
      default:
        return <ClassicLayout {...props} />;
    }
  };

  const layouts: { type: LayoutType; name: string; description: string }[] = [
    { type: 'classic', name: 'Classic Grid', description: 'Traditional card layout' },
    { type: 'compact', name: 'Compact List', description: 'Space-efficient rows' },
    { type: 'masonry', name: 'Masonry', description: 'Pinterest-style columns' },
    { type: 'table', name: 'Table View', description: 'Structured data table' },
    { type: 'timeline', name: 'Timeline', description: 'Chronological timeline' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Frosted Data v2
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage your collection beautifully
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                className="flex items-center gap-2 px-5 py-3 glass-morphism shimmer-effect text-slate-700 dark:text-slate-300 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Layout className="w-5 h-5" />
                Layout
              </button>

              {showLayoutMenu && (
                <div className="absolute right-0 mt-2 w-64 glass-morphism rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  {layouts.map((layout) => (
                    <button
                      key={layout.type}
                      onClick={() => {
                        setCurrentLayout(layout.type);
                        setShowLayoutMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        currentLayout === layout.type
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-semibold">{layout.name}</div>
                      <div className={`text-xs ${
                        currentLayout === layout.type ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
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
              className="flex items-center gap-2 px-5 py-3 glass-morphism shimmer-effect text-slate-700 dark:text-slate-300 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-5 py-3 glass-morphism shimmer-effect text-slate-700 dark:text-slate-300 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-3xl font-semibold text-lg shadow-2xl hover:shadow-3xl shimmer-effect transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Plus className="w-6 h-6" />
          Create New Item
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
            <div className="glass-morphism shimmer-effect rounded-3xl shadow-2xl p-10 w-full max-w-2xl transform transition-all duration-300 scale-100 animate-slideUp">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white text-lg placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Enter item title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-6 py-4 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white text-lg placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                    placeholder="Enter item description..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        {editingItem ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="text-center py-20 glass-morphism shimmer-effect rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400 text-xl">
              No items yet. Create your first one!
            </p>
          </div>
        ) : (
          renderLayout()
        )}
      </div>
    </div>
  );
}
