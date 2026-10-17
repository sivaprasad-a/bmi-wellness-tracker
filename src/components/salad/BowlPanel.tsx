'use client';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { bowlTotals, getIngredient, liveTips, type Bowl, type Goal, type MealTarget } from '@/lib/salad';

interface Props {
  bowl: Bowl;
  target: MealTarget;
  goal: Goal;
  onRemove: (id: string) => void;
  onClear: () => void;
  onEvaluate: () => void;
}

export function CalorieMeter({ kcal, target }: { kcal: number; target: MealTarget }) {
  const scaleMax = target.kcal.max * 1.35;
  const pct = (v: number) => `${Math.min(100, (v / scaleMax) * 100)}%`;
  const color = kcal > target.kcal.max ? '#EF4444' : kcal >= target.kcal.min ? '#16A34A' : '#3B82F6';
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }} data-testid="bowl-kcal">
          {kcal}
          <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, color: 'text.secondary', ml: 0.5 }}>
            kcal
          </Typography>
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          Target {target.kcal.min}–{target.kcal.max}
        </Typography>
      </Box>
      <Box
        role="meter"
        aria-label="Calories in your bowl"
        aria-valuemin={0}
        aria-valuemax={Math.round(scaleMax)}
        aria-valuenow={kcal}
        sx={{ position: 'relative', height: 10, borderRadius: 99, bgcolor: '#EEF1F3', mt: 1.25, overflow: 'hidden' }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: pct(target.kcal.min),
            width: `calc(${pct(target.kcal.max)} - ${pct(target.kcal.min)})`,
            top: 0,
            bottom: 0,
            bgcolor: '#BBF7D0',
          }}
        />
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct(kcal), bgcolor: color, borderRadius: 99, transition: 'width .3s' }} />
      </Box>
    </Box>
  );
}

export function MacroGrid({ bowl, target }: { bowl: Bowl; target: MealTarget }) {
  const t = bowlTotals(bowl);
  const cells: [string, string, boolean | null][] = [
    ['Protein', `${t.protein} / ${target.protein} g`, t.protein >= target.protein],
    ['Fibre', `${t.fiber} / ${target.fiber} g`, t.fiber >= target.fiber],
    ['Carbs', `${t.carbs} g`, null],
    ['Fat', `${t.fat} g`, null],
  ];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
      {cells.map(([label, value, met]) => (
        <Box key={label} sx={{ bgcolor: '#F7F9F8', borderRadius: '10px', px: 1.5, py: 1 }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
          <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: met === null ? 'text.primary' : met ? '#15803D' : 'text.primary' }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function BowlPanel({ bowl, target, goal, onRemove, onClear, onEvaluate }: Props) {
  const items = Object.entries(bowl).filter(([, q]) => q > 0);
  const totals = bowlTotals(bowl);
  const tips = liveTips(bowl, target, goal).slice(0, 4);

  return (
    <Paper
      elevation={0}
      component="aside"
      aria-label="Your bowl"
      sx={{ p: { xs: 2.5, md: 3 }, boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)', display: 'grid', gap: 2 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h2" sx={{ fontSize: 20 }}>
          Your bowl
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Typography>
          {items.length > 0 && (
            <Button size="small" onClick={onClear} sx={{ minWidth: 0, color: 'text.secondary' }}>
              Clear bowl
            </Button>
          )}
        </Box>
      </Box>

      <CalorieMeter kcal={totals.kcal} target={target} />
      <MacroGrid bowl={bowl} target={target} />

      {items.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 0.75, maxHeight: 260, overflowY: 'auto' }}>
          {items.map(([id, qty]) => {
            const item = getIngredient(id);
            return (
              <Box component="li" key={id} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box component="span" aria-hidden sx={{ fontSize: 22 }}>
                  {item.emoji}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }} noWrap>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {qty} × {item.portion}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{Math.round(item.kcal * qty)} kcal</Typography>
                <IconButton size="small" onClick={() => onRemove(id)} aria-label={`Remove ${item.name} from bowl`}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ display: 'grid', gap: 1 }} aria-live="polite" aria-label="Portion tips">
        {tips.map((tip) => (
          <Alert key={tip.message} severity={tip.severity} sx={{ borderRadius: '12px', py: 0.25, fontSize: 13.5 }}>
            {tip.message}
          </Alert>
        ))}
      </Box>

      <Button
        variant="contained"
        size="large"
        startIcon={<FactCheckOutlinedIcon />}
        onClick={onEvaluate}
        disabled={items.length === 0}
        sx={{ py: 1.4, background: 'linear-gradient(180deg, #13865f 0%, #0F7657 100%)' }}
      >
        Evaluate my salad
      </Button>
    </Paper>
  );
}
