export default function HeroSection() {
  return (
    <section className="h-full w-full m-auto p-3">
      <div className="flex flex-col justify-center items-center gap-3.5">
        <h1 className="font-bold underline decoration-purple-700 text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-400 text-4xl text-center">
          Hello World! I am Ahum
        </h1>
        <p className="lg:text-2xl sm:text-xl overflow-clip font-bold w-2xl text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-green-400">
          Welcome to my beautiful website. I created this website using Next JS
          16, ReactBits. It is open source on Github. Feel free to know about me
          and contact me!
        </p>
      </div>
    </section>
  );
}
