import FuzzyText from "../../components/FuzzyText";
import TrueFocus from "../../components/TrueFocus";
export default function Page() {
  return (
    <div className="min-h-screen m-3">
      {/* <h1 className="font-bold text-5xl lg:text-center text-transparent bg-clip-text bg-linear-to-r from-lime-400 to-cyan-400 mt-6 mb-8">
        About Me
      </h1> */}
      <div className="min-w-full flex flex-col justify-between items-center">
        <div className="mt-7">
          <FuzzyText baseIntensity={0.2}>Hello World!</FuzzyText>
        </div>
        <div className=" text-center scale-70 border-4">
          <TrueFocus
            sentence="Hello, World! I am Ahum. I am a programmer. I want to become an AI and
        ML developer. I love programming. I am currently learning so many
        stuffs. I use my primary language as Python. I love Python. I know
        Python, Javascript, Go, Rust, Typescript, Kotlin. I know web developing
        (frontend) and learning backend. I love Next JS. I am learning video
        editing as a hobby. Thanks for visiting my website."
            manualMode={false}
            blurAmount={2}
            borderColor="purple"
            animationDuration={2}
            pauseBetweenAnimations={2}
          />
        </div>
      </div>
    </div>
  );
}
