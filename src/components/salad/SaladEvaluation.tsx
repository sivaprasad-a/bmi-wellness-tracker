'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { evaluateSalad, type Bowl, type Goal, type MealTarget, type Suggestion, type SuggestionKind } from '@/lib/salad';
import { CalorieMeter, MacroGrid } from './BowlPanel';

const STATUS_STYLE = {
  over: { label: 'Over your target', color: '#B91C1C', bg: '#FEF2F2' },
  under: { label: 'Below your target', color: '#1D4ED8', bg: '#EFF6FF' },
  'on-target': { label: 'Well balanced', color: '#15803D', bg: '#F0FDF4' },
} as const;

const KIND_ICON: Record<SuggestionKind, React.ReactElement> = {
  drop: <RemoveCircleOutlineIcon sx={{ color: '#DC2626' }} />,
  reduce: <ContentCutIcon sx={{ color: '#EA580C' }} />,
  swap: <SwapHorizIcon sx={{ color: '#7C3AED' }} />,
  add: <AddCircleOutlineIcon sx={{ color: '#16A34A' }} />,
};

function SuggestionList({ title, items, empty }: { title: string; items: Suggestion[]; empty: string }) {
  return (
    <Box sx={{ bgcolor: '#F7F9F8', borderRadius: '15px', p: 2.25 }}>
      <Typography component="h3" sx={{ fontWeight: 700, fontSize: 16.5, mb: 1.5 }}>
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{empty}</Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 1.25 }}>
          {items.map((s) => (
            <Box component="li" key={s.text} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
              {KIND_ICON[s.kind]}
              <Typography sx={{ flex: 1, fontSize: 14.5, lineHeight: 1.45 }}>{s.text}</Typography>
              <Box
                sx={{
                  flexShrink: 0,
                  px: 1,
                  py: 0.25,
                  borderRadius: 99,
                  fontSize: 12.5,
                  fontWeight: 700,
                  bgcolor: s.kcalDelta < 0 ? '#DCFCE7' : '#FEF3C7',
                  color: s.kcalDelta < 0 ? '#15803D' : '#92400E',
                }}
              >
                {s.kcalDelta > 0 ? '+' : ''}
                {s.kcalDelta} kcal
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

interface Props {
  bowl: Bowl;
  target: MealTarget;
  goal: Goal;
  onEdit: () => void;
}

export default function SaladEvaluation({ bowl, target, goal, onEdit }: Props) {
  const ev = evaluateSalad(bowl, target, goal);
  const style = STATUS_STYLE[ev.status];
  const perfect = ev.drop.length === 0 && ev.add.length === 0;

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Salad evaluation"
      sx={{ p: { xs: 2.5, md: 3 }, boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)', display: 'grid', gap: 2.5 }}
    >
      <Box sx={{ bgcolor: style.bg, borderRadius: '15px', p: 2.5 }}>
        <Typography sx={{ color: style.color, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          {style.label}
        </Typography>
        <Typography component="h2" sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 800, mt: 0.5 }} data-testid="salad-headline">
          {ev.headline}
        </Typography>
        <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0, 1fr))' } }}>
          <CalorieMeter kcal={ev.totals.kcal} target={target} />
          <MacroGrid bowl={bowl} target={target} />
        </Box>
      </Box>

      {perfect ? (
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', bgcolor: '#F0FDF4', borderRadius: '15px', p: 2.5 }}>
          <EmojiEventsOutlinedIcon sx={{ color: '#15803D', fontSize: 36 }} />
          <Typography sx={{ fontSize: 15.5 }}>
            <strong>Perfect bowl!</strong> Calories, protein and fibre are all on point for your goal. Enjoy!
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0, 1fr))' } }}>
            <SuggestionList title="What to drop or reduce" items={ev.drop} empty="Nothing to drop — your portions look good." />
            <SuggestionList title="What to add" items={ev.add} empty="Nothing missing — great balance." />
          </Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 14.5 }} data-testid="adjusted-kcal">
            With these changes your salad would be about <strong>{ev.adjustedKcal} kcal</strong> (target {target.kcal.min}–
            {target.kcal.max} kcal).
          </Typography>
        </>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={onEdit}>
          Edit my salad
        </Button>
      </Box>
    </Paper>
  );
}
