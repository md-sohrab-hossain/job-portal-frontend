import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Trash2 } from "lucide-react";
import { validateFile } from "@/lib/upload";
import { toast } from "sonner";

interface ProfilePhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoSelected: (file: File) => void;
  onPhotoRemoved: () => void;
  disabled?: boolean;
}

export function ProfilePhotoUpload({
  currentPhotoUrl,
  onPhotoSelected,
  onPhotoRemoved,
  disabled
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // We only track the preview URL here, and pass the File itself up to the parent.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, "photo");
    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
    onPhotoSelected(file);
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    onPhotoRemoved();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayPhotoUrl = photoPreview || currentPhotoUrl;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-800">
        Profile Photo
      </label>
      <div className="flex items-center gap-6">
        {/* Photo Bubble */}
        <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 shrink-0">
          {displayPhotoUrl ? (
            <Image
              src={displayPhotoUrl}
              alt="Profile"
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              <Camera className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <label
              className={`
                flex items-center gap-2 px-4 py-2 cursor-pointer
                bg-white border hover:bg-gray-50 focus:ring-4 focus:ring-amber-50
                border-gray-200 text-sm font-medium text-gray-700 rounded-xl transition-all
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={handleSelect}
                disabled={disabled}
              />
            </label>
            {displayPhotoUrl && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG or WebP · max 700KB
          </p>
        </div>
      </div>
    </div>
  );
}
