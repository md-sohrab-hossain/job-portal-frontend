"use client";

import { Input } from "@/components/ui/input";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  searchInput: string;
  locationInput: string;
  showMobileFilters: boolean;
  activeFiltersCount: number;
  keyword?: string;
  onSearchInputChange: (value: string) => void;
  onLocationInputChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  onToggleMobileFilters: () => void;
}

export function SearchBar({
  searchInput,
  locationInput,
  activeFiltersCount,
  keyword,
  onSearchInputChange,
  onLocationInputChange,
  onSearch,
  onClearSearch,
  onToggleMobileFilters,
}: SearchBarProps) {
  return (
    <div className="border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search job titles, keywords..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-base"
            />
          </div>
          <div className="relative sm:w-64">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="City or area..."
              value={locationInput}
              onChange={(e) => onLocationInputChange(e.target.value)}
              className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-12 px-8 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              type="button"
              onClick={onToggleMobileFilters}
              className="lg:hidden h-12 px-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors relative"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </form>

        {keyword && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-white">Showing results for:</span>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
              &ldquo;{keyword}&rdquo;
            </span>
            <button
              type="button"
              onClick={onClearSearch}
              className="text-sm text-white hover:text-amber-200 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
