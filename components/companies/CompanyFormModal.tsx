"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { type CompanyFormData } from "@/types/company";
import { companySchema, type CompanyInput } from "@/lib/schemas/company";
import { COMPANY_FORM_FIELDS } from "@/config/companyFormConfig";
import uploadFile from "@/lib/uploadFile";
import { toast } from "sonner";

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CompanyFormData;
  isEditing: boolean;
  onSubmit: (data: CompanyInput) => Promise<boolean>;
}

export function CompanyFormModal({
  isOpen,
  onClose,
  initialData,
  isEditing,
  onSubmit,
}: CompanyFormModalProps) {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData,
  });

  const logoUrl = watch("logo");

  // Reset form when initialData or isOpen changes
  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [initialData, isOpen, reset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res?.url) {
        setValue("logo", res.url, { shouldValidate: true });
        toast.success("Logo uploaded");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFormSubmit = async (data: CompanyInput) => {
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
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">
              {isEditing ? "Edit Company" : "Add Company"}
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

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
            {/* Logo Upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer group flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
                <Avatar className="h-20 w-20 border-2 border-dashed border-gray-300 group-hover:border-amber-400 transition-colors">
                  <AvatarImage
                    src={logoUrl}
                    alt="Preview"
                    className="bg-white object-cover"
                  />
                  <AvatarFallback className="bg-gray-50 text-gray-400">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-500 mt-2 font-medium group-hover:text-amber-600 transition-colors">
                  {uploading ? "Uploading..." : "Upload Logo"}
                </span>
                {errors.logo && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.logo.message}</p>
                )}
              </label>
            </div>

            {/* Dynamic Fields from Config */}
            {COMPANY_FORM_FIELDS.map((field) => (
              <div key={field.name}>
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  {...register(field.name)}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`mt-1.5 focus-visible:ring-amber-400 ${errors[field.name] ? "border-red-500" : ""
                    }`}
                />
                {errors[field.name] && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
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
                disabled={isSubmitting || uploading}
                className="bg-amber-400 hover:bg-amber-500 text-black px-6 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Company"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
