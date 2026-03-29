"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@mantine/hooks";
import { toast } from "sonner";
import { JobDetailsProps } from "@/types/job";
import { AuthUser } from "@/types/api";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";

export default function JobDetails({ job, jobId }: JobDetailsProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useLocalStorage<AuthUser | null>({
    key: "userData",
    defaultValue: null,
  });
  const router = useRouter();

  const isAuthenticated = !!user;

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
      const response = await api.jobs.apply(jobId);

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
        toast.success(response.message || "Added to favorites");
      } else {
        toast.error(response.message || "Failed to add to favorites");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const postedDate = job?.createdAt?.split("T")?.[0];
  const applicantCount = job?.applications?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">{job?.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{job?.position} positions</Badge>
            <Badge variant="secondary">{job?.jobType}</Badge>
            <Badge variant="secondary">${job?.salary?.toLocaleString()}</Badge>
          </div>
        </div>
        <Button
          onClick={handleApply}
          disabled={isApplied || isLoading}
          className={`min-w-35 ${
            isApplied
              ? "bg-gray-500 hover:bg-gray-500"
              : "bg-amber-400 hover:bg-amber-500 text-black"
          }`}
        >
          {isLoading ? "Applying..." : isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-amber-500 mb-4 border-b pb-2">
          Job Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <DetailRow label="Role" value={job?.title} />
          <DetailRow label="Location" value={job?.location} />
          <DetailRow label="Experience" value={`${job?.experienceLevel}`} />
          <DetailRow
            label="Salary"
            value={`$${job?.salary?.toLocaleString()}`}
          />
          <DetailRow label="Total Applicants" value={String(applicantCount)} />
          <DetailRow label="Posted Date" value={postedDate} />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {job?.description}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleFavorite}
            variant="outline"
            className="border-amber-400 text-amber-500 hover:bg-amber-50"
          >
            Save For Later
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-600">{value || "N/A"}</span>
    </div>
  );
}
