import ParticleText from './ParticleText';

export default function Arch() {
    return(
        <>
          <div className="w-full max-w-full overflow-hidden">
              <ParticleText
    text="I USE ARCH BTW ;)"
    particleSize={2.2}
    density={4}
    color="currentColor"
    highlightColor="blue"
    highlightMode="motion"
    shape="circle"
    intro="gather"
    scatter={190}
    gatherDuration={1600}
    stagger={420}
    clickBurst
    burstStrength={1}
    pointerRepel={42}
    repelRadius={120}
    idleDrift={0.8}
    trigger="mount"
    fontSize="clamp(1.75rem, 10vw, 7rem)"
    fontWeight={800}
    fontFamily="inherit"
    glow
    style = {{}}
  />
           </div>
        </>
    )
}