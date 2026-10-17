'use client';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { recommendedFor, unitLabel, type Bowl, type Goal, type Ingredient, type SaladCategoryInfo } from '@/lib/salad';

export const MAX_PORTIONS = 6;

interface Props {
  category: SaladCategoryInfo;
  items: Ingredient[];
  bowl: Bowl;
  goal: Goal;
  onChange: (id: string, qty: number) => void;
}

function IngredientCard({
  item,
  qty,
  recommended,
  category,
  onChange,
}: {
  item: Ingredient;
  qty: number;
  recommended: boolean;
  category: SaladCategoryInfo;
  onChange: (qty: number) => void;
}) {
  const selected = qty > 0;
  return (
    <Box
      role="group"
      aria-label={item.name}
      sx={{
        scrollSnapAlign: 'start',
        flex: { xs: '0 0 72%', sm: '0 0 220px' },
        bgcolor: '#fff',
        borderRadius: '15px',
        border: '2px solid',
        borderColor: selected ? category.accent : 'transparent',
        boxShadow: selected ? `0 6px 18px ${category.accent}26` : '0 2px 12px rgba(16,64,44,.07)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'relative',
          height: 108,
          display: 'grid',
          placeItems: 'center',
          fontSize: 54,
          background: `linear-gradient(140deg, #ffffff 0%, ${category.soft} 100%)`,
        }}
      >
        <Box component="span" sx={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.15))' }}>
          {item.emoji}
        </Box>
        {recommended && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 99,
              bgcolor: 'primary.main',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <ThumbUpAltOutlinedIcon sx={{ fontSize: 12 }} /> Good for you
          </Box>
        )}
        {selected && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              minWidth: 26,
              height: 26,
              px: 0.75,
              borderRadius: 99,
              bgcolor: category.accent,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ×{qty}
          </Box>
        )}
      </Box>
      <Box sx={{ p: 1.75, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{item.name}</Typography>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>{item.portion}</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
          <span>
            <strong style={{ color: '#111827' }}>{item.kcal}</strong> kcal
          </span>
          <span>
            <strong style={{ color: '#111827' }}>{item.protein}</strong> g protein
          </span>
        </Box>
        <Box sx={{ mt: 'auto', pt: 1.25 }}>
          {selected ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: category.soft,
                borderRadius: '10px',
                p: 0.5,
              }}
            >
              <IconButton size="small" onClick={() => onChange(qty - 1)} aria-label={`Remove one ${item.name}`} sx={{ bgcolor: '#fff' }}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }} aria-live="polite">
                {qty} {unitLabel(qty, item.unit)}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onChange(qty + 1)}
                disabled={qty >= MAX_PORTIONS}
                aria-label={`Add one more ${item.name}`}
                sx={{ bgcolor: '#fff' }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => onChange(1)}
              aria-label={`Add ${item.name}`}
              sx={{ borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: category.accent, bgcolor: category.soft } }}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function IngredientCarousel({ category, items, bowl, goal, onChange }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative', mx: { sm: 3.5 } }}>
      <Box
        ref={track}
        aria-label={`${category.label} options`}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingInline: 4,
          px: 0.5,
          py: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((item) => (
          <IngredientCard
            key={item.id}
            item={item}
            qty={bowl[item.id] ?? 0}
            recommended={recommendedFor(item, goal)}
            category={category}
            onChange={(qty) => onChange(item.id, qty)}
          />
        ))}
      </Box>
      {[-1, 1].map((dir) => (
        <IconButton
          key={dir}
          size="small"
          onClick={() => scroll(dir as 1 | -1)}
          aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            position: 'absolute',
            top: '42%',
            [dir < 0 ? 'left' : 'right']: -40,
            bgcolor: '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,.15)',
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          {dir < 0 ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      ))}
    </Box>
  );
}
