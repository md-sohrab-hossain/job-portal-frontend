import { Badge } from "@/components/ui/badge";
import { JobDetail } from "@/types/job";

interface JobInfoGridProps {
  job: JobDetail;
  postedDate: string;
}

export function JobInfoGrid({ job, postedDate }: JobInfoGridProps) {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge className="bg-amber-100 text-amber-700">
          {job.position} positions
        </Badge>
        <Badge className="bg-blue-100 text-blue-700">{job.jobType}</Badge>
        <Badge className="bg-green-100 text-green-700">
          ৳{job.salary?.toLocaleString()}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700">
          {job.experienceLevel}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InfoCard icon="📍" label="Location" value={job.location || "N/A"} />
        <InfoCard
          icon="💰"
          label="Salary"
          value={`৳${job.salary?.toLocaleString()}`}
        />
        <InfoCard icon="👔" label="Job Type" value={job.jobType || "N/A"} />
        <InfoCard
          icon="📊"
          label="Experience"
          value={String(job.experienceLevel) || "N/A"}
        />
        <InfoCard
          icon="👥"
          label="Applicants"
          value={String(job.applications?.length ?? 0)}
        />
        <InfoCard icon="📅" label="Posted" value={postedDate} />
      </div>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
