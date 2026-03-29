"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterInput } from "@/lib/schemas/register";
import RegisterForm from "@/components/auth/RegisterForm";
import { handleFileUpload } from "@/lib/helpers/register";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [profileResume, setProfileResume] = useState<string>("");

  const onFileChange = (file: File, type: "photo" | "resume") => {
    handleFileUpload(file, type, (url) => {
      if (type === "photo") setProfilePhoto(url);
      else setProfileResume(url);
    });
  };

  const onSubmit = async (data: RegisterInput) => {
    const payload = {
      ...data,
      profilePhoto: profilePhoto || undefined,
      profileResume: profileResume || undefined,
    };

    try {
      const response = await api.auth.register(payload);

      if (!response.success) {
        toast.error(response.message || "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-start justify-center w-xl m-auto z-10">
      <RegisterForm
        onSubmit={onSubmit}
        profilePhoto={profilePhoto}
        profileResume={profileResume}
        onPhotoRemove={() => setProfilePhoto("")}
        onResumeRemove={() => setProfileResume("")}
        onFileChange={onFileChange}
      />
    </div>
  );
}
