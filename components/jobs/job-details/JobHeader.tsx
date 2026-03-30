import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { JobDetail } from "@/types/job";

interface JobHeaderProps {
  job: JobDetail;
  isApplied: boolean;
  isSaved: boolean;
  isLoading: boolean;
  onApply: () => void;
  onSave: () => void;
}

export function JobHeader({
  job,
  isApplied,
  isSaved,
  isLoading,
  onApply,
  onSave,
}: JobHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {job.company?.logo ? (
          <Image
            src={job.company.logo}
            alt={job.company.name}
            width={64}
            height={64}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {job.company?.name?.charAt(0).toUpperCase() || "C"}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-600 font-medium">{job.company?.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>📍 {job.location}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2">
        <Button
          onClick={onApply}
          disabled={isApplied || isLoading}
          className={`flex-1 ${
            isApplied
              ? "bg-gray-400 hover:bg-gray-400"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {isLoading ? "Applying..." : isApplied ? "✓ Applied" : "Apply Now"}
        </Button>
        <Tooltip text={isSaved ? "Remove from saved" : "Save this job for later"}>
          <Button
            onClick={onSave}
            variant="outline"
            className={`flex-1 border-amber-500 cursor-pointer ${
              isSaved
                ? "bg-amber-50 text-amber-600"
                : "text-amber-500 hover:bg-amber-50"
            }`}
          >
            {isSaved ? "★ Saved" : "☆ Save"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
