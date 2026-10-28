import Dither from './Dither';

export default function Fact() {
  return (
    <div className="relative h-150 w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
      <div className="absolute inset-0">
        <Dither
          waveColor="green"
          backgroundColor="#090b0c"
          ditherMode="bayer"
          colorNum={4}
          pixelSize={2}
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          mouseEffect="erase"
          mouseRadius={0.3}
          palette={[]}
          scale={1}
          contrast={1}
          brightness={0}
          mouseStrength={1}
          trail={0.5}
          enableMouseInteraction
          clickRipple
          intro
          disableAnimation={false}
        />
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <h1 className="max-w-4xl text-center text-base font-bold leading-8 text-white/90 sm:text-lg lg:text-xl">
          Had a interest about these techy things from 6. Learned video editing at 7
          (mobile video editing - Kinemaster). Started to learn HTML from 10 (at
          home, youtube noob actually) then started to learn frontend web
          development at 12 and also began to learn python from 12 to 13. Started
          CS50 from 2024 lol
        </h1>
      </div>
    </div>
  );
}