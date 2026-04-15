"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterInput } from "@/lib/schemas/register";
import RegisterForm from "@/components/auth/RegisterForm";
import { api } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { uploadToCloudinary, validateFile } from "@/lib/upload";

function getPendingFolder(email: string, type: "photos" | "resumes"): string {
  const hash = email.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 50);
  return `job-portal/pending/${hash}/${type}`;
}

export default function RegisterPage() {
  const router = useRouter();
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onPhotoChange = (file: File) => {
    const error = validateFile(file, "photo");
    if (error) {
      toast.error(error);
      return;
    }

    const preview = URL.createObjectURL(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(preview);
  };

  const onResumeChange = (file: File) => {
    const error = validateFile(file, "resume");
    if (error) {
      toast.error(error);
      return;
    }

    setResumeFileName(file.name);
  };

  const onPhotoRemove = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const onResumeRemove = () => {
    setResumeFileName(null);
  };

  const onSubmit = async (data: RegisterInput, files: { photo?: File; resume?: File }) => {
    setIsUploading(true);

    try {
      let profilePhoto: string | undefined;
      let profileResume: string | undefined;

      if (files.photo) {
        try {
          const folder = getPendingFolder(data.email, "photos");
          const res = await uploadToCloudinary(files.photo, "photo", { folder });
          profilePhoto = res.secure_url || res.url;
        } catch {
          toast.error("Photo upload failed");
          setIsUploading(false);
          return;
        }
      }

      if (files.resume) {
        try {
          const folder = getPendingFolder(data.email, "resumes");
          const res = await uploadToCloudinary(files.resume, "resume", { folder });
          profileResume = res.secure_url || res.url;
        } catch {
          toast.error("Resume upload failed");
          setIsUploading(false);
          return;
        }
      }

      const response = await api.auth.register({
        ...data,
        profilePhoto,
        profileResume,
      });

      if (!response.success) {
        toast.error(response.message || "Registration failed");
        setIsUploading(false);
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push(ROUTES.LOGIN);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-start justify-center w-xl m-auto z-10">
      <RegisterForm
        onSubmit={onSubmit}
        profilePhoto={photoPreview}
        profileResume={resumeFileName}
        onPhotoRemove={onPhotoRemove}
        onResumeRemove={onResumeRemove}
        onPhotoChange={onPhotoChange}
        onResumeChange={onResumeChange}
        isUploading={isUploading}
      />
    </div>
  );
}
