"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { JobDetailsProps } from "@/types/job";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { formatDaysAgo } from "@/lib/utils";
import { JobHeader } from "./JobHeader";
import { JobInfoGrid } from "./JobInfoGrid";
import { JobDescription } from "./JobDescription";
import { CompanySection } from "./CompanySection";

export default function JobDetails({ job, jobId }: JobDetailsProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const postedDate = formatDaysAgo(job?.createdAt);

  useEffect(() => {
    if (job && user) {
      const hasApplied = job.applications?.some(
        (app) => String(app.applicantId) === String(user.id),
      );
      setIsApplied(hasApplied ?? false);
    }
  }, [user, job]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.applications.apply(jobId);
      if (response.success) {
        toast.success(response.message || "Applied successfully");
        setIsApplied(true);
      } else {
        toast.error(response.message || "Failed to apply");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    try {
      const response = await api.jobs.favorite(jobId);
      if (response.success) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Removed from saved" : "Added to saved jobs");
      } else {
        toast.error(response.message || "Failed to save job");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-white cursor-pointer hover:text-amber-200 -ml-2"
      >
        ← Back to Jobs
      </Button>

      <JobHeader
        job={job}
        isApplied={isApplied}
        isSaved={isSaved}
        isLoading={isLoading}
        onApply={handleApply}
        onSave={handleFavorite}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <JobInfoGrid job={job} postedDate={postedDate} />
        <JobDescription job={job} />
        <CompanySection company={job.company} />
      </div>
    </div>
  );
}
