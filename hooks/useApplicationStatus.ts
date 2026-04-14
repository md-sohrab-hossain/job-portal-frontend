import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface UseApplicationStatusOptions {
  onSuccess?: (status: string) => void;
}

export function useApplicationStatus({
  onSuccess,
}: UseApplicationStatusOptions = {}) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (applicationId: string, status: string) => {
    setUpdating(true);
    const loadingToast = toast.loading(`Updating status to ${status}...`);

    try {
      const result = await api.applications.updateStatus(applicationId, status);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Applicant ${status.toLowerCase()} successfully`);
        onSuccess?.(status.toLowerCase());
        return true;
      } else {
        toast.error(result.error || "Failed to update status");
        return false;
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Failed to update status");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateStatus, updating };
}
