import ParticleText from './ParticleText';

export default function Arch() {
    return(
        <>
          <div>
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
    fontSize="clamp(3.5rem, 13vw, 9rem)"
    fontWeight={800}
    fontFamily="inherit"
    glow
  />
           </div>
        </>
    )
}