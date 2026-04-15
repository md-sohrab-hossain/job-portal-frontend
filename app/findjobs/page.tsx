"use client";

import { Suspense } from "react";
import FindJobsContent from "./FindJobsContent";

export default function FindJobs() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primaryColor flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div></div>}>
      <FindJobsContent />
    </Suspense>
  );
}
