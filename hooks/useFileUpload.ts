"use client";

import { useState } from "react";
import { toast } from "sonner";
import uploadFile from "@/lib/uploadFile";

interface UseFileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

interface UseFileUploadReturn {
  file: File | null;
  url: string;
  isUploading: boolean;
  handleUpload: (file: File) => Promise<void>;
  clearFile: () => void;
}

export function useFileUpload(
  options: UseFileUploadOptions = {},
): UseFileUploadReturn {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options;

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (fileToUpload: File) => {
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileToUpload.type)) {
      toast.error("Invalid file type");
      return;
    }

    if (fileToUpload.size > maxSize) {
      toast.error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadFile(fileToUpload);
      setFile(fileToUpload);
      setUrl(response?.url || "");
      toast.success("Uploaded successfully");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUrl("");
  };

  return { file, url, isUploading, handleUpload, clearFile };
}
