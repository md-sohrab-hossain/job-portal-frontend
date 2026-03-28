"use client";

import { useRouter } from "next/navigation";
import { getFindJobsUrl } from "@/lib/routes";
import SearchForm from "./SearchForm";

const MainSection = () => {
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm?.trim()) return;
    router.push(getFindJobsUrl(searchTerm));
  };

  return (
    <div className="text-center text-white">
      <div className="flex flex-col gap-5 my-10">
        <div className="mx-auto">
          <div className="text-yellow-400 px-4 py-2 rounded-full bg-black/50 font-semibold">
            No. 1 Job Searching Site
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-yellow-400">Discover</span>, Apply{" "}
          <span className="text-yellow-400">&</span> <br /> Land your Perfect
          Job
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto px-4">
          Search and apply for thousands of jobs from top companies. Find your
          next career opportunity today.
        </p>

        <SearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default MainSection;
