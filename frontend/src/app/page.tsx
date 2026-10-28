import HeroSection from "@/components/Hero";
import Arch from "@/components/Arch";
import Fact from "@/components/Fact";
import Quotes from "@/components/Quotes";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <HeroSection />
        <Arch />
        <Fact />
        <Quotes />
        <Projects />
      </main>
    </>
  );
}
