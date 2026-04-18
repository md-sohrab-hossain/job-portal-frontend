"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { jobSchema, type JobInput } from "@/lib/schemas/job";
import {
  JOB_FORM_FIELDS,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
} from "@/config/jobFormConfig";
import SelectForm from "../SelectForm";
import { type Company } from "@/types/company";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: JobInput;
  isEditing: boolean;
  onSubmit: (data: JobInput) => Promise<boolean>;
  companies: Company[];
}

export function JobFormModal({
  isOpen,
  onClose,
  initialData,
  isEditing,
  onSubmit,
  companies,
}: JobFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData,
  });

  // Sync form with initialData when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [initialData, isOpen, reset]);

  const onFormSubmit = async (data: JobInput) => {
    const success = await onSubmit(data);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-2xl border-none shadow-2xl flex flex-col text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Job Posting" : "Post New Job"}
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex-1 overflow-y-auto p-6 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dynamic Fields */}
            {JOB_FORM_FIELDS.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <Label
                  htmlFor={field.name}
                  className="text-sm font-bold text-gray-600 mb-1.5 block"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <textarea
                    {...register(field.name as keyof JobInput)}
                    id={field.name}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`flex w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors[field.name as keyof JobInput]
                        ? "border-red-500 bg-red-50/50"
                        : ""
                    }`}
                  />
                ) : (
                  <Input
                    {...register(field.name as keyof JobInput, {
                      valueAsNumber: field.type === "number",
                    })}
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all ${
                      errors[field.name as keyof JobInput]
                        ? "border-red-500 bg-red-50/50"
                        : ""
                    }`}
                  />
                )}
                {errors[field.name as keyof JobInput] && (
                  <p className="text-[11px] text-red-500 mt-1.5 ml-1 font-medium">
                    {errors[field.name as keyof JobInput]?.message as string}
                  </p>
                )}
              </div>
            ))}

            {/* Company Selection */}
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="companyId"
                render={({ field }) => (
                  <SelectForm
                    name={field.name}
                    label="Select Company"
                    placeholder="Which company is this job for?"
                    options={companies.map((c) => ({
                      value: c.id?.toString() || "",
                      label: c.name,
                    }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.companyId?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Job Type selection */}
            <div>
              <Controller
                control={control}
                name="jobType"
                render={({ field }) => (
                  <SelectForm
                    name={field.name}
                    label="Job Type"
                    placeholder="e.g. Full-time"
                    options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.jobType?.message}
                    required
                  />
                )}
              />
            </div>

            {/* Experience level selection */}
            <div>
              <Controller
                control={control}
                name="experienceLevel"
                render={({ field }) => (
                  <SelectForm
                    name={field.name}
                    label="Experience Level"
                    placeholder="e.g. Mid-Level"
                    options={EXPERIENCE_LEVELS.map((l) => ({
                      value: l,
                      label: l,
                    }))}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.experienceLevel?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t mt-8 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6 rounded-xl text-gray-500 border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-bold shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Update Job"
              ) : (
                "Post Job"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
