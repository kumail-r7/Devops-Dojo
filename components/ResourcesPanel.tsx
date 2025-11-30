import React, { useState } from 'react';
import { Link, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Resource } from '../types';

interface ResourcesPanelProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onRemoveResource: (id: string) => void;
}

export const ResourcesPanel: React.FC<ResourcesPanelProps> = ({ resources, onAddResource, onRemoveResource }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddResource({
        id: Date.now().toString(),
        url: url.startsWith('http') ? url : `https://${url}`,
        title: title.trim() || url
      });
      setUrl('');
      setTitle('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-slate-600 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        <Link className="w-5 h-5 text-indigo-500" />
        Session Resources
      </h3>
      
      <form onSubmit={handleAdd} className="space-y-3 mb-6">
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL (docs, blog, video)..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link Title (optional)"
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
          />
          <button 
            type="submit"
            disabled={!url.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 text-white p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {resources.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center italic py-2">No resources added yet.</p>
        )}
        {resources.map(res => (
          <div key={res.id} className="group flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 transition-all">
            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden flex-1">
              <ExternalLink className="w-3 h-3 text-indigo-500 shrink-0" />
              <div className="truncate">
                <div className="text-sm text-slate-700 dark:text-slate-200 truncate font-medium">{res.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{res.url}</div>
              </div>
            </a>
            <button 
              onClick={() => onRemoveResource(res.id)}
              className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};