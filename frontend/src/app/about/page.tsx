import FuzzyText from "../../components/FuzzyText";
import FAQ from "./faq";

export default function Page() {
  return (
    <div className="min-h-screen m-3">
      {/* <h1 className="font-bold text-5xl lg:text-center text-transparent bg-clip-text bg-linear-to-r from-lime-400 to-cyan-400 mt-6 mb-8">
        About Me
      </h1> */}
      <div className=" sm:min-w-full border-b-4 pb-3 flex flex-col justify-between items-center">
        <div className="mt-7">
          <FuzzyText baseIntensity={0.2}>About Me</FuzzyText>
        </div>
      </div>
      <div className="text-center mt-10 w-85 h-full sm:w-full text-wrap border-background shadow-2xl shadow-primary bg-card p-3 rounded-2xl font-bold border-4">
        <p className="w-full">
          "Hello, World! I am Ahum. I am a Programmer and Computer Science Student. I have a good experience with Python and frontend web developing and software engineering. I usually create TUI'S as my hobby project. I'm doing CS50X. If you are more interested about me view the FAQ'S (down here) or visit my Github.
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center sm:m-8">
      <FAQ />
      </div>
    </div>
  );
}
