"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/SelectForm";
import AuthFormField from "@/components/auth/AuthFormField";
import {
  LOGIN_FORM_FIELDS,
  LOGIN_ROLE_OPTIONS,
} from "@/config/loginFormConfig";
import { loginSchema, LoginInput } from "@/lib/schemas/login";
import Link from "next/link";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => Promise<void>;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  return (
    <form
      className="flex flex-col gap-2 w-full border border-gray-200 rounded p-4 bg-gray-100"
      onSubmit={handleSubmit(onSubmit)}
    >
      {LOGIN_FORM_FIELDS.map((field) => (
        <AuthFormField
          key={field.name}
          field={field}
          errors={errors}
          register={register}
          showPassword={showPassword}
          onTogglePassword={handlePasswordToggle}
        />
      ))}

      <SelectForm
        name="role"
        label="Role"
        placeholder="Select a user role"
        options={LOGIN_ROLE_OPTIONS}
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
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-yellow-500 hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
