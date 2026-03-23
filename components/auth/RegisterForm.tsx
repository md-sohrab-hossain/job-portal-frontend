"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/SelectForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/auth/FileUpload";
import { SkillInput } from "@/components/auth/SkillInput";
import AuthFormField from "@/components/auth/AuthFormField";
import {
  REGISTER_FORM_FIELDS,
  ROLE_OPTIONS,
} from "@/config/registerFormConfig";
import { registerSchema, RegisterInput } from "@/lib/schemas/register";
import Link from "next/link";

interface RegisterFormProps {
  onSubmit: (data: RegisterInput) => Promise<void>;
  profilePhoto?: string;
  profileResume?: string;
  onPhotoRemove?: () => void;
  onResumeRemove?: () => void;
  onFileChange?: (file: File, type: "photo" | "resume") => void;
}

const RegisterForm = ({
  onSubmit,
  profilePhoto,
  profileResume,
  onPhotoRemove,
  onResumeRemove,
  onFileChange,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <form
      className="flex flex-col gap-2 w-full border border-gray-200 rounded p-4 bg-gray-100"
      onSubmit={handleSubmit(onSubmit)}
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

      <FileUpload
        label="Upload photo"
        value={profilePhoto}
        accept="image/jpeg,image/png,image/webp"
        onRemove={onPhotoRemove}
        onChange={(file) => file && onFileChange?.(file, "photo")}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src={profilePhoto} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </FileUpload>

      <FileUpload
        label="Upload resume"
        value={profileResume}
        accept="application/pdf"
        onRemove={onResumeRemove}
        onChange={(file) => file && onFileChange?.(file, "resume")}
      >
        <object
          data={profileResume}
          type="application/pdf"
          className="w-full h-full"
        >
          <p className="text-sm text-gray-600">
            Preview not available.{" "}
            <a
              href={profileResume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:underline"
            >
              Open in new tab
            </a>
          </p>
        </object>
      </FileUpload>

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
        disabled={isSubmitting}
        className="w-full my-4 bg-yellow-400/90 hover:bg-yellow-400/95 cursor-pointer"
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-yellow-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
