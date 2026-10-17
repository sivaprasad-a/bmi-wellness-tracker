'use client';
import { useEffect, useMemo } from 'react';
import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const fall = keyframes`
  0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 1; }
  100% { transform: translate3d(var(--drift), 105vh, 0) rotate(var(--spin)); opacity: 0.9; }
`;

const pop = keyframes`
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
  60% { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const COLORS = ['#16A34A', '#22C55E', '#FACC15', '#F97316', '#EF4444', '#3B82F6', '#A855F7'];
const PIECES = 70;

interface Props {
  title: string;
  message: string;
  onDone: () => void;
  /** Auto-dismiss delay in ms. */
  duration?: number;
}

/** Full-screen confetti burst with a congratulations card. */
export default function Celebration({ title, message, onDone, duration = 4000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  // Random layout generated once per celebration.
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.6,
        drift: `${(Math.random() - 0.5) * 30}vw`,
        spin: `${360 + Math.random() * 720}deg`,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.7,
      })),
    [],
  );

  return (
    <Box
      role="status"
      aria-live="assertive"
      onClick={onDone}
      data-testid="celebration"
      sx={{ position: 'fixed', inset: 0, zIndex: 1400, pointerEvents: 'auto', overflow: 'hidden', cursor: 'pointer' }}
    >
      <Box
        aria-hidden
        sx={{ position: 'absolute', inset: 0, '@media (prefers-reduced-motion: reduce)': { display: 'none' } }}
      >
        {pieces.map((p, i) => (
          <Box
            key={i}
            component="span"
            style={{ ['--drift' as string]: p.drift, ['--spin' as string]: p.spin }}
            sx={{
              position: 'absolute',
              top: 0,
              left: `${p.left}%`,
              width: p.w,
              height: p.round ? p.w : p.h,
              borderRadius: p.round ? '50%' : '2px',
              bgcolor: p.color,
              animation: `${fall} ${p.dur}s cubic-bezier(.25,.6,.4,1) ${p.delay}s forwards`,
              transform: 'translate3d(0, -10vh, 0)',
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(420px, calc(100vw - 32px))',
          bgcolor: '#fff',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(16, 64, 44, 0.3)',
          p: 3.5,
          textAlign: 'center',
          animation: `${pop} .45s cubic-bezier(.2,.9,.3,1.2) both`,
        }}
      >
        <Box aria-hidden sx={{ fontSize: 64, lineHeight: 1 }}>
          🎉
        </Box>
        <Typography component="p" sx={{ fontWeight: 800, fontSize: 24, mt: 1.5 }}>
          {title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: 15.5, lineHeight: 1.5 }}>{message}</Typography>
        <Typography sx={{ color: 'text.disabled', mt: 2, fontSize: 12.5 }}>Tap anywhere to continue</Typography>
      </Box>
    </Box>
  );
}
