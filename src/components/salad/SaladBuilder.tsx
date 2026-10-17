'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import { getCategoryInfo } from '@/lib/bmi';
import {
  DEFAULT_PROFILE,
  INGREDIENTS,
  SALAD_CATEGORIES,
  bowlTotals,
  defaultBowl,
  goalFor,
  mealTarget,
  portionGuide,
  portionsIn,
  profileFromResult,
  type Bowl,
  type SaladProfile,
} from '@/lib/salad';
import { loadLastResult } from '@/lib/storage';
import BowlPanel from './BowlPanel';
import Celebration from './Celebration';
import IngredientCarousel from './IngredientCarousel';
import SaladEvaluation from './SaladEvaluation';

const GOAL_COPY = {
  gain: 'healthy weight gain',
  maintain: 'maintaining your healthy weight',
  lose: 'gradual weight loss',
} as const;

const recommendedBowl = (p: SaladProfile) => defaultBowl(mealTarget(p), goalFor(p.category));

export default function SaladBuilder() {
  const [profile, setProfile] = useState<SaladProfile>(DEFAULT_PROFILE);
  const [bowl, setBowl] = useState<Bowl>(() => recommendedBowl(DEFAULT_PROFILE));
  const [step, setStep] = useState(0);
  const [evaluated, setEvaluated] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [undo, setUndo] = useState<{ id: number; msg: string; bowl: Bowl } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  /** True once the user has edited the bowl themselves (the default bowl shouldn't trigger confetti). */
  const userEdited = useRef(false);
  const wasInRange = useRef<boolean | null>(null);

  useEffect(() => {
    const last = loadLastResult();
    if (last) {
      const p = profileFromResult(last);
      setProfile(p);
      setBowl(recommendedBowl(p));
    }
  }, []);

  const goal = goalFor(profile.category);
  const target = useMemo(() => mealTarget(profile), [profile]);
  const category = SALAD_CATEGORIES[step];
  const items = INGREDIENTS.filter((i) => i.category === category.key);
  const info = getCategoryInfo(profile.category);
  const kcal = bowlTotals(bowl).kcal;
  const inRange = kcal >= target.kcal.min && kcal <= target.kcal.max;
  const isLast = step === SALAD_CATEGORIES.length - 1;

  // Celebrate the moment the user's own edits bring the bowl into the target range.
  useEffect(() => {
    if (inRange && wasInRange.current === false && userEdited.current) setCelebrating(true);
    wasInRange.current = inRange;
  }, [inRange]);

  const setQty = (id: string, qty: number) => {
    userEdited.current = true;
    setBowl((b) => {
      const next = { ...b };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const goTo = (i: number) => {
    setStep(i);
    setEvaluated(false);
  };
  const evaluate = () => {
    setEvaluated(true);
    if (inRange) setCelebrating(true);
    topRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };
  const replaceBowl = (next: Bowl, msg: string) => {
    setUndo({ id: Date.now(), msg, bowl });
    setBowl(next);
    setEvaluated(false);
  };
  const startOver = () => {
    userEdited.current = false;
    replaceBowl(recommendedBowl(profile), 'Started over with your recommended salad');
    setStep(0);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };
  const clearBowl = () => {
    userEdited.current = true;
    replaceBowl({}, 'Bowl cleared');
  };
  const undoReplace = () => {
    if (undo) setBowl(undo.bowl);
    setUndo(null);
  };
  const endCelebration = useCallback(() => setCelebrating(false), []);

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 12, md: 5 } }}>
      {/* Sticky top bar: navigation and Start over are always within reach. */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          bgcolor: 'rgba(255,255,255,.88)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pt: 'env(safe-area-inset-top)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1440,
            mx: 'auto',
            px: { xs: 1.5, sm: 3, md: 4 },
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.primary' }}>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Back to&nbsp;
            </Box>
            BMI report
          </Button>
          <Typography sx={{ fontWeight: 700, display: { xs: 'none', md: 'block' } }}>🥗 Salad prep</Typography>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={startOver} sx={{ bgcolor: '#fff' }}>
            Start over
          </Button>
        </Box>
      </Box>

      <Box
        component="header"
        sx={{
          background: 'linear-gradient(120deg, #eef6f2 0%, #f4f8f6 45%, #f3efe6 100%)',
          borderBottomLeftRadius: { md: 32 },
          borderBottomRightRadius: { md: 32 },
          pb: { xs: 3, md: 7 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: { xs: -30, md: 60 },
            top: { xs: 10, md: 0 },
            fontSize: { xs: 110, md: 190 },
            opacity: { xs: 0.18, md: 1 },
            filter: 'drop-shadow(0 18px 24px rgba(91,74,47,.25))',
            lineHeight: 1,
          }}
        >
          🥗
        </Box>
        <Box sx={{ position: 'relative', maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2.5, md: 4 } }}>
          <Box
            sx={{ display: 'inline-block', bgcolor: 'primary.main', color: '#fff', px: 2, py: 0.6, borderRadius: 99, fontWeight: 600, fontSize: 14 }}
          >
            Salad prep
          </Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 40, md: 46 }, mt: 2, mb: 1.25 }}>
            Build your perfect salad
          </Typography>
          <Typography sx={{ fontSize: { xs: 15.5, md: 18 }, maxWidth: 720, lineHeight: 1.5 }}>
            {profile.personalised ? (
              <>
                {profile.name ? `${profile.name.split(' ')[0]}, based` : 'Based'} on your BMI of <strong>{profile.bmi.toFixed(1)}</strong> (
                <Box component="span" sx={{ color: info.color, fontWeight: 700 }}>
                  {info.label}
                </Box>
                ), we&apos;ll guide your portions for {GOAL_COPY[goal]}.
              </>
            ) : (
              <>Pick your favourite ingredients and we&apos;ll check the portions and calories for you.</>
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {[
              `Meal target ${target.kcal.min}–${target.kcal.max} kcal`,
              `Protein ${target.protein} g`,
              `Fibre ${target.fiber} g+`,
            ].map((label) => (
              <Box key={label} sx={{ bgcolor: '#fff', border: '1px solid', borderColor: 'divider', borderRadius: 99, px: 1.5, py: 0.5, fontSize: 13.5, fontWeight: 600 }}>
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        ref={topRef}
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, md: -4 },
          position: 'relative',
          scrollMarginTop: 16,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(300px, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
          {!profile.personalised && (
            <Alert severity="info" sx={{ borderRadius: '15px' }} action={<Button component={Link} href="/" size="small">Calculate BMI</Button>}>
              Calculate your BMI first to get portion advice tailored to you. Using general targets for now.
            </Alert>
          )}

          {evaluated ? (
            <SaladEvaluation bowl={bowl} target={target} goal={goal} onEdit={() => setEvaluated(false)} />
          ) : (
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)', minWidth: 0 }}>
              {/* Step indicator */}
              <Box
                role="tablist"
                aria-label="Salad steps"
                sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
              >
                {SALAD_CATEGORIES.map((c, i) => {
                  const count = portionsIn(bowl, c.key);
                  const active = i === step;
                  return (
                    <Box
                      key={c.key}
                      component="button"
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => goTo(i)}
                      sx={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.5,
                        py: 0.9,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: active ? c.accent : 'divider',
                        bgcolor: active ? c.soft : '#fff',
                        color: 'text.primary',
                        font: 'inherit',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      <span aria-hidden>{c.emoji}</span>
                      {c.label}
                      {count > 0 && (
                        <Box component="span" sx={{ bgcolor: c.accent, color: '#fff', borderRadius: 99, px: 0.75, fontSize: 12, fontWeight: 700 }}>
                          {count}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>
                    Step {step + 1} of {SALAD_CATEGORIES.length}
                  </Typography>
                  <Typography variant="h5" component="h2" sx={{ fontSize: { xs: 22, md: 26 } }}>
                    {category.emoji} {category.label}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.25 }}>{category.blurb}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  gap: 1.25,
                  alignItems: 'flex-start',
                  bgcolor: category.soft,
                  borderRadius: '12px',
                  px: 1.75,
                  py: 1.25,
                }}
              >
                <TipsAndUpdatesOutlinedIcon sx={{ color: category.accent, fontSize: 20, mt: '2px' }} />
                <Typography sx={{ fontSize: 14.5 }} data-testid="portion-guide">
                  <strong>Portion guide:</strong> {portionGuide(category.key, goal)}
                </Typography>
              </Box>

              <Box sx={{ mt: 1.5 }}>
                {/* Keyed by step so each category's carousel starts from its first card. */}
                <IngredientCarousel key={category.key} category={category} items={items} bowl={bowl} goal={goal} onChange={setQty} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mt: 2.5 }}>
                <Button startIcon={<ArrowBackIcon />} disabled={step === 0} onClick={() => goTo(step - 1)} sx={{ color: 'text.primary' }}>
                  Back
                </Button>
                {isLast ? (
                  <Button variant="contained" startIcon={<FactCheckOutlinedIcon />} onClick={evaluate} disabled={kcal === 0}>
                    Evaluate my salad
                  </Button>
                ) : (
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => goTo(step + 1)}>
                    Next: {SALAD_CATEGORIES[step + 1].label}
                  </Button>
                )}
              </Box>
            </Paper>
          )}
        </Box>

        <Box sx={{ position: { md: 'sticky' }, top: { md: 16 }, minWidth: 0 }}>
          <BowlPanel
            bowl={bowl}
            target={target}
            goal={goal}
            onRemove={(id) => setQty(id, 0)}
            onClear={clearBowl}
            onEvaluate={evaluate}
          />
        </Box>
      </Box>

      {/* Mobile summary bar */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2,
          py: 1.25,
          pb: 'calc(10px + env(safe-area-inset-bottom))',
          bgcolor: '#fff',
          boxShadow: '0 -4px 20px rgba(0,0,0,.08)',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Your bowl</Typography>
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
            {kcal} <Box component="span" sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>/ {target.kcal.target} kcal</Box>
          </Typography>
        </Box>
        <Button variant="contained" onClick={evaluate} disabled={kcal === 0} aria-label="Evaluate my salad (mobile)">
          Evaluate
        </Button>
      </Box>

      {celebrating && (
        <Celebration
          title={profile.name ? `Congratulations, ${profile.name.split(' ')[0]}!` : 'Congratulations!'}
          message={`Your salad hits your meal target — ${kcal} kcal, right in your ${target.kcal.min}–${target.kcal.max} kcal range.`}
          onDone={endCelebration}
        />
      )}

      {undo && (
        <Snackbar
          key={undo.id}
          open
          autoHideDuration={5000}
          // Ignore click-away: the click that opened this message would otherwise close it at once.
          onClose={(_, reason) => reason !== 'clickaway' && setUndo(null)}
          message={undo.msg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { xs: 88, md: 24 } }}
          action={
            <Button color="inherit" size="small" onClick={undoReplace} sx={{ color: '#86EFAC', fontWeight: 700 }}>
              Undo
            </Button>
          }
        />
      )}
    </Box>
  );
}
