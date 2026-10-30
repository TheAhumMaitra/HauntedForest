import FuzzyText from "../../components/FuzzyText";
import FAQ from "./faq";
import Topography from "@/components/Topography";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
      <div className="absolute inset-0">
        <Topography
          color="#7c3aed"
          lineCount={16}
          lineWidth={1.2}
          elevation={1}
          foreground={0.2}
          tilt={90}
          speed={0.12}
          direction="right"
          glow={0.3}
          depthOfField={0}
          fog={0.35}
          hoverEffect="trace"
          clickEffect="pulse"
          majorLines
          scale={0.7}
          detail={0.35}
          morph={0.2}
          brightness={1}
          markers="plus"
          glitch={0}
          opacity={1}
          mouseInteraction
          mouseRadius={1}
          mouseStrength={0.6}
          trail={0.3}
          parallax={0.5}
          intro
          lightMode={false}
        />
      </div>
      <div className="absolute inset-0 m-3">
        <div className=" sm:min-w-full border-b-4 pb-3 flex flex-col justify-between items-center">
          <div className="mt-7">
            <FuzzyText baseIntensity={0.2}>About Me</FuzzyText>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-3xl text-center text-foreground text-wrap border-background shadow-2xl shadow-primary bg-card p-3 rounded-2xl font-bold border-4">
          <p className="w-full">
            Hello, World! This is Ahum :) I want to be an AI Engineer. I'm
            currently learning Rust, CS concepts and much more!. I'm working on
            some projects!
          </p>
        </div>
        <div className="mt-12 flex w-full flex-col items-center justify-start">
          <FAQ />
        </div>
      </div>
    </div>
  );
}
