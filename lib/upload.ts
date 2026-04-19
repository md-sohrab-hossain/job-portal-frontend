export interface UploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type?: string;
  width?: number;
  height?: number;
  bytes: number;
  folder?: string;
}

export interface UploadConfig {
  allowedTypes: readonly string[];
  maxSize: number;
  folderPrefix: string;
}

export interface FolderConfig {
  users: (userId: string) => string;
  companies: (companyId: string) => string;
}

export const UPLOAD_FOLDERS: FolderConfig = {
  users: (userId: string) => `job-portal/users/${userId}`,
  companies: (companyId: string) => `job-portal/companies/${companyId}`,
};

export const FILE_UPLOAD_CONFIG = {
  photo: {
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxSize: 700 * 1024, // 700KB
    folderPrefix: "photos",
  },
  resume: {
    allowedTypes: ["application/pdf"],
    maxSize: 700 * 1024, // 700KB
    folderPrefix: "resumes",
  },
  companyLogo: {
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSize: 700 * 1024, // 700KB
    folderPrefix: "logos",
  },
} as const;

export type FileType = keyof typeof FILE_UPLOAD_CONFIG;

export interface UploadOptions {
  folder?: string;
}

export function validateFile(file: File, type: FileType): string | null {
  const config = FILE_UPLOAD_CONFIG[type];
  const allowedTypes: string[] = [...config.allowedTypes];

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${config.allowedTypes.join(", ")}`;
  }

  if (file.size > config.maxSize) {
    const maxKB = Math.round(config.maxSize / 1024);
    return `File too large. Maximum size: ${maxKB}KB`;
  }

  return null;
}

/**
 * Cloudinary resource type per file category.
 *
 * Using "auto" for resumes lets Cloudinary detect the type automatically.
 * This is the most permissive setting and works regardless of how the
 * upload preset is configured (image-only presets reject "raw" explicitly).
 *
 * Image-type PDFs are handled on the display side via getCloudinaryPdfUrl()
 * which injects the fl_inline transformation to serve them correctly.
 */
const CLOUDINARY_RESOURCE_TYPE: Record<FileType, "image" | "raw" | "auto"> = {
  photo: "image",
  resume: "auto", // auto = let Cloudinary pick; works with all preset configs
  companyLogo: "image",
};

export async function uploadToCloudinary(
  file: File,
  type: FileType,
  options?: UploadOptions,
): Promise<UploadResponse> {
  const error = validateFile(file, type);
  if (error) {
    throw new Error(error);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "job-portal";

  if (!cloudName) {
    throw new Error(
      "Cloudinary configuration missing: NEXT_PUBLIC_CLOUDINARY_NAME is not defined.",
    );
  }

  const resourceType = CLOUDINARY_RESOURCE_TYPE[type];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Upload failed: ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
      }
    } catch {
      // not JSON, use status text
    }

    if (response.status === 401) {
      throw new Error(
        "Upload failed (401): make sure your Cloudinary upload preset is set to 'Unsigned' mode in the Cloudinary dashboard.",
      );
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Upload failed");
  }

  return data;
}

/**
 * Returns a browser-viewable URL for a Cloudinary-hosted PDF.
 *
 * NOTE: If Cloudinary returns 401 Unauthorized for PDFs, it is because of
 * "Strict delivery" settings in the Cloudinary Dashboard Security tab.
 * Since PDF delivery is now enabled in settings, the native Cloudinary URL
 * will correctly serve the PDF inline in the browser.
 */
export function getCloudinaryPdfViewUrl(
  url: string | null | undefined,
): string | null {
  return url || null;
}

/**
 * Returns the direct Cloudinary URL for downloading a PDF.
 * Used in <a download> links — the browser will prompt a save dialog.
 */
export function getCloudinaryPdfUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  return url;
}
