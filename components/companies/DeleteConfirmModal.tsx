"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  title?: string;
  description?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Delete company?",
  description = "Are you sure you want to delete this company? This action cannot be undone.",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 pointer-events-auto text-center">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 border-gray-200"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-sm"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
