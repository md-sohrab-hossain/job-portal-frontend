import LatestJobs from "@/components/home/LatestJobs";
import MainSection from "@/components/home/MainSection";
import ShowCategories from "@/components/home/ShowCategories";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job?keyword=`, {
    cache: "no-cache",
  });
  const { jobs } = await res.json();

  return (
    <div>
      <MainSection />
      <ShowCategories />
      <LatestJobs allJobs={jobs} />
    </div>
  );
}
