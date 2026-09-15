export default function Grain() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="grainFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0 0.06  0 0 0 0.3 0"
          />
        </filter>
      </svg>
      <div className="grain-overlay" style={{ filter: "url(#grainFilter)" }} />
    </>
  );
}
