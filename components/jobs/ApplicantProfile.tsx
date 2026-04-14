"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Briefcase,
  Download,
  ExternalLink,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { useApplicationStatus } from "@/hooks/useApplicationStatus";
import type { Applicant, Application } from "@/types/application";
import { ROUTES } from "@/lib/routes";

interface ApplicantProfileProps {
  applicant: Applicant;
  application?: Application;
  onStatusChange?: (status: string) => void;
  showBackLink?: boolean;
}

const getStatusBadge = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "accepted") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        Accepted
      </Badge>
    );
  }
  if (s === "rejected") {
    return (
      <Badge className="bg-rose-100 text-rose-700 border-rose-200">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200">
      Pending
    </Badge>
  );
};

export const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
  applicant,
  application,
  onStatusChange,
  showBackLink = false,
}) => {
  const { updateStatus, updating } = useApplicationStatus({
    onSuccess: onStatusChange,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          {showBackLink && (
            <Link
              href={ROUTES.ADMIN.JOBS}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          )}

          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-amber-50 mb-4">
              <AvatarImage
                src={applicant.profilePhoto}
                alt={applicant.fullname}
              />
              <AvatarFallback className="bg-amber-100 text-amber-700 text-xl font-bold">
                {applicant.fullname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold text-gray-900">
              {applicant.fullname}
            </h2>
            <p className="text-sm text-gray-500">{applicant.email}</p>

            <div className="mt-4">{getStatusBadge(application?.status)}</div>

            <div className="mt-6 w-full space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-amber-500" />
                <span className="truncate">{applicant.email}</span>
              </div>
              {applicant.phoneNumber && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-amber-500" />
                  <span>{applicant.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {application && (
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
            <h3 className="text-sm font-semibold text-amber-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => updateStatus(application.id, "Accepted")}
                disabled={updating || application.status === "accepted"}
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Check className="h-4 w-4" /> Accept
              </Button>
              <Button
                onClick={() => updateStatus(application.id, "Rejected")}
                disabled={updating || application.status === "rejected"}
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 gap-2"
              >
                <X className="h-4 w-4" /> Reject
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Professional Bio
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {applicant.bio || "No bio provided by the candidate."}
          </p>
        </section>

        <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {applicant.skills?.length ? (
              applicant.skills.map((skill, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No skills listed</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
          {applicant.resume ? (
            <div className="flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {applicant.resumeOriginalName || "Resume.pdf"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={applicant.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white text-gray-600 hover:text-amber-600 border border-gray-200"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={applicant.resume}
                  download
                  className="p-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No resume uploaded</p>
          )}
        </section>
      </div>
    </div>
  );
};
