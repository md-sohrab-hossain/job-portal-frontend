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

  const normalizedJob = {
    ...data,
    id: data.id || (data as any)._id,
    company: data.company ? {
      ...data.company,
      id: data.company.id || (data.company as any)._id
    } : data.company
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <JobDetails job={normalizedJob} jobId={jobId} />
    </div>
  );
}
