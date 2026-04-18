"use client";

import { useEffect } from "react";
import { warmupBackend } from "@/lib/api";

export function BackendWarmup() {
  useEffect(() => {
    warmupBackend();
  }, []);

  return null;
}