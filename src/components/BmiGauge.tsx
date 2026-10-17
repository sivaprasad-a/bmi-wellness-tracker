'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { gaugeFraction, getCategoryInfo, type BmiCategory } from '@/lib/bmi';

const STOPS: [number, [number, number, number]][] = [
  [0, [37, 99, 235]],
  [0.22, [56, 189, 248]],
  [0.38, [74, 222, 128]],
  [0.55, [134, 239, 172]],
  [0.68, [250, 204, 21]],
  [0.84, [251, 146, 60]],
  [1, [248, 113, 113]],
];

function colorAt(t: number): string {
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return 'rgb(248,113,113)';
}

const CX = 160;
const CY = 160;
const R = 136;
const START = 200; // degrees, counter-clockwise from +x
const SWEEP = 220;
const SEGMENTS = 72;

// Rounded so server and browser produce identical SVG paths (trig results can differ in the
// last floating-point digits between Node and the browser, causing a hydration mismatch).
const r2 = (n: number) => Math.round(n * 100) / 100;

const point = (deg: number, r = R) => {
  const rad = (deg * Math.PI) / 180;
  return { x: r2(CX + r * Math.cos(rad)), y: r2(CY - r * Math.sin(rad)) };
};

interface Props {
  bmi: number;
  category: BmiCategory;
}

export default function BmiGauge({ bmi, category }: Props) {
  const info = getCategoryInfo(category);
  const frac = gaugeFraction(bmi);
  const marker = point(START - SWEEP * frac);
  const segs = Array.from({ length: SEGMENTS }, (_, i) => {
    const a0 = START - (SWEEP * i) / SEGMENTS;
    const a1 = START - (SWEEP * (i + 1.15)) / SEGMENTS;
    const p0 = point(a0);
    const p1 = point(Math.max(a1, START - SWEEP));
    return { d: `M ${p0.x} ${p0.y} A ${R} ${R} 0 0 1 ${p1.x} ${p1.y}`, color: colorAt(i / (SEGMENTS - 1)) };
  });
  const startPt = point(START);
  const endPt = point(START - SWEEP);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 340, mx: 'auto', aspectRatio: '320 / 220' }}>
      <svg viewBox="0 0 320 220" width="100%" height="100%" role="img" aria-label={`BMI gauge showing ${bmi}`}>
        <defs>
          <radialGradient id="gaugeBg" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f6faf8" />
          </radialGradient>
          <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.25" />
          </filter>
        </defs>
        <circle cx={CX} cy={CY} r={R - 18} fill="url(#gaugeBg)" />
        {segs.map((s, i) => (
          <path key={i} d={s.d} stroke={s.color} strokeWidth={14} fill="none" />
        ))}
        <circle cx={startPt.x} cy={startPt.y} r={7} fill={colorAt(0)} />
        <circle cx={endPt.x} cy={endPt.y} r={7} fill={colorAt(1)} />
        <circle cx={marker.x} cy={marker.y} r={10} fill="#fff" filter="url(#dotShadow)" />
        <circle cx={marker.x} cy={marker.y} r={6.5} fill="#1E3A8A" data-testid="gauge-marker" />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: '10%',
        }}
      >
        <Typography
          component="p"
          sx={{ fontSize: { xs: 56, sm: 68 }, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}
          data-testid="bmi-value"
        >
          {bmi.toFixed(1)}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 500, mt: 0.5 }}>BMI</Typography>
        <Box
          sx={{
            mt: 1,
            px: 2.5,
            py: 0.6,
            borderRadius: 99,
            bgcolor: info.softColor,
            color: info.color,
            fontWeight: 700,
            fontSize: 17,
            filter: 'saturate(1.1) brightness(0.92)',
          }}
          data-testid="bmi-category"
        >
          {info.label}
        </Box>
      </Box>
    </Box>
  );
}
