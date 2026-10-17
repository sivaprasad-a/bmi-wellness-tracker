'use client';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { BmiResult } from '@/lib/bmi';
import { goalFor, mealTarget, profileFromResult } from '@/lib/salad';

/** Call-to-action under the report linking to the salad builder. */
export default function SaladPromo({ result }: { result: BmiResult }) {
  const target = mealTarget(profileFromResult(result));
  const goal = goalFor(result.category);
  const pitch =
    goal === 'gain'
      ? 'pack in healthy calories'
      : goal === 'lose'
        ? 'keep portions in check'
        : 'stay perfectly balanced';

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Try our salad prep"
      sx={{
        p: { xs: 2.5, md: 3 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, md: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        textAlign: { xs: 'center', sm: 'left' },
        background: 'linear-gradient(120deg, #0F7657 0%, #16a06e 60%, #4cbf8a 100%)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(15, 118, 87, 0.25)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        aria-hidden
        sx={{
          flexShrink: 0,
          width: 96,
          height: 96,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,.18)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 58,
        }}
      >
        🥗
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: 21, md: 24 } }}>
          Try our salad prep
        </Typography>
        <Typography sx={{ opacity: 0.92, mt: 0.5, fontSize: 15.5, lineHeight: 1.5 }}>
          Build your own bowl from greens, vegetables, protein, fibre, seeds and Greek yogurt. We&apos;ll use your BMI
          of {result.bmi.toFixed(1)} to {pitch}, aiming for about {target.kcal.target} kcal per meal.
        </Typography>
      </Box>
      <Button
        component={Link}
        href="/salad"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{ flexShrink: 0, bgcolor: '#fff', color: 'primary.main', px: 2.5, py: 1.25, '&:hover': { bgcolor: '#F0FDF4' } }}
      >
        Build my salad
      </Button>
    </Paper>
  );
}
