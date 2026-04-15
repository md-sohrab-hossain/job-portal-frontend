"use client";

import { useState, useEffect, useRef } from "react";
import {
  FilterJobs,
  SearchBar,
  JobResultsHeader,
  JobContent,
  MobileFilters,
} from "@/components/jobs";
import type { Job as JobType } from "@/types/job";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SearchParams {
  keyword?: string;
  location?: string;
  jobType?: string;
  salary?: string;
}

function FindJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || "",
  );
  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") || "",
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentParams: SearchParams = {
    keyword: searchParams.get("keyword") || undefined,
    location: searchParams.get("location") || undefined,
    jobType: searchParams.get("jobType") || undefined,
    salary: searchParams.get("salary") || undefined,
  };

  const fetchJobs = async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const cleanParams: Record<string, string> = {};
      if (params.keyword) cleanParams.keyword = params.keyword;
      if (params.location) cleanParams.location = params.location;
      if (params.jobType) cleanParams.jobType = params.jobType;
      if (params.salary) cleanParams.salary = params.salary;

      const data = await api.jobs.getAll(cleanParams);

      if (data.success && data.data) {
        setJobs(data.data as unknown as JobType[]);
      } else {
        setError(data.message || data.error || "Failed to fetch jobs");
        setJobs([]);
      }
    } catch {
      setError("Network error. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!mounted) return;

      setLoading(true);
      setError(null);

      try {
        const cleanParams: Record<string, string> = {};
        if (currentParams.keyword) cleanParams.keyword = currentParams.keyword;
        if (currentParams.location)
          cleanParams.location = currentParams.location;
        if (currentParams.jobType) cleanParams.jobType = currentParams.jobType;
        if (currentParams.salary) cleanParams.salary = currentParams.salary;

        const data = await api.jobs.getAll(cleanParams);
        if (!mounted) return;

        if (data.success && data.data) {
          setJobs(data.data as unknown as JobType[]);
        } else {
          setError(data.message || data.error || "Failed to fetch jobs");
          setJobs([]);
        }
      } catch {
        if (!mounted) return;
        setError("Network error. Please try again.");
        setJobs([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [
    currentParams.keyword,
    currentParams.location,
    currentParams.jobType,
    currentParams.salary,
  ]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const queryParams = new URLSearchParams();
      if (searchInput.trim()) queryParams.set("keyword", searchInput.trim());
      if (locationInput.trim())
        queryParams.set("location", locationInput.trim());
      if (currentParams.jobType)
        queryParams.set("jobType", currentParams.jobType);
      if (currentParams.salary) queryParams.set("salary", currentParams.salary);

      const queryString = queryParams.toString();
      const currentPath = window.location.pathname;
      const currentQuery = window.location.search;
      const newPath = `/findjobs${queryString ? `?${queryString}` : ""}`;

      if (newPath !== `${currentPath}${currentQuery}`) {
        router.push(newPath);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    searchInput,
    locationInput,
    currentParams.jobType,
    currentParams.salary,
    router,
  ]);

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
    const remainingParams = new URLSearchParams();
    if (currentParams.jobType)
      remainingParams.set("jobType", currentParams.jobType);
    if (currentParams.salary)
      remainingParams.set("salary", currentParams.salary);

    const queryString = remainingParams.toString();
    router.push(`/findjobs${queryString ? `?${queryString}` : ""}`);
  };

  const activeFiltersCount = [
    currentParams.location,
    currentParams.jobType,
    currentParams.salary,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-primaryColor pb-16">
      <SearchBar
        searchInput={searchInput}
        locationInput={locationInput}
        showMobileFilters={showMobileFilters}
        activeFiltersCount={activeFiltersCount}
        keyword={currentParams.keyword}
        onSearchInputChange={setSearchInput}
        onLocationInputChange={setLocationInput}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
        onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterJobs />
          </aside>

          <MobileFilters
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
          />

          <main className="flex-1 min-w-0">
            <JobResultsHeader jobCount={jobs.length} loading={loading} />
            <JobContent
              jobs={jobs}
              loading={loading}
              error={error}
              onRetry={() => fetchJobs(currentParams)}
              onClearFilters={clearSearch}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default FindJobsContent;
