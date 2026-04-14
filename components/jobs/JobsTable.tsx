"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useJobs } from "@/hooks/useJobs";
import { useCompanies } from "@/hooks/useCompanies";
import { type Job } from "@/types/job";
import { type JobInput } from "@/lib/schemas/job";
import { JobRow } from "./JobRow";
import { JobFormModal } from "./JobFormModal";
import { DeleteConfirmModal } from "../companies/DeleteConfirmModal";

const EMPTY_FORM: JobInput = {
  title: "",
  description: "",
  requirements: "",
  salary: 0,
  location: "",
  jobType: "Full-time",
  experienceLevel: "Junior",
  position: 1,
  companyId: "",
};

export function JobsTable() {
  const { jobs, loading, error, refresh, addJob, updateJob, deleteJob } =
    useJobs();

  // Need companies list for the job form
  const { companies } = useCompanies();

  const [search, setSearch] = useState("");

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobInput>(EMPTY_FORM);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setDeleteId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements?.join(", ") || "",
      salary: job.salary,
      location: job.location || "",
      jobType: job.jobType,
      experienceLevel: job.experienceLevel || "Junior",
      position: job.position,
      companyId: job.company?.id || "",
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: JobInput) => {
    if (editingId) {
      return await updateJob(editingId, data);
    } else {
      return await addJob(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteJob(deleteId);
    setDeleteId(null);
    setIsDeleting(false);
  };

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company?.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [jobs, search],
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Area */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
          <div className="w-full sm:w-auto flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Job Postings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your job listings and track positions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-9 bg-gray-50/50 min-w-60"
                placeholder="Search jobs or companies…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={openCreate}
              className="bg-amber-400 hover:bg-amber-500 text-black font-medium gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" /> Post Job
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            </div>
          ) : error ? (
            <div className="text-center py-16 m-6 rounded-xl border border-red-100 bg-red-50">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
              <p className="mt-2 text-red-600 font-medium">{error}</p>
              <Button
                onClick={refresh}
                variant="outline"
                size="sm"
                className="mt-4 border-red-200 text-red-500 bg-white hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 m-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto" />
              <p className="mt-3 text-gray-600 font-medium">
                {search
                  ? `No jobs found for "${search}"`
                  : "No jobs posted yet"}
              </p>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                {search
                  ? "Try checking your search terms."
                  : "Start by posting your first job to attract quality candidates."}
              </p>
              {!search && (
                <Button
                  onClick={openCreate}
                  variant="outline"
                  className="mt-5 text-gray-600 hover:text-gray-900 border-gray-300 bg-white"
                >
                  Post your first job
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-100">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-600">
                    Job & Company
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 hidden md:table-cell">
                    Type & Positions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">
                    Location & Salary
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 hidden xl:table-cell">
                    Level
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600">
                    Applicants
                  </TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    onEdit={openEdit}
                    onDelete={setDeleteId}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modals */}
      <JobFormModal
        key={showForm ? editingId || "create" : "closed"}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={formData}
        isEditing={!!editingId}
        onSubmit={handleFormSubmit}
        companies={companies}
      />

      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Job Post?"
        description="Are you sure you want to delete this job post? Applications associated with it may also be lost. This cannot be undone."
      />
    </div>
  );
}
