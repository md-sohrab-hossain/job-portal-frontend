"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/register";
import { RegisterInput } from "@/lib/schemas/register";
import RegisterForm from "@/components/auth/RegisterForm";
import { handleFileUpload } from "@/lib/helpers/register";

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

    const response = await register(payload);

    if (response?.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Registration successful! Please login.");
    router.push("/login");
  };

  return (
    <div className="flex items-start justify-center w-xl m-auto">
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
