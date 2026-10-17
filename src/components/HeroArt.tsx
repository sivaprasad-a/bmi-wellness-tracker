/** Decorative healthy-food illustration used in the hero banner. */
export default function HeroArt() {
  const leaves: [number, number, number, number][] = [
    [70, 70, 34, -30], [120, 30, 28, 25], [40, 150, 30, 60], [150, 120, 22, -60],
    [250, 40, 26, 10], [300, 210, 24, -20], [640, 30, 30, 40], [690, 110, 26, -35],
    [210, 175, 20, 75],
  ];
  const tomatoes: [number, number, number][] = [[400, 70, 22], [438, 52, 18], [372, 96, 15]];
  const avocado: [number, number, number][] = [[520, 82, -20], [548, 100, -35], [570, 125, -50], [500, 64, -10]];
  const banana: [number, number][] = [[430, 140], [462, 150], [400, 128]];
  const nuts: [number, number, number][] = [
    [470, 90, 20], [490, 110, -30], [455, 118, 60], [510, 135, 10], [480, 130, -60], [445, 98, 40],
  ];

  return (
    <svg viewBox="0 0 760 260" width="100%" height="100%" preserveAspectRatio="xMaxYMid slice" aria-hidden>
      <defs>
        <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f1ea" />
          <stop offset="100%" stopColor="#e9e1d2" />
        </linearGradient>
        <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="35%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="heroMask">
          <rect width="760" height="260" fill="url(#fadeLeft)" />
        </mask>
        <radialGradient id="bowlBody" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dfe3e6" />
        </radialGradient>
        <radialGradient id="tomato" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ff7a6b" />
          <stop offset="100%" stopColor="#d62d20" />
        </radialGradient>
        <linearGradient id="dumbbell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f8f6a" />
          <stop offset="100%" stopColor="#1f5e43" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#5b4a2f" floodOpacity="0.22" />
        </filter>
      </defs>

      <g mask="url(#heroMask)">
        <rect width="760" height="260" fill="url(#table)" />

        {leaves.map(([x, y, s, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <ellipse rx={s} ry={s * 0.5} fill={i % 2 ? '#3d9a4f' : '#56b45e'} />
            <path d={`M ${-s} 0 L ${s} 0`} stroke="#2f7a3d" strokeWidth="1.5" />
          </g>
        ))}

        {/* Water bottle */}
        <g opacity="0.75">
          <rect x="300" y="-10" width="46" height="120" rx="14" fill="#e6f4f8" stroke="#c4dde4" />
          <rect x="310" y="-20" width="26" height="22" rx="4" fill="#cfe5ea" />
          <rect x="306" y="40" width="34" height="60" rx="10" fill="#d6eef5" />
        </g>

        {/* Bowl */}
        <g filter="url(#soft)">
          <path d="M 310 110 Q 320 235 470 238 Q 620 235 630 110 Z" fill="url(#bowlBody)" />
          <ellipse cx="470" cy="108" rx="162" ry="76" fill="#f7f8f9" />
          <ellipse cx="470" cy="108" rx="146" ry="64" fill="#5c8f3a" />
          <ellipse cx="455" cy="112" rx="120" ry="50" fill="#79ad46" />
          <ellipse cx="470" cy="112" rx="60" ry="34" fill="#3b2f2a" />
          {nuts.map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="9" ry="5.5" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? '#b07a45' : '#8c5a30'} />
          ))}
          {tomatoes.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="url(#tomato)" />
              <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#fff" opacity="0.5" />
            </g>
          ))}
          {avocado.map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="26" ry="12" fill="#3f7d2b" />
              <ellipse cx={x} cy={y} rx="23" ry="9.5" fill="#cfe58a" />
              <ellipse cx={x + 4} cy={y} rx="14" ry="6" fill="#e8f2b0" />
            </g>
          ))}
          {banana.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="14" fill="#f8efc8" stroke="#e7d797" strokeWidth="2" />
              <circle cx={x} cy={y} r="3" fill="#cdbb76" />
            </g>
          ))}
        </g>

        {/* Dumbbell */}
        <g transform="translate(640 150) rotate(-28)" filter="url(#soft)">
          <rect x="-10" y="-9" width="120" height="18" rx="9" fill="#2e7553" />
          <rect x="-46" y="-40" width="44" height="80" rx="16" fill="url(#dumbbell)" />
          <rect x="102" y="-40" width="44" height="80" rx="16" fill="url(#dumbbell)" />
        </g>

        {/* Tape measure */}
        <path d="M 560 262 C 620 220, 700 230, 770 170" stroke="#f2c94c" strokeWidth="26" fill="none" />
        {Array.from({ length: 14 }, (_, i) => {
          const t = i / 13;
          const x = 560 + t * 210;
          const y = 262 - t * 90 + Math.sin(t * Math.PI) * -12;
          return <line key={i} x1={x} y1={y - 8} x2={x} y2={y + (i % 2 ? 0 : 4)} stroke="#6b5a1f" strokeWidth="1.5" />;
        })}
      </g>
    </svg>
  );
}
