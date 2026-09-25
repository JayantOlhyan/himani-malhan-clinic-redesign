/**
 * Abstract ultrasound-sector artwork for the fetal-medicine feature: depth arcs, beam lines,
 * speckle and a slow sweeping scan line. Purely decorative (aria-hidden) and pure CSS/SVG —
 * no JavaScript, no image request. The sweep is disabled for prefers-reduced-motion.
 */
export function SonarVisual({ className = "" }: { className?: string }) {
  // Sector geometry: apex at (400, 60), radius 640, spanning ±38° from vertical.
  const apex = { x: 400, y: 60 };
  const R = 640;
  const span = 38;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number, r: number) => ({ x: apex.x + r * Math.sin(rad(deg)), y: apex.y + r * Math.cos(rad(deg)) });
  const arc = (r: number) => {
    const a = pt(-span, r);
    const b = pt(span, r);
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${r} ${r} 0 0 0 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };
  const inner = 40;
  const sector = `M${pt(-span, inner).x} ${pt(-span, inner).y} L${pt(-span, R).x} ${pt(-span, R).y} A${R} ${R} 0 0 0 ${pt(span, R).x} ${pt(span, R).y} L${pt(span, inner).x} ${pt(span, inner).y} A${inner} ${inner} 0 0 1 ${pt(-span, inner).x} ${pt(-span, inner).y}Z`;
  const depths = [120, 220, 320, 420, 520, 620];
  const beams = [-28, -19, -9.5, 0, 9.5, 19, 28];

  return (
    <div className={`sonar overflow-hidden bg-plum-deep ${/(^|\s)absolute(\s|$)/.test(className) ? "" : "relative"} ${className}`} aria-hidden="true">
      <svg viewBox="-24 24 872 720" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id="sonar-sector">
            <path d={sector} />
          </clipPath>
          <radialGradient id="sonar-glow" cx="400" cy="60" r="640" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ecdcdc" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#c98f9f" stopOpacity="0.1" />
            <stop offset="1" stopColor="#4a2637" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sonar-beam" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ecdcdc" stopOpacity="0" />
            <stop offset="0.85" stopColor="#ecdcdc" stopOpacity="0.16" />
            <stop offset="1" stopColor="#f8f4f0" stopOpacity="0.55" />
          </linearGradient>
          <filter id="sonar-speckle" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.93  0 0 0 0 0.86  0 0 0 0 0.86  0 0 0 1.6 -0.72" />
          </filter>
        </defs>

        {/* Sector field */}
        <path d={sector} fill="#4a2637" />
        <g clipPath="url(#sonar-sector)">
          <rect width="800" height="760" fill="url(#sonar-glow)" />
          <rect width="800" height="760" filter="url(#sonar-speckle)" opacity="0.35" />
          {/* Sweep: a soft wedge that rotates about the apex */}
          <g className="sonar-sweep" style={{ transformOrigin: `${apex.x}px ${apex.y}px` }}>
            <path
              d={`M${apex.x} ${apex.y} L${pt(-9, R + 40).x} ${pt(-9, R + 40).y} A${R + 40} ${R + 40} 0 0 1 ${pt(0, R + 40).x} ${pt(0, R + 40).y}Z`}
              fill="#ecdcdc"
              opacity="0.07"
            />
            <line x1={apex.x} y1={apex.y} x2={pt(0, R + 40).x} y2={pt(0, R + 40).y} stroke="#f8f4f0" strokeOpacity="0.55" strokeWidth="1.2" />
          </g>
        </g>

        {/* Depth arcs and beam guides */}
        <g fill="none" stroke="#ecdcdc" strokeWidth="1" vectorEffect="non-scaling-stroke">
          {depths.map((r, i) => (
            <path key={r} d={arc(r)} strokeOpacity={i === depths.length - 1 ? 0.35 : 0.12} strokeDasharray={i % 2 ? "2 6" : undefined} />
          ))}
          {beams.map((deg) => {
            const a = pt(deg, inner);
            const b = pt(deg, R);
            return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity="0.06" />;
          })}
          <path d={sector} strokeOpacity="0.4" />
        </g>

        {/* Depth scale along the right edge */}
        <g stroke="#ecdcdc" strokeOpacity="0.5" strokeWidth="1">
          {Array.from({ length: 25 }, (_, i) => {
            const r = inner + 24 + i * 24;
            const p = pt(span, r);
            return <line key={i} x1={p.x + 8} y1={p.y} x2={p.x + (i % 5 === 0 ? 20 : 13)} y2={p.y} />;
          })}
        </g>

        {/* Focal markers */}
        <g fill="#c98f9f">
          <path d={`M${pt(span, 320).x + 26} ${pt(span, 320).y} l8 -5 v10z`} />
        </g>
      </svg>

      <div className="absolute top-6 left-6 flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-rose-soft/80 uppercase sm:top-8 sm:left-8">
        <span className="sonar-dot h-1.5 w-1.5 rounded-full bg-rose" />
        Fetal &amp; maternal medicine
      </div>
    </div>
  );
}
