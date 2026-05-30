import FuzzyText from "../../components/FuzzyText";
import FAQ from "./faq";

export default function Page() {
  return (
    <div className="min-h-screen m-3">
      <div className=" sm:min-w-full border-b-4 pb-3 flex flex-col justify-between items-center">
        <div className="mt-7">
          <FuzzyText baseIntensity={0.2}>About Me</FuzzyText>
        </div>
      </div>
      <div className="text-center mt-10 w-85 h-full sm:w-full text-wrap border-background shadow-2xl shadow-primary bg-card p-3 rounded-2xl font-bold border-4">
        <p className="w-full">
          Hello, World! This is Ahum :) I want to be an AI Engineer. I'm currently learning Rust, CS concepts. I'm working on some projects!
        </p>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center sm:m-8">
      <FAQ />
      </div>
    </div>
  );
}
