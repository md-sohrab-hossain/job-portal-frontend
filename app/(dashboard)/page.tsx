import LatestJobs from "@/components/home/LatestJobs";
import MainSection from "@/components/home/MainSection";
import ShowCategories from "@/components/home/ShowCategories";
import { api } from "@/lib/api";
import { Job } from "@/types/job";

export default async function Home() {
  const response = await api.jobs.getAll({ keyword: "" });
  const jobs = (response.data || []) as Job[];

  return (
    <div>
      <MainSection />
      <ShowCategories />
      <LatestJobs allJobs={jobs} />
    </div>
  );
}
