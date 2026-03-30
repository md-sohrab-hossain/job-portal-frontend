import { JobDetail } from "@/types/job";
import { Badge } from "@/components/ui/badge";

interface JobDescriptionProps {
  job: JobDetail;
}

export function JobDescription({ job }: JobDescriptionProps) {
  return (
    <>
      {job.profileSkills && job.profileSkills.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.profileSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-amber-300 text-amber-700"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600">
                <span className="text-amber-500 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
