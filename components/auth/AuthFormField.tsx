"use client";

import {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { FormField } from "@/components/auth/FormField";
import PasswordToggle from "@/components/auth/PasswordToggle";

interface AuthFormFieldProps<T extends FieldValues> {
  field: { name: string; label: string; type: string; placeholder: string };
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const AuthFormField = <T extends FieldValues>({
  field,
  errors,
  register,
  showPassword,
  onTogglePassword,
}: AuthFormFieldProps<T>) => {
  const isPassword = field.name === "password";
  const errorKey = field.name as Path<T>;
  const error = errors[errorKey]?.message as string | undefined;

  return (
    <FormField
      key={field.name}
      id={field.name}
      label={field.label}
      type={isPassword && showPassword ? "text" : field.type}
      placeholder={field.placeholder}
      registerProps={register(field.name as Path<T>)}
      error={error}
      rightElement={
        isPassword && onTogglePassword ? (
          <PasswordToggle show={!!showPassword} toggle={onTogglePassword} />
        ) : undefined
      }
    />
  );
};

export default AuthFormField;
