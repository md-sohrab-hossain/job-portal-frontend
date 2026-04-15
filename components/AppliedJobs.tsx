"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Application } from "@/types/job";
import { ROUTES } from "@/lib/routes";

interface AppliedJobsProps {
  applications: Application[];
}

const getStatusStyles = (status: string | undefined) => {
  const s = status?.toLowerCase();
  if (s === "accepted") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (s === "rejected") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const EmptyState = () => (
  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center">
    <div className="bg-amber-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Briefcase className="h-8 w-8 text-amber-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">
      No applications yet
    </h3>
    <p className="text-gray-500 max-w-xs mx-auto">
      You haven&apos;t applied to any jobs. Start your career journey today!
    </p>
    <Link
      href={ROUTES.FIND_JOBS}
      className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
    >
      Browse Jobs <ChevronRight className="h-4 w-4" />
    </Link>
  </div>
);

const ApplicationCard = ({ application }: { application: Application }) => {
  const jobId = application.job?.id;
  const companyName = application.job?.company?.name || "Unknown Company";

  if (!jobId) return null;

  return (
    <Link href={ROUTES.JOB_DETAILS(jobId)} className="group">
      <div className="h-full bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all group-hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)] group-hover:border-amber-100/50 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant="outline"
            className={`capitalize px-3 py-1 text-[10px] font-bold tracking-widest ring-1 ring-inset shadow-sm ${getStatusStyles(application.status)}`}
          >
            {application.status || "Pending"}
          </Badge>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <Calendar className="h-3 w-3" />
            {formatDate(application.createdAt)}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-amber-50 group-hover:border-amber-100/50 transition-colors overflow-hidden">
            {application.job?.company?.logo ? (
              <Image
                src={application.job.company.logo}
                alt={`${companyName} logo`}
                width={48}
                height={48}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <Briefcase className="h-6 w-6 text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
              {application.job?.title || "Position Unavailable"}
            </h3>
            <p className="text-xs text-gray-500 truncate">{companyName}</p>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Active
            </span>
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

const AppliedJobs: React.FC<AppliedJobsProps> = ({ applications }) => {
  if (!applications?.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
};

export default AppliedJobs;
