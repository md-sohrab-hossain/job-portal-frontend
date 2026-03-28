import Link from "next/link";
import LatestJobCard from "../LatestJobCard";
import { Job } from "@/types/job";
import { getJobDetailsUrl } from "@/lib/routes";

interface LatestJobsProps {
  allJobs: Job[];
}

const LatestJobs = ({ allJobs = [] }: LatestJobsProps) => {
  const displayJobs = allJobs.slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto text-center my-20">
      <h1 className="text-4xl font-bold text-white mb-2">
        Latest & Top <span className="text-yellow-400">Job Openings</span>
      </h1>
      <p className="text-gray-400 mb-8">
        Find your dream job from the latest opportunities
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayJobs.length > 0 ? (
          displayJobs.map((job) => (
            <Link href={getJobDetailsUrl(job.id)} key={job.id}>
              <LatestJobCard job={job} />
            </Link>
          ))
        ) : (
          <p className="col-span-full text-gray-400">No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default LatestJobs;