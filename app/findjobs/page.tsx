"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import FilterJobs from "@/components/jobs/FilterJobs";
import JobCard from "@/components/jobs/Job";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/constants";
import type { Job as JobType } from "@/types/job";
import { Search, MapPin, Loader2, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

interface SearchParams {
  keyword?: string;
  location?: string;
  jobType?: string;
  salary?: string;
}

interface JobsResponse {
  success: boolean;
  data?:
    | JobType[]
    | {
        jobs?: JobType[];
        total?: number;
        page?: number;
      };
  jobs?: JobType[];
  message?: string;
  error?: string;
}

export default function FindJobs() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const prevParamsRef = useRef<string>("");

  const fetchJobs = useCallback((params: SearchParams) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.location) queryParams.append("location", params.location);
    if (params.jobType) queryParams.append("jobType", params.jobType);
    if (params.salary) queryParams.append("salary", params.salary);

    const queryString = queryParams.toString();
    const url = `${API_URL}/job${queryString ? `?${queryString}` : ""}`;

    fetch(url, {
      cache: "no-cache",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data: JobsResponse) => {
        let jobs: JobType[] = [];

        if (Array.isArray(data.data)) {
          jobs = data.data;
        } else if (data.data?.jobs && Array.isArray(data.data.jobs)) {
          jobs = data.data.jobs;
        } else if (Array.isArray(data.jobs)) {
          jobs = data.jobs;
        }

        if (data.success) {
          setJobs(jobs);
        } else {
          setError(data.message || data.error || "Failed to fetch jobs");
          setJobs([]);
        }
      })
      .catch(() => {
        setError("Network error. Please try again.");
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const currentParams = useMemo(
    (): SearchParams => ({
      keyword: searchParams.get("keyword") || undefined,
      location: searchParams.get("location") || undefined,
      jobType: searchParams.get("jobType") || undefined,
      salary: searchParams.get("salary") || undefined,
    }),
    [searchParams],
  );

  useEffect(() => {
    const paramsString = JSON.stringify(currentParams);
    if (paramsString !== prevParamsRef.current) {
      prevParamsRef.current = paramsString;
      fetchJobs(currentParams);
    }
  }, [currentParams, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchInput.trim()) queryParams.set("keyword", searchInput.trim());
    if (locationInput.trim()) queryParams.set("location", locationInput.trim());

    const queryString = queryParams.toString();
    router.push(`/findjobs${queryString ? `?${queryString}` : ""}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    setLocationInput("");
    if (currentParams.keyword || currentParams.location) {
      const remainingParams = new URLSearchParams();
      if (currentParams.jobType)
        remainingParams.set("jobType", currentParams.jobType);
      if (currentParams.salary)
        remainingParams.set("salary", currentParams.salary);
      router.push(
        `/findjobs${remainingParams.toString() ? `?${remainingParams.toString()}` : ""}`,
      );
    }
  };

  const activeFiltersCount = [
    currentParams.location,
    currentParams.jobType,
    currentParams.salary,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-primaryColor pb-16">
      <div className="border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search job titles, keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-base"
              />
            </div>
            <div className="relative sm:w-64">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="City or area..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {(searchInput || locationInput) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="h-12 px-4 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="h-12 px-8 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
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

          {currentParams.keyword && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Showing results for:
              </span>
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                &ldquo;{currentParams.keyword}&rdquo;
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterJobs />
          </aside>

          {showMobileFilters && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
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
          )}

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {loading
                  ? "Searching..."
                  : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sort by:</span>
                <select className="bg-transparent border-none text-gray-700 font-medium cursor-pointer focus:outline-none">
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                  <option>Most Applied</option>
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-500">
                  Finding the best jobs for you...
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <X className="w-10 h-10 text-red-400" />
                </div>
                <p className="text-red-500 font-medium mb-2">{error}</p>
                <button
                  onClick={() => fetchJobs(currentParams)}
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-32 h-32 mb-6 relative">
                  <Image
                    src="https://app.hrango.com:4414/assets/images/no-data-folder.svg"
                    alt="No jobs found"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-black font-medium rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!loading && !error && jobs.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!loading && !error && jobs.length > 6 && (
              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 bg-white border border-gray-200 hover:border-amber-400 text-gray-700 font-medium rounded-xl transition-all hover:shadow-md">
                  Load more jobs
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
