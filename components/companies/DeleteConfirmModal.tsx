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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl shadow-2xl p-6 text-center border-none">
        <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
          <Trash2 className="h-6 w-6 text-red-500" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-gray-200 text-gray-500 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-sm font-semibold"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
