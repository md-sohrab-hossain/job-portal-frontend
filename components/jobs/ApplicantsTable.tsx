"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, User, Eye, Check, X } from "lucide-react";
import { useApplicationStatus } from "@/hooks/useApplicationStatus";
import type { Job } from "@/types/application";
import { ROUTES } from "@/lib/routes";

interface ApplicantsTableProps {
  job: Job;
}

const getStatusStyles = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "accepted")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "rejected") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString.split("T")[0];
  }
};

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({ job }) => {
  const [applications, setApplications] = useState(job?.applications || []);

  const { updateStatus } = useApplicationStatus();

  const handleStatusUpdate = async (status: string, applicationId: string) => {
    const success = await updateStatus(applicationId, status);
    if (success) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: status.toLowerCase() }
            : app,
        ),
      );
    }
  };

  if (!applications.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <User className="h-10 w-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">
          No candidates have applied yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow>
            <TableHead className="font-semibold text-gray-600">
              Candidate
            </TableHead>
            <TableHead className="font-semibold text-gray-600">
              Contact
            </TableHead>
            <TableHead className="font-semibold text-gray-600">
              Applied
            </TableHead>
            <TableHead className="font-semibold text-gray-600">
              Status
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-100">
                    <AvatarImage src={app.applicant?.profilePhoto} />
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-sm font-bold">
                      {app.applicant?.fullname?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {app.applicantId && (
                      <Link
                        href={ROUTES.ADMIN.APPLICANT_PROFILE(
                          app.applicantId,
                          job.id,
                        )}
                        className="font-semibold text-gray-900 hover:text-amber-600 hover:underline"
                      >
                        {app.applicant?.fullname}
                      </Link>
                    )}
                    {!app.applicantId && (
                      <span className="font-semibold text-gray-900">
                        {app.applicant?.fullname}
                      </span>
                    )}
                    {app.applicant?.resume && (
                      <a
                        href={app.applicant.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-amber-600 hover:text-amber-700"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate max-w-50">
                      {app.applicant?.email}
                    </span>
                  </div>
                  {app.applicant?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>{app.applicant.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-300" />
                  {formatDate(app.createdAt || "")}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`capitalize font-medium ${getStatusStyles(app.status)}`}
                >
                  {app.status || "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleStatusUpdate("Accepted", app.id)}
                    title="Accept"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleStatusUpdate("Rejected", app.id)}
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {app.applicantId && (
                    <Link
                      href={ROUTES.ADMIN.APPLICANT_PROFILE(
                        app.applicantId,
                        job.id,
                      )}
                      className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 px-3 py-2 rounded-md hover:bg-amber-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
