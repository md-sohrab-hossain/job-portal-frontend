"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  User as UserIcon,
  Mail,
  Phone,
  FileText,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas/profile";
import { uploadToCloudinary, UPLOAD_FOLDERS } from "@/lib/upload";
import { ProfilePhotoUpload } from "./profile/ProfilePhotoUpload";
import { ProfileResumeUpload } from "./profile/ProfileResumeUpload";

interface UpdateProfileDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}

const UpdateProfileDialog: React.FC<UpdateProfileDialogProps> = ({
  open,
  setOpen,
  user,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [currentResumeOriginalName, setCurrentResumeOriginalName] = useState<
    string | null
  >(null);
  const [resumeRemoved, setResumeRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullname: user.fullname || "",
      phoneNumber: user.phoneNumber || "",
      profileBio: user.profileBio || "",
      profileSkills: user.profileSkills?.join(", ") || "",
    },
  });

  // Reset all state when dialog opens
  useEffect(() => {
    if (open && user) {
      reset({
        fullname: user.fullname || "",
        phoneNumber: user.phoneNumber || "",
        profileBio: user.profileBio || "",
        profileSkills: user.profileSkills?.join(", ") || "",
      });
      setCurrentPhotoUrl(user.profilePhoto || null);
      setCurrentResumeUrl(user.profileResume || null);
      setCurrentResumeOriginalName(user.profileResumeOriginalName || null);
      setPhotoFile(null);
      setResumeFile(null);
      setResumeRemoved(false);
    }
  }, [open, user, reset]);

  const handlePhotoRemoved = () => {
    setPhotoFile(null);
    setCurrentPhotoUrl(null);
  };

  const handleResumeRemoved = () => {
    setResumeFile(null);
    setCurrentResumeUrl(null);
    setCurrentResumeOriginalName(null);
    setResumeRemoved(true);
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    const userId = user.id || user._id;
    if (!userId) {
      toast.error("User ID not found. Please try logging in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalPhotoUrl = currentPhotoUrl;
      let finalResumeUrl = resumeRemoved ? null : currentResumeUrl;
      let finalResumeOriginalName = resumeRemoved
        ? null
        : currentResumeOriginalName;

      const folder = UPLOAD_FOLDERS.users(userId as string);

      // Upload both files concurrently if selected
      const uploadPromises = [];
      let photoUploadPromise: Promise<{
        secure_url: string;
        url: string;
      }> | null = null;
      let resumeUploadPromise: Promise<{
        secure_url: string;
        url: string;
      }> | null = null;

      if (photoFile) {
        photoUploadPromise = uploadToCloudinary(photoFile, "photo", {
          folder: `${folder}/photos`,
        });
        uploadPromises.push(photoUploadPromise);
      }

      if (resumeFile) {
        resumeUploadPromise = uploadToCloudinary(resumeFile, "resume", {
          folder: `${folder}/resumes`,
        });
        uploadPromises.push(resumeUploadPromise);
      }

      await Promise.all(uploadPromises);

      if (photoUploadPromise) {
        const res = await photoUploadPromise;
        finalPhotoUrl = res.secure_url || res.url;
      }

      if (resumeUploadPromise) {
        const res = await resumeUploadPromise;
        finalResumeUrl = res.secure_url || res.url;
        finalResumeOriginalName = resumeFile?.name || null;
      }

      const payload = {
        fullname: data.fullname,
        phoneNumber: data.phoneNumber || null,
        profileBio: data.profileBio || null,
        profileSkills: data.profileSkills
          ? data.profileSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        profilePhoto: finalPhotoUrl || null,
        profileResume: finalResumeUrl,
        profileResumeOriginalName: finalResumeOriginalName,
      };

      const res = await api.user.update(userId, payload);

      if (res.success) {
        toast.success("Profile updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-linear-to-tr from-amber-500 to-orange-500 p-8 text-white relative shrink-0">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 p-2 cursor-pointer rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all group/close"
            type="button"
          >
            <X className="h-5 w-5 text-white group-hover/close:rotate-90 transition-transform duration-300" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <UserIcon className="h-6 w-6" />
              </div>
              Update Profile
            </DialogTitle>
            <p className="text-white/80 text-sm mt-1">
              Enhance your professional identity
            </p>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-5 bg-white max-h-[calc(100vh-220px)] overflow-y-auto text-gray-900"
        >
          <div className="space-y-6">
            <ProfilePhotoUpload
              currentPhotoUrl={currentPhotoUrl}
              onPhotoSelected={setPhotoFile}
              onPhotoRemoved={handlePhotoRemoved}
              disabled={isSubmitting}
            />

            <ProfileResumeUpload
              currentResumeUrl={currentResumeUrl}
              currentResumeOriginalName={currentResumeOriginalName}
              resumeFile={resumeFile}
              onResumeSelected={(file) => {
                setResumeFile(file);
                setResumeRemoved(false);
              }}
              onResumeRemoved={handleResumeRemoved}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="fullname"
              className="text-xs font-bold text-gray-500 uppercase tracking-widest"
            >
              Full Name
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <UserIcon className="h-4 w-4" />
              </div>
              <Input
                id="fullname"
                {...register("fullname")}
                placeholder="Enter your full name"
                className="pl-10 h-11 border-gray-100 bg-gray-50/50 rounded-xl focus-visible:ring-amber-500 focus-visible:bg-white transition-all text-gray-900"
              />
            </div>
            {errors.fullname && (
              <p className="text-xs text-red-500 font-medium">
                {errors.fullname.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="pl-10 h-11 border-gray-100 bg-gray-100/50 rounded-xl opacity-60 cursor-not-allowed text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                Phone Number
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="+8801XXXXXXXXX"
                  className="pl-10 h-11 border-gray-100 bg-gray-50/50 rounded-xl focus-visible:ring-amber-500 focus-visible:bg-white transition-all text-gray-900"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="profileBio"
              className="text-xs font-bold text-gray-500 uppercase tracking-widest"
            >
              Professional Bio
            </Label>
            <textarea
              id="profileBio"
              {...register("profileBio")}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full text-sm p-3 border border-gray-100 bg-gray-50/50 rounded-xl text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-white transition-all resize-none"
            />
            {errors.profileBio && (
              <p className="text-xs text-red-500 font-medium">
                {errors.profileBio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="profileSkills"
              className="text-xs font-bold text-gray-500 uppercase tracking-widest"
            >
              Skills{" "}
              <span className="normal-case font-normal text-gray-400">
                (comma separated)
              </span>
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <FileText className="h-4 w-4" />
              </div>
              <Input
                id="profileSkills"
                {...register("profileSkills")}
                placeholder="React, Next.js, Node.js..."
                className="pl-10 h-11 border-gray-100 bg-gray-50/50 rounded-xl focus-visible:ring-amber-500 focus-visible:bg-white transition-all text-gray-900"
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl font-bold text-gray-500 border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl font-bold bg-gray-900 border-none text-white hover:bg-black transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
