import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Heart } from "lucide-react";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";
import { ROUTES } from "@/lib/routes";
import { Job } from "@/types/job";
import LatestJobCard from "@/components/LatestJobCard";

export const metadata: Metadata = {
  title: "My Favorites | Job Portal",
  description: "Jobs you've saved to review later",
};

interface FavoriteItem {
  id: string;
  job: Job;
  createdAt: string;
}

async function getFavorites(): Promise<FavoriteItem[]> {
  const res = await authFetch(
    BackendEndpoints.jobs.favorites,
    "GET",
    undefined,
    {
      requireAuth: true,
    },
  );

  if (res.status === 401) {
    redirect(ROUTES.LOGIN);
  }

  const data = await res.json();
  return (data.success ? data.data : []) as FavoriteItem[];
}

export default async function FavoritePage() {
  let favorites: FavoriteItem[] = [];

  try {
    favorites = await getFavorites();
  } catch {
    // Show empty state on error
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mb-20 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-50 rounded-2xl">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Jobs you&apos;ve saved to review later
          </p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Link
              href={ROUTES.JOB_DETAILS(item.job.id)}
              key={item.id}
              className="group transition-all duration-300 hover:-translate-y-1"
            >
              <LatestJobCard job={item.job} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <Briefcase className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No favorite jobs yet
          </h3>
          <p className="text-gray-500 text-center max-w-xs mt-2">
            Click the heart icon on any job listing to save it to your
            favorites.
          </p>
          <Link
            href={ROUTES.FIND_JOBS}
            className="mt-6 text-amber-600 font-bold hover:text-amber-700 transition-colors"
          >
            Browse available jobs →
          </Link>
        </div>
      )}
    </div>
  );
}
