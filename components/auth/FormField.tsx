"use client";

import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormFieldProps = {
  label: string;
  id: string;
  error?: string;
  registerProps: UseFormRegisterReturn;
  rightElement?: React.ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "register">;

export const FormField = ({
  label,
  id,
  error,
  registerProps,
  rightElement,
  ...inputProps
}: FormFieldProps) => {
  const { ref, ...restRegisterProps } = registerProps;

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm text-gray-600 font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 pr-10 text-sm outline-none focus:border-yellow-400 focus:ring-0 ${
            error ? "border-red-500" : ""
          }`}
          {...restRegisterProps}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
