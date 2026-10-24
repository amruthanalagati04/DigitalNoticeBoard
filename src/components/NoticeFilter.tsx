import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { NoticeCategory } from '../types/index.js';

interface NoticeFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'All', label: 'All Notices' },
  { key: 'Academic', label: 'Academic' },
  { key: 'Examination', label: 'Examination' },
  { key: 'Events', label: 'Events' },
  { key: 'Placement', label: 'Placement' },
  { key: 'General', label: 'General' },
];

export const NoticeFilter: React.FC<NoticeFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categoryCounts,
  totalCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices by title, keywords, or department..."
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Segmented Control / Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count =
            cat.key === 'All'
              ? totalCount
              : categoryCounts
              ? categoryCounts[cat.key as NoticeCategory]
              : undefined;

          return (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isSelected ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
