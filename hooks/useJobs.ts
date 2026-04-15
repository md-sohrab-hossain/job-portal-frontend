"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { type Job, type JobFormData } from "@/types/job";
import { type ApiResponse } from "@/types/api";
import { toast } from "sonner";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const normalizeJob = (j: any): Job => ({
    ...j,
    id: j.id || j._id,
    company: j.company ? {
      ...j.company,
      id: j.company.id || j.company._id
    } : undefined
  });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await api.jobs.adminList()) as ApiResponse<Job[]>;
      if (res.success && res.data) {
        setJobs(res.data.map(normalizeJob));
      } else {
        setError(res.message || res.error || "Failed to load jobs");
      }
    } catch (err) {
      setError("An unexpected error occurred while loading jobs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const addJob = async (formData: JobFormData) => {
    const previousJobs = [...jobs];
    const temporaryId = `temp-${Date.now()}`;
    
    // Convert comma string to array for backend
    const requirementsArray = formData.requirements
      ? formData.requirements.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const res = (await api.jobs.create({
      ...formData,
      requirements: requirementsArray,
    })) as ApiResponse<Job>;

    if (res.success && res.data) {
      setJobs((prev) => [normalizeJob(res.data!), ...prev]);
      toast.success("Job posted successfully");
      return true;
    } else {
      toast.error(res.message || res.error || "Failed to post job");
      return false;
    }
  };

  const updateJob = async (id: string, formData: JobFormData) => {
    const previousJobs = [...jobs];
    
    const requirementsArray = formData.requirements
      ? formData.requirements.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const res = (await api.jobs.update(id, {
      ...formData,
      requirements: requirementsArray,
    })) as ApiResponse<Job>;

    if (res.success && res.data) {
      const normalized = normalizeJob(res.data);
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? normalized : j))
      );
      toast.success("Job updated successfully");
      return true;
    } else {
      toast.error(res.error || "Failed to update job");
      return false;
    }
  };

  const deleteJob = async (id: string) => {
    const previousJobs = [...jobs];
    setJobs((prev) => prev.filter((j) => j.id !== id));

    const res = await api.jobs.delete(id);
    if (res.success) {
      toast.success("Job deleted");
      return true;
    } else {
      setJobs(previousJobs);
      toast.error(res.message || "Delete failed");
      return false;
    }
  };

  return {
    jobs,
    loading,
    error,
    refresh: loadJobs,
    addJob,
    updateJob,
    deleteJob,
  };
}
