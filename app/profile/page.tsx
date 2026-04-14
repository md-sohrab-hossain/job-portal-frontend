import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";
import UserDetails from "@/components/UserDetails";
import AppliedJobs from "@/components/AppliedJobs";
import { Application } from "@/types/job";
import { User } from "@/types/user";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "My Profile | Job Portal",
  description: "View and manage your profile and job applications",
};

async function getUser(): Promise<User> {
  const res = await authFetch(BackendEndpoints.user.me, "GET", undefined, {
    requireAuth: true,
  });

  if (res.status === 401) {
    redirect(ROUTES.LOGIN);
  }

  const data = await res.json();

  if (!data.success || !data.data) {
    redirect(ROUTES.LOGIN);
  }

  return data.data as User;
}

async function getApplications(): Promise<Application[]> {
  const res = await authFetch(
    BackendEndpoints.applications.base,
    "GET",
    undefined,
    {
      requireAuth: true,
    },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.success ? data.data : []) as Application[];
}

export default async function ProfilePage() {
  const [user, applications] = await Promise.all([
    getUser(),
    getApplications(),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="h-48 w-full" />

      <div className="max-w-5xl mx-auto px-4 -mt-24">
        <div className="space-y-8">
          <UserDetails user={user} />

          {user.role === "student" && (
            <section>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-4 px-2">
                Applied Jobs
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  {applications.length}
                </span>
              </h2>
              <AppliedJobs applications={applications} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
