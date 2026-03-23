"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

type SelectOption = {
  value: string;
  label: string;
};

interface SelectFormProps {
  name: string;
  label?: string;
  placeholder: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectForm = ({
  name,
  label,
  placeholder,
  options,
  error,
  required,
  value,
  onValueChange,
}: SelectFormProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={name} className="text-sm text-gray-600 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select name={name} value={value || ""} onValueChange={onValueChange}>
        <SelectTrigger
          id={name}
          className={`w-full h-9 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-yellow-400 focus:ring-0 ${
            error ? "border-red-500" : ""
          }`}
        >
          <SelectValue placeholder={placeholder} className="text-gray-700" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-md border border-gray-200">
          <SelectGroup>
            {label && (
              <SelectLabel className="text-gray-600">{label}</SelectLabel>
            )}
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-gray-700 focus:bg-yellow-50 focus:text-gray-900"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectForm;
