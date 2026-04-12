import LatestJobs from "@/components/home/LatestJobs";
import MainSection from "@/components/home/MainSection";
import ShowCategories from "@/components/home/ShowCategories";
import { publicFetch } from "@/lib/server-api";
import { type Job } from "@/types/job";

export default async function Home() {
  const { data } = await publicFetch<Job[]>("/job", { revalidate: 60 });
  const jobs = data ?? [];

  return (
    <div>
      <MainSection />
      <ShowCategories />
      <LatestJobs allJobs={jobs} />
    </div>
  );
}
