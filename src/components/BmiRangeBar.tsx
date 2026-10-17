'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CATEGORIES, rangeBarFraction, type BmiCategory } from '@/lib/bmi';

const BAR_COLORS: Record<BmiCategory, string> = {
  underweight: '#93C5FD',
  normal: '#86D7A3',
  overweight: '#F2C66D',
  obesity: '#F87171',
};

interface Props {
  bmi: number;
  category: BmiCategory;
}

export default function BmiRangeBar({ bmi, category }: Props) {
  const pct = rangeBarFraction(bmi) * 100;

  return (
    <Box>
      <Box sx={{ position: 'relative', display: 'flex', gap: '3px', height: 14 }}>
        {CATEGORIES.map((c, i) => (
          <Box
            key={c.key}
            sx={{
              flex: 1,
              bgcolor: BAR_COLORS[c.key],
              borderTopLeftRadius: i === 0 ? 99 : 0,
              borderBottomLeftRadius: i === 0 ? 99 : 0,
              borderTopRightRadius: i === CATEGORIES.length - 1 ? 99 : 0,
              borderBottomRightRadius: i === CATEGORIES.length - 1 ? 99 : 0,
            }}
          />
        ))}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: 22,
            height: 22,
            borderRadius: '50%',
            bgcolor: '#1E3A8A',
            border: '4px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,.3)',
            transition: 'left .6s cubic-bezier(.2,.8,.2,1)',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', mt: 1.5 }}>
        {CATEGORIES.map((c) => {
          const active = c.key === category;
          return (
            <Box key={c.key} sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: 12, sm: 14 },
                  fontWeight: active ? 600 : 400,
                  color: c.key === 'underweight' ? '#1D4ED8' : c.key === 'obesity' ? '#DC2626' : 'text.primary',
                  textDecoration: active ? 'underline' : 'none',
                  textUnderlineOffset: 4,
                }}
                noWrap
              >
                {c.label}
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: 'text.secondary', mt: 0.25 }}>
                {c.rangeLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
