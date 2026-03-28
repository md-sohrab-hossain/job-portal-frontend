import Image from "next/image";
import { Job } from "@/types/job";
import { Badge } from "./ui/badge";
import { Briefcase, Building2 } from "lucide-react";

const LatestJobCard = ({ job }: { job: Job }) => {
  const hasLogo = !!job.company?.logo;

  return (
    <div className="p-5 rounded-2xl shadow-xl flex flex-col gap-4 bg-black/40 border border-gray-800 hover:border-yellow-400/50 transition-all cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 bg-white rounded-lg flex items-center justify-center">
          {hasLogo ? (
            <Image
              src={job.company!.logo!}
              alt={job.company!.name}
              fill
              className="object-contain rounded-lg"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-white truncate">{job.title}</h2>
          <p className="text-yellow-400 text-sm font-medium">
            {job.company?.name}
          </p>
        </div>
      </div>

      <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 mt-1">
        <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
          <Briefcase className="w-3 h-3 mr-1" />
          {job.position} {job.position === 1 ? "position" : "positions"}
        </Badge>
        <Badge className="bg-blue-400/10 text-blue-400 border border-blue-400/20">
          {job.jobType}
        </Badge>
        <Badge className="bg-green-400/20 text-green-400 border border-green-400/30 text-base font-semibold py-1">
          BDT {job.salary.toLocaleString("en-US")}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCard;
