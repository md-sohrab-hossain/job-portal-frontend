"use client";

import { useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary, validateFile, type FileType } from "@/lib/upload";

interface UseFileUploadOptions {
  fileType?: FileType;
  folder?: string;
}

interface UseFileUploadReturn {
  file: File | null;
  url: string;
  isUploading: boolean;
  error: string | null;
  upload: (file: File, folder?: string) => Promise<string | null>;
  clear: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { fileType = "photo", folder: defaultFolder } = options;

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (fileToUpload: File, folder?: string): Promise<string | null> => {
    const validationError = validateFile(fileToUpload, fileType);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadFolder = folder || defaultFolder;
      const response = await uploadToCloudinary(fileToUpload, fileType, {
        folder: uploadFolder,
      });
      const uploadedUrl = response.secure_url || response.url;
      
      setFile(fileToUpload);
      setUrl(uploadedUrl);
      toast.success("Uploaded successfully");
      
      return uploadedUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setUrl("");
    setError(null);
  };

  return { file, url, isUploading, error, upload, clear };
}
