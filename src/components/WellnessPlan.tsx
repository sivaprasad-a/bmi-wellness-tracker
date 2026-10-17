'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoFoodOutlinedIcon from '@mui/icons-material/NoFoodOutlined';
import type { Accent, PlanItem, PlanTab, WellnessPlan as Plan } from '@/lib/plan';
import SectionHeader from './SectionHeader';

const TAB_ICONS: Record<PlanTab, React.ReactElement> = {
  nutrition: <RestaurantIcon />,
  cutback: <NoFoodOutlinedIcon />,
  activity: <DirectionsRunIcon />,
  hydration: <WaterDropIcon />,
  tips: <LightbulbOutlinedIcon />,
};

export const ACCENTS: Record<Accent, { bg: string; fg: string; art: string }> = {
  blue: { bg: '#EAF2FE', fg: '#1D4ED8', art: 'linear-gradient(140deg, #fdfbf7 0%, #e7eef9 100%)' },
  amber: { bg: '#FEF5E4', fg: '#B45309', art: 'linear-gradient(140deg, #fbf3e6 0%, #f3dfc0 100%)' },
  purple: { bg: '#F3EAFE', fg: '#7E22CE', art: 'linear-gradient(140deg, #f7f2fb 0%, #e6d6f5 100%)' },
  green: { bg: '#E6F6EC', fg: '#15803D', art: 'linear-gradient(140deg, #f3faf5 0%, #d3eedd 100%)' },
  teal: { bg: '#E0F5F5', fg: '#0F766E', art: 'linear-gradient(140deg, #f0fafa 0%, #cdeceb 100%)' },
  rose: { bg: '#FDECEF', fg: '#BE123C', art: 'linear-gradient(140deg, #fdf3f4 0%, #f7d5db 100%)' },
};

function PlanCard({ item, onOpen }: { item: PlanItem; onOpen: () => void }) {
  const accent = ACCENTS[item.accent];
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: '#fff',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(16,64,44,.07)',
        minHeight: 150,
        transition: 'transform .2s, box-shadow .2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(16,64,44,.1)' },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: '38%',
          flexShrink: 0,
          background: accent.art,
          display: 'grid',
          placeItems: 'center',
          fontSize: 58,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 84,
            height: 84,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,.65)',
            zIndex: 0,
          },
        }}
      >
        <Box component="span" sx={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.15))' }}>
          {item.emoji}
        </Box>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3 }}>{item.title}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 13.5, mt: 1, lineHeight: 1.5, flex: 1 }}>
          {item.description}
        </Typography>
        <Button
          onClick={onOpen}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            mt: 1.5,
            justifyContent: 'flex-start',
            bgcolor: accent.bg,
            color: accent.fg,
            fontWeight: 500,
            fontSize: 14,
            px: 1.5,
            '&:hover': { bgcolor: accent.bg, filter: 'brightness(0.97)' },
          }}
          aria-label={`View details: ${item.title}`}
        >
          View details
        </Button>
      </Box>
    </Box>
  );
}

export default function WellnessPlan({ plan }: { plan: Plan }) {
  const [selected, setSelected] = useState<PlanTab>('nutrition');
  const [open, setOpen] = useState<PlanItem | null>(null);
  // Fall back to the first tab if a recalculation removed the selected one (e.g. "Cut back").
  const tab = plan.tabs.some((t) => t.key === selected) ? selected : plan.tabs[0].key;

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Your personalized wellness plan"
      sx={{ p: { xs: 2.5, md: 3 }, boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)' }}
    >
      <SectionHeader icon={<SpaOutlinedIcon />} title="Your personalized wellness plan" subtitle={plan.subtitle} />

      <Tabs
        value={tab}
        onChange={(_, v: PlanTab) => setSelected(v)}
        variant="fullWidth"
        aria-label="Wellness plan categories"
        sx={{
          mt: 2.5,
          bgcolor: '#F1F3F4',
          borderRadius: '15px',
          p: 0.5,
          minHeight: 0,
          '& .MuiTabs-indicator': { height: 3, borderRadius: 2, bottom: 4 },
          '& .MuiTabs-scroller': { overflow: 'visible !important' },
        }}
      >
        {plan.tabs.map((t) => (
          <Tab
            key={t.key}
            value={t.key}
            id={`plan-tab-${t.key}`}
            aria-controls={`plan-panel-${t.key}`}
            label={<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t.label}</Box>}
            icon={TAB_ICONS[t.key]}
            iconPosition="start"
            aria-label={t.label}
            sx={{
              minHeight: 48,
              minWidth: 0,
              px: 1,
              borderRadius: '12px',
              fontSize: 15.5,
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': { bgcolor: '#fff', color: 'text.primary', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,.08)' },
              '&.Mui-selected svg': { color: 'primary.main' },
            }}
          />
        ))}
      </Tabs>

      {/*
        All panels share one grid cell, so the container is always as tall as the
        largest section and switching tabs never changes the card's height.
      */}
      <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' }}>
        {plan.tabs.map((section) => {
          const active = section.key === tab;
          return (
            <Box
              key={section.key}
              role="tabpanel"
              id={`plan-panel-${section.key}`}
              aria-labelledby={`plan-tab-${section.key}`}
              aria-hidden={!active}
              inert={!active}
              sx={{
                gridArea: '1 / 1',
                display: 'grid',
                gap: 2,
                alignContent: 'start',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                gridAutoRows: '1fr',
                visibility: active ? 'visible' : 'hidden',
                opacity: active ? 1 : 0,
                transition: 'opacity .2s ease',
              }}
            >
              {section.items.map((item) => (
                <PlanCard key={item.id} item={item} onOpen={() => setOpen(item)} />
              ))}
            </Box>
          );
        })}
      </Box>

      <Dialog open={!!open} onClose={() => setOpen(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '15px' } } }}>
        {open && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
              <Box component="span" sx={{ fontSize: 34 }} aria-hidden>
                {open.emoji}
              </Box>
              {open.title}
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>{open.description}</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 1.25 }}>
                {open.details.map((d) => (
                  <Box component="li" key={d} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20, mt: '2px' }} />
                    <Typography>{d}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button variant="contained" onClick={() => setOpen(null)}>
                Got it
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
}
