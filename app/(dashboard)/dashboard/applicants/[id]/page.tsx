import { authFetch } from "@/lib/server-api";
import { Applicant, Application } from "@/types/job";
import { redirect } from "next/navigation";
import React from "react";
import { ApplicantProfile } from "@/components/jobs/ApplicantProfile";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string; // This is the user/applicant ID
  }>;
  searchParams: Promise<{
    jobId?: string;
  }>;
}

const ApplicantProfilePage = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { jobId } = await searchParams;

  if (!id) {
    redirect("/dashboard/jobs");
  }

  // Fetch candidate details
  const userResponse = await authFetch(`/user/${id}`, "GET", undefined, {
    requireAuth: true,
  });

  const userResult = await userResponse.json();

  if (!userResult.success) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">Candidate Not Found</h1>
        <p className="text-gray-400">The candidate profile you are looking for does not exist or you do not have permission to view it.</p>
        <a href="/dashboard/jobs" className="text-amber-400 hover:underline mt-4 inline-block">Return to Dashboard</a>
      </div>
    );
  }

  const applicant: Applicant = userResult.data;

  // If jobId is provided, find the application for this user and job
  let application: Application | undefined = undefined;
  if (jobId) {
    // We could have a specific endpoint for this, but for now we can fetch the job's applicants and find the one
    const applicantsResponse = await authFetch(`/applications/${jobId}/applicants`, "GET", undefined, {
      requireAuth: true,
    });
    const applicantsResult = await applicantsResponse.json();
    if (applicantsResult.success && applicantsResult.data?.applications) {
      application = applicantsResult.data.applications.find(
        (app: Application) => app.applicantId === id
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a 
            href={jobId ? `/dashboard/jobs/${jobId}` : "/dashboard/jobs"} 
            className="p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-all border border-gray-700/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Profile</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Application Management</p>
          </div>
        </div>
      </div>

      <ApplicantProfile 
        applicant={applicant} 
        application={application}
      />
    </div>
  );
};

export default ApplicantProfilePage;
