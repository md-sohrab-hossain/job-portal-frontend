"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SelectForm from "@/components/SelectForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillInput } from "@/components/auth/SkillInput";
import AuthFormField from "@/components/auth/AuthFormField";
import {
  REGISTER_FORM_FIELDS,
  ROLE_OPTIONS,
} from "@/config/registerFormConfig";
import { registerSchema, RegisterInput } from "@/lib/schemas/register";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface RegisterFormProps {
  onSubmit: (data: RegisterInput, files: { photo?: File; resume?: File }) => Promise<void>;
  profilePhoto?: string | null;
  profileResume?: string | null;
  onPhotoRemove?: () => void;
  onResumeRemove?: () => void;
  onPhotoChange?: (file: File) => void;
  onResumeChange?: (file: File) => void;
  isUploading?: boolean;
}

const RegisterForm = ({
  onSubmit,
  profilePhoto,
  profileResume,
  onPhotoRemove,
  onResumeRemove,
  onPhotoChange,
  onResumeChange,
  isUploading = false,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      password: "",
      profileSkills: [],
      role: undefined,
    },
  });

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const isSubmittingOrUploading = isSubmitting || isUploading;

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data, {
      photo: photoFile || undefined,
      resume: resumeFile || undefined,
    });
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      onPhotoChange?.(file);
    }
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      onResumeChange?.(file);
    }
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    onPhotoRemove?.();
  };

  const handleResumeRemove = () => {
    setResumeFile(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
    onResumeRemove?.();
  };

  return (
    <form
      className="flex flex-col gap-2 w-full border border-gray-200 rounded p-4 bg-gray-100"
      onSubmit={handleFormSubmit}
    >
      {REGISTER_FORM_FIELDS.map((field) => (
        <AuthFormField
          key={field.name}
          field={field}
          errors={errors}
          register={register}
          showPassword={showPassword}
          onTogglePassword={handlePasswordToggle}
        />
      ))}

      <SkillInput
        value={watch("profileSkills") ?? []}
        onChange={(skills) => setValue("profileSkills", skills)}
        error={errors.profileSkills?.message as string | undefined}
      />

      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">Upload photo</label>
        {profilePhoto ? (
          <div className="relative mt-1 w-20 h-20">
            <Avatar className="w-full h-full">
              <AvatarImage src={profilePhoto} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handlePhotoRemove}
              className="absolute -top-1 -right-1 z-10 cursor-pointer bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <label className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm cursor-pointer hover:border-yellow-400 transition-colors">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <span className="m-auto file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-medium">
              Choose Photo
            </span>
          </label>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">Upload resume (PDF)</label>
        {profileResume ? (
          <div className="relative flex items-center gap-2 p-2 border border-gray-200 rounded bg-white">
            <span className="text-sm text-gray-700 truncate flex-1">{profileResume}</span>
            <button
              type="button"
              onClick={handleResumeRemove}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm cursor-pointer hover:border-yellow-400 transition-colors">
            <input
              ref={resumeInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleResumeSelect}
              className="hidden"
            />
            <span className="m-auto file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-medium">
              Choose Resume
            </span>
          </label>
        )}
      </div>

      <SelectForm
        name="role"
        label="Role"
        placeholder="Select a user role"
        options={ROLE_OPTIONS}
        error={errors.role?.message}
        required
        value={watch("role") ?? ""}
        onValueChange={(value) => {
          setValue("role", value as "student" | "recruiter");
          trigger("role");
        }}
      />

      <Button
        type="submit"
        disabled={isSubmittingOrUploading}
        className="w-full my-4 bg-yellow-400/90 hover:bg-yellow-400/95 cursor-pointer"
      >
        {isSubmittingOrUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-yellow-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
