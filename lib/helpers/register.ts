import { toast } from "sonner";
import uploadFile from "@/lib/uploadFile";

const FILE_CONFIG = {
  photo: {
    allowedTypes: ["image/jpeg", "image/png", "image/webp"] as string[],
    maxSize: 5 * 1024 * 1024,
  },
  resume: {
    allowedTypes: ["application/pdf"] as string[],
    maxSize: 10 * 1024 * 1024,
  },
} as const;

export async function handleFileUpload(
  file: File,
  type: "photo" | "resume",
  onSuccess: (url: string) => void
) {
  const config = FILE_CONFIG[type];

  if (!config.allowedTypes.includes(file.type)) {
    toast.error(type === "photo" ? "Please upload a valid image" : "Please upload a PDF");
    return;
  }

  if (file.size > config.maxSize) {
    toast.error(`File too large. Max ${type === "photo" ? "5MB" : "10MB"}`);
    return;
  }

  try {
    const upload = await uploadFile(file);
    if (upload?.url) {
      onSuccess(upload.url);
      toast.success(`${type === "photo" ? "Photo" : "Resume"} uploaded successfully`);
    }
  } catch {
    toast.error("Upload failed");
  }
}
