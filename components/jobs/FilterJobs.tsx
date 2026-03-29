"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { filterData } from "@/lib/data";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const FilterJobs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams = useMemo(
    () => ({
      keyword: searchParams.get("keyword") || undefined,
      location: searchParams.get("location") || undefined,
      jobType: searchParams.get("jobType") || undefined,
      salary: searchParams.get("salary") || undefined,
    }),
    [searchParams],
  );

  const isActive = (filterType: string, value: string): boolean => {
    if (filterType === "Location") return currentParams.location === value;
    if (filterType === "Job Type") return currentParams.jobType === value;
    if (filterType === "Salary Range") return currentParams.salary === value;
    return false;
  };

  const handleFilterClick = useCallback(
    (filterType: string, value: string) => {
      const newParams = { ...currentParams };

      if (filterType === "Job Type") {
        newParams.jobType = currentParams.jobType === value ? undefined : value;
      } else if (filterType === "Location") {
        newParams.location =
          currentParams.location === value ? undefined : value;
      } else if (filterType === "Salary Range") {
        newParams.salary = currentParams.salary === value ? undefined : value;
      }

      const queryParams = new URLSearchParams();
      if (newParams.keyword) queryParams.set("keyword", newParams.keyword);
      if (newParams.location) queryParams.set("location", newParams.location);
      if (newParams.jobType) queryParams.set("jobType", newParams.jobType);
      if (newParams.salary) queryParams.set("salary", newParams.salary);

      router.push(`/findjobs?${queryParams.toString()}`);
    },
    [currentParams, router],
  );

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (currentParams.keyword) params.set("keyword", currentParams.keyword);
    const queryString = params.toString();
    router.push(queryString ? `/findjobs?${queryString}` : "/findjobs");
  };

  const hasActiveFilters =
    currentParams.location || currentParams.jobType || currentParams.salary;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-4">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {filterData.map((data, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="w-full"
            defaultValue={index === 0 ? `filter-${index}` : undefined}
          >
            <AccordionItem
              value={`filter-${index}`}
              className="border-b-0 py-1"
            >
              <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline hover:text-gray-900 py-2">
                <span className="flex items-center gap-2">
                  {data.filterType}
                  {currentParams.location && data.filterType === "Location" && (
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                  {currentParams.jobType && data.filterType === "Job Type" && (
                    <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                  {currentParams.salary &&
                    data.filterType === "Salary Range" && (
                      <span className="w-2 h-2 bg-amber-400 rounded-full" />
                    )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-1">
                  {data.array.map((item, ind) => {
                    const active = isActive(data.filterType, item);
                    return (
                      <button
                        key={ind}
                        onClick={() => handleFilterClick(data.filterType, item)}
                        className={`flex items-center w-full text-left py-2 px-3 rounded-lg transition-all text-sm ${
                          active
                            ? "bg-amber-50 text-amber-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 mr-3 flex items-center justify-center border rounded ${
                            active
                              ? "bg-amber-400 border-amber-400"
                              : "border-gray-300"
                          }`}
                        >
                          {active && <Check className="w-3 h-3 text-white" />}
                        </span>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FilterJobs;
