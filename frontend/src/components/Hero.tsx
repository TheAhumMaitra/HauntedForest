export default function HeroSection() {
  return (
    <section className="h-full w-full m-auto p-3">
      <div className="flex flex-col justify-center items-center gap-3.5">
        <h1 className="font-bold underline decoration-purple-700 text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-400 text-4xl text-center">
          Hello World! I am Ahum
        </h1>
        <p className="text-xl sm:text-2xl font-bold sm:w-4xl text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-green-400 text-wrap">
          Welcome to my beautiful website. I am a programmer, who loves programming! I love Python, C, Rust, JS, TS, frontend and backend works!
        </p>
      </div>
    </section>
  );
}
