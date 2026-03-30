"use client";

import { Loader2, X } from "lucide-react";
import Image from "next/image";
import type { Job as JobType } from "@/types/job";
import JobCard from "./JobCard";

interface JobContentProps {
  jobs: JobType[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function JobContent({
  jobs,
  loading,
  error,
  onRetry,
  onClearFilters,
}: JobContentProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-white">Finding the best jobs for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <X className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-red-500 font-medium mb-2">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 mb-6 relative">
          <Image
            src="https://app.hrango.com:4414/assets/images/no-data-folder.svg"
            alt="No jobs found"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
        <p className="text-white mb-4">Try adjusting your search or filters</p>
        <button
          onClick={onClearFilters}
          className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {jobs.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button className="px-8 py-3 bg-white border border-gray-200 hover:border-amber-400 text-gray-700 font-medium rounded-xl transition-all hover:shadow-md">
            Load more jobs
          </button>
        </div>
      )}
    </>
  );
}
