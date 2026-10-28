import Lightfall from './Lightfall';

export default function Quotes() {
  return (
    <div className="relative h-150 w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
      <div className="absolute inset-0">
         <Lightfall
    colors={["#ffffff"]}
    backgroundColor="#94a3b8"
    speed={0.3}
    streakCount={2}
    streakWidth={0.8}
    twinkle={0.3}
    backgroundGlow={0.1}
    headGlow={0.6}
    bloom={0.35}
    mouseInteraction
    holdToWarp
    intro
    streakLength={1}
    density={0.6}
    glow={1}
    depth={0.5}
    zoom={3}
    mouseStrength={0.4}
    mouseRadius={0.45}
    lens={0.5}
    fade={0}
    lightMode={false}
/>
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
         <section className="flex flex-col items-center justify-between">
               <h1 className="text-2xl font-bold text-yellow-400">Most men seem to live according to sense rather than reason.</h1>
               <hr className='w-full border border-2'></hr>
          <h1 className="text-2xl font-bold text-yellow-400">Here must be must be a first mover existing above all – and this we call God.</h1>
    
          <h3>~ Saint Thomoas Aqanias</h3>
          
        </section>
      </div>
    </div>
  );
}