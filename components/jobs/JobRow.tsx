"use client";

import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import {
  Edit2,
  Trash2,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
} from "lucide-react";
import { type Job } from "@/types/job";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface JobRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobRow({ job, onEdit, onDelete }: JobRowProps) {
  return (
    <TableRow className="hover:bg-amber-50/30 transition-colors group">
      <TableCell className="align-top pt-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
            <AvatarImage src={job.company?.logo} alt={job.company?.name} />
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
