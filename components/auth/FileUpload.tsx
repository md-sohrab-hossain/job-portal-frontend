"use client";

import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export const FileUpload = ({
  label,
  value,
  accept,
  onRemove,
  onChange,
  children,
}: {
  label: string;
  value?: string;
  accept: string;
  onRemove?: () => void;
  onChange?: (file: File) => void;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-sm text-gray-600 font-medium">{label}</Label>
    {value ? (
      <div className="relative mt-1">
        <div className="h-20 w-20">{children}</div>
        {onRemove && (
          <X
            size={14}
            className="absolute -top-1 -right-1 z-10 cursor-pointer bg-red-500 text-white rounded-full p-0.5"
            onClick={onRemove}
          />
        )}
      </div>
    ) : (
      <label className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm cursor-pointer hover:border-yellow-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange?.(file);
          }}
          className="hidden"
        />
        <span className="m-auto file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:text-sm file:font-medium">
          Choose File
        </span>
      </label>
    )}
  </div>
);
