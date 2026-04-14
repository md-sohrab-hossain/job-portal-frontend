import ApplicantsTable from "@/components/jobs/ApplicantsTable";
import { authFetch } from "@/lib/server-api";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const JobIdPage = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard/jobs");
  }

  const response = await authFetch(`/applications/${id}/applicants`, "GET", undefined, {
    requireAuth: true,
  });

  const result = await response.json();

  if (!result.success) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
        <div className="bg-white rounded-xl p-8 text-center border border-red-200">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Applicants</h1>
          <p className="text-gray-500">{result.error || "Failed to fetch candidates"}</p>
        </div>
      </div>
    );
  }

  const job = result.data;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Applicants
          <span className="text-gray-400 ml-2 font-normal">
            for {job?.title}
          </span>
        </h1>
        <p className="text-gray-400 mt-1">
          {job?.company?.name} • {job?.applications?.length || 0} applicant(s)
        </p>
      </div>

      <ApplicantsTable job={job} />
    </div>
  );
};

export default JobIdPage;
