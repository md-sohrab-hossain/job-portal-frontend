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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 className="font-semibold text-gray-900">
              {isEditing ? "Edit Job Posting" : "Post New Job"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex-1 overflow-y-auto p-6"
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
                    className="text-sm font-medium text-gray-700"
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
                      className={`mt-1.5 flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors[field.name as keyof JobInput]
                          ? "border-red-500"
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
                      className={`mt-1.5 focus-visible:ring-amber-400 ${
                        errors[field.name as keyof JobInput]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                  )}
                  {errors[field.name as keyof JobInput] && (
                    <p className="text-[11px] text-red-500 mt-1">
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
                  defaultValue={initialData.companyId}
                  render={({ field }) => (
                    <SelectForm
                      name={field.name}
                      label="Select Company"
                      placeholder="Which company is this job for?"
                      options={companies.map((c) => ({
                        value: c.id as string,
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
                  defaultValue={initialData.jobType}
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
                  defaultValue={initialData.experienceLevel}
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

            <div className="flex justify-end gap-3 pt-8 border-t mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-400 hover:bg-amber-500 text-black px-8 font-semibold shadow-sm"
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
        </div>
      </div>
    </>
  );
}
