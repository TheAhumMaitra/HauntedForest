import HeroSection from "@/components/Hero";
import CurrentlyWprking from "@/components/CurrentlyWorking";

export default function Home() {
  return (
    <>
      <main className="flex flex-col min-h-screen! justify-center items-center">
        <HeroSection />
        <CurrentlyWprking />
      </main>
    </>
  );
}
