import React, { useRef } from "react";
import { FileText, RefreshCw, Trash2, ExternalLink, UploadCloud } from "lucide-react";
import { validateFile, getCloudinaryPdfViewUrl } from "@/lib/upload";
import { toast } from "sonner";

interface ProfileResumeUploadProps {
  currentResumeUrl: string | null;
  currentResumeOriginalName: string | null;
  resumeFile: File | null;
  onResumeSelected: (file: File) => void;
  onResumeRemoved: () => void;
  disabled?: boolean;
}

export function ProfileResumeUpload({
  currentResumeUrl,
  currentResumeOriginalName,
  resumeFile,
  onResumeSelected,
  onResumeRemoved,
  disabled
}: ProfileResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, "resume");
    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    onResumeSelected(file);
  };

  const removeResume = () => {
    onResumeRemoved();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // State calculations
  const hasExistingResume = !!currentResumeUrl && !resumeFile;
  const hasNewResume = !!resumeFile;
  const showResumeRow = hasExistingResume || hasNewResume;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        Resume / CV
      </label>

      {showResumeRow ? (
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl group transition-all">
          {/* PDF icon */}
          <div className="p-2.5 bg-red-50 rounded-xl shrink-0">
            <FileText className="h-5 w-5 text-red-500" />
          </div>

          {/* Filename */}
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-700 truncate font-medium block">
              {hasNewResume
                ? resumeFile!.name
                : currentResumeOriginalName || "Resume uploaded"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* View existing resume */}
            {hasExistingResume && !hasNewResume && (
              <a
                href={getCloudinaryPdfViewUrl(currentResumeUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                title="View resume"
                className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                onClick={(e) => {
                  if (disabled) e.preventDefault();
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {/* Change/replace resume */}
            <label
              title="Change resume"
              className={`p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleSelect}
                disabled={disabled}
              />
            </label>

            {/* Remove resume */}
            <button
              type="button"
              onClick={removeResume}
              disabled={disabled}
              title="Remove resume"
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State: Upload Button */
        <label
          className={`
            flex flex-col items-center justify-center p-8 border-2 border-dashed
            border-gray-200 rounded-2xl bg-gray-50 hover:bg-amber-50 hover:border-amber-200
            transition-all group ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-gray-700">Click to upload your resume</p>
          <p className="text-xs text-gray-400 mt-1">PDF only · max 700KB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleSelect}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}
