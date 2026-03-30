"use client";

import FilterJobs from "./FilterJobs";
import { X } from "lucide-react";

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilters({ isOpen, onClose }: MobileFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <FilterJobs />
        </div>
      </div>
    </div>
  );
}
