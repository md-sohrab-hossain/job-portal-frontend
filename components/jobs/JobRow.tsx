"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import {
  Edit2,
  Trash2,
  MapPin,
  Briefcase,
  Users,
  User,
  DollarSign,
  Eye,
} from "lucide-react";

import { type Job } from "@/types/job";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ROUTES } from "@/lib/routes";

interface JobRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobRow({ job, onEdit, onDelete }: JobRowProps) {
  const router = useRouter();
  return (
    <TableRow className="hover:bg-amber-50/30 transition-colors group">
      <TableCell className="align-top pt-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
            {job.company?.logo && (
              <AvatarImage src={job.company.logo} alt={job.company.name} />
            )}
            <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-bold">
              {job.company?.name?.charAt(0) || "J"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-gray-900 text-base">{job.title}</div>
            <div className="text-xs text-amber-600 font-medium">
              {job.company?.name}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="align-top pt-5 hidden md:table-cell">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Briefcase className="h-3.5 w-3.5 text-gray-400" />
            {job.jobType}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            {job.position} Position{job.position > 1 ? "s" : ""}
          </div>
        </div>
      </TableCell>

      <TableCell className="align-top pt-5 hidden lg:table-cell">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "BDT",
            }).format(job.salary)}
            /mo
          </div>
        </div>
      </TableCell>

      <TableCell className="align-top pt-5 hidden xl:table-cell">
        <Badge
          variant="outline"
          className="text-[10px] py-0 px-2 font-normal text-gray-500 border-gray-200"
        >
          {job.experienceLevel}
        </Badge>
      </TableCell>

      <TableCell className="align-top pt-5">
        <button
          onClick={() => router.push(ROUTES.ADMIN.APPLICANTS(job.id))}
          className="group/applicants flex items-center gap-3 hover:bg-amber-50 p-2 rounded-xl transition-all border border-transparent hover:border-amber-200 cursor-pointer w-full text-left"
          title="View Applicants"
        >
          <div className="flex -space-x-2.5">
            <div className="h-9 w-9 rounded-full border-2 border-white bg-amber-100/50 flex items-center justify-center shadow-sm ring-1 ring-amber-200/50">
              <Users className="h-4.5 w-4.5 text-amber-600" />
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {job.applications?.length || 0}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                Applied
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              Manage candidates
            </span>
          </div>

          <div className="opacity-0 group-hover/applicants:opacity-100 transition-all transform translate-x-2 group-hover/applicants:translate-x-0 bg-amber-100/50 p-2 rounded-lg border border-amber-200/50">
            <Eye className="h-4 w-4 text-amber-600" />
          </div>
        </button>
      </TableCell>

      <TableCell className="align-top pt-4 pr-6">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-amber-600 hover:bg-amber-50"
            onClick={() => onEdit(job)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(job.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
