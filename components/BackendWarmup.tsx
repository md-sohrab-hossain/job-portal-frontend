"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { pingBackend, openBackendTab } from "@/lib/backend-warmup";


const POLL_INTERVAL_MS = 8_000; // check every 8 seconds
const MAX_POLLS = 15; // give up after ~2 min

export function BackendWarmup() {
  useEffect(() => {
    let toastId: string | number | undefined;
    let pollCount = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    async function check() {
      const isAlive = await pingBackend();

      if (!isAlive && pollCount === 0) {
        // First failure → show toast + open background tab to wake Render
        openBackendTab();

        toastId = toast.loading("⏳ Backend server is waking up…", {
          description:
            "Render free tier spins down after inactivity. This usually takes 30–60 seconds.",
          duration: Infinity, // keep until we dismiss it
        });
      }

      if (isAlive) {
        // Backend is up
        if (toastId !== undefined) {
          // It was sleeping, now it's ready
          toast.dismiss(toastId);
          toast.success("✅ Backend server is ready!", {
            description: "You can now use all features normally.",
            duration: 4000,
          });
        }
        if (intervalId) clearInterval(intervalId);
        return;
      }

      pollCount++;
      if (pollCount >= MAX_POLLS) {
        // Give up
        if (intervalId) clearInterval(intervalId);
        if (toastId !== undefined) {
          toast.dismiss(toastId);
          toast.error("❌ Backend server is not responding", {
            description:
              "Please try refreshing the page in a minute, or check the server status.",
            duration: 8000,
          });
        }
      }
    }

    // Run immediately, then poll
    check();
    intervalId = setInterval(check, POLL_INTERVAL_MS);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return null;
}
