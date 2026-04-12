import { notFound } from "next/navigation";
import { publicFetch } from "@/lib/server-api";
import type { JobDetail } from "@/types/job";
import { JobDetails } from "@/components/jobs";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ jodid: string }>;
}) {
  const { jodid: jobId } = await params;
  const { data, error } = await publicFetch<JobDetail>(`/job/${jobId}`);

  if (error || !data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <JobDetails job={data} jobId={jobId} />
    </div>
  );
}
