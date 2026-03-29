import { notFound } from "next/navigation";
import JobDetails from "@/components/jobs/JobDetails";
import { api } from "@/lib/api";
import { JobDetail } from "@/types/job";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ jodid: string }>;
}) {
  const { jodid: jobId } = await params;
  const response = await api.jobs.getById(jobId);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <JobDetails job={response.data as JobDetail} jobId={jobId} />
    </div>
  );
}
