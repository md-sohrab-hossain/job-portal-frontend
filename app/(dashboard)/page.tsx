import LatestJobs from "@/components/home/LatestJobs";
import MainSection from "@/components/home/MainSection";
import ShowCategories from "@/components/home/ShowCategories";
import { publicFetch } from "@/lib/server-api";
import { Job } from "@/types/job";

export default async function Home() {
  const { data } = await publicFetch<Job[]>("/job", { revalidate: 60 });
  const rawJobs = data ?? [];
  const jobs = rawJobs.map((j: Job) => ({
    ...j,
    id: j.id || (j as unknown as { _id: string })._id,
    company: j.company
      ? {
          ...j.company,
          id: j.company.id || (j.company as unknown as { _id: string })._id,
        }
      : j.company,
  }));

  return (
    <div>
      <MainSection />
      <ShowCategories />
      <LatestJobs allJobs={jobs} />
    </div>
  );
}
