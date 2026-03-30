"use client";

import { pluralize } from "@/lib/utils";

interface JobResultsHeaderProps {
  jobCount: number;
  loading: boolean;
}

export function JobResultsHeader({ jobCount, loading }: JobResultsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-white">
        {loading
          ? "Searching..."
          : `${jobCount} ${pluralize(jobCount, "job")} found`}
      </p>
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="text-white">Sort by:</span>
        <select className="bg-transparent border-none text-gray-700 font-medium cursor-pointer focus:outline-none">
          <option>Most Recent</option>
          <option>Highest Salary</option>
          <option>Most Applied</option>
        </select>
      </div>
    </div>
  );
}
