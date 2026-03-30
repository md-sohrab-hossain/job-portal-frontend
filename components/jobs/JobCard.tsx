"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tooltip } from "../ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import {
  getDaysAgo,
  formatSalary,
  formatJobType,
  pluralize,
} from "@/lib/utils";
import {
  Bookmark,
  MapPin,
  Briefcase,
  Users,
  Clock,
  Building2,
} from "lucide-react";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;
    const checkStatus = async () => {
      try {
        const response = await api.applications.checkApplied(job.id);
        if (mounted && response.success && typeof response.data === "boolean") {
          setIsApplied(response.data);
        }
      } catch {
        // Silent fail
      }
    };
    checkStatus();

    return () => {
      mounted = false;
    };
  }, [job.id, isAuthenticated]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to save jobs");
      router.push(ROUTES.LOGIN);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.jobs.favorite(job.id);
      if (response.success) {
        setIsFavorite(!isFavorite);
        toast.success(
          response.message ||
            (isFavorite ? "Removed from favorites" : "Added to favorites"),
        );
      } else {
        toast.error(response.message || "Failed to update favorite");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to apply for jobs");
      router.push(ROUTES.LOGIN);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.jobs.apply(job.id);
      if (response.success) {
        toast.success(response.message || "Application submitted successfully");
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

  const handleViewDetails = () => {
    router.push(`/findjobs/${job.id}`);
  };

  const isRemote = job.jobType?.toLowerCase() === "remote";

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-6 rounded-2xl border bg-white transition-all duration-300 ${
        isHovered
          ? "shadow-xl -translate-y-1 border-amber-200"
          : "shadow-md border-gray-100"
      }`}
    >
      {isFavorite && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full" />
      )}

      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {getDaysAgo(job.createdAt)}
        </span>
        <Tooltip text={isFavorite ? "Remove from saved" : "Save for later"}>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className="rounded-full transition-all border-amber-200 cursor-pointer text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            aria-label="Add to favorites"
          >
            <Bookmark
              className={`w-5 h-5 ${isFavorite ? "fill-amber-500" : ""}`}
            />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Avatar className="w-14 h-14 border-2 border-gray-50 rounded-full">
            {job.company?.logo ? (
              <AvatarImage
                src={job.company.logo}
                alt={`${job.company.name || "Company"} logo`}
              />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-500">
                <Building2 className="w-6 h-6" />
              </AvatarFallback>
            )}
          </Avatar>
          {isRemote && (
            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
              Remote
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">
            {job.title || "Job Title"}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
            <Building2 className="w-4 h-4 text-gray-400" />
            {job.company?.name || "Company Name"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge className="font-medium text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-100">
          <MapPin className="w-3 h-3 mr-1.5" />
          {job.location || "Bangladesh"}
        </Badge>
        <Badge className="font-medium text-xs px-3 py-1.5 bg-purple-50 text-purple-700 border-purple-100">
          <Briefcase className="w-3 h-3 mr-1.5" />
          {formatJobType(job.jobType)}
        </Badge>
        <Badge className="font-medium text-xs px-3 py-1.5 bg-green-50 text-green-700 border-green-100">
          BDT {formatSalary(job.salary)}
        </Badge>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-10">
        {job.description || "No description available"}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span className="font-medium">{job.position || 1}</span>
          <span>{pluralize(job.position || 1, "position")}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="rounded-lg border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-600 font-medium text-sm px-4 cursor-pointer"
          >
            Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            disabled={isApplied || isLoading}
            className={`${
              isApplied
                ? "bg-green-500 hover:bg-green-600"
                : "bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
            } text-black font-medium rounded-lg text-sm px-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default JobCard;
