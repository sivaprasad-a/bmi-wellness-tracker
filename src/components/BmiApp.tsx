'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { keyframes } from '@emotion/react';
import { evaluate, getCategoryInfo, type BmiInput, type BmiResult, type UnitSystem } from '@/lib/bmi';
import { DEFAULT_VALUES, parseForm } from '@/lib/form';
import { buildPlan } from '@/lib/plan';
import { buildShareText, whatsappShareUrl } from '@/lib/share';
import { saveLastResult } from '@/lib/storage';
import DetailsForm from './DetailsForm';
import Hero from './Hero';
import NameDialog from './NameDialog';
import ResultCard from './ResultCard';
import SaladPromo from './SaladPromo';
import WellnessPlan from './WellnessPlan';

const initialResult = (): BmiResult => evaluate(parseForm(DEFAULT_VALUES).input!);

/** Brief green glow on the result card after each calculation. */
const flash = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(15, 118, 87, 0.55); transform: scale(0.995); }
  40% { box-shadow: 0 0 0 10px rgba(15, 118, 87, 0.18); transform: scale(1); }
  100% { box-shadow: 0 0 0 0 rgba(15, 118, 87, 0); }
`;

export default function BmiApp() {
  const [result, setResult] = useState<BmiResult>(initialResult);
  const [units, setUnits] = useState<UnitSystem>(DEFAULT_VALUES.units);
  const [downloading, setDownloading] = useState(false);
  const [askName, setAskName] = useState(false);
  const [formName, setFormName] = useState<string>();
  const [toast, setToast] = useState<{ id: number; msg: string; severity: 'success' | 'error' } | null>(null);
  const [calcCount, setCalcCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const plan = useMemo(() => buildPlan(result), [result]);

  // Share the latest result with the salad builder route.
  useEffect(() => saveLastResult(result), [result]);

  const notify = (msg: string, severity: 'success' | 'error') => setToast({ id: Date.now(), msg, severity });

  const handleCalculate = (input: BmiInput, u: UnitSystem) => {
    const next = evaluate(input);
    setResult(next);
    setUnits(u);
    // Visible feedback on every click, even when the values (and so the BMI) are unchanged.
    setCalcCount((c) => c + 1);
    notify(`BMI updated: ${next.bmi.toFixed(1)} (${getCategoryInfo(next.category).label})`, 'success');
    if (window.matchMedia?.('(max-width: 899px)').matches) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownload = () => {
    if (result.input.name) generatePdf(result);
    else setAskName(true);
  };

  const handleNameConfirm = (name: string) => {
    const named: BmiResult = { ...result, input: { ...result.input, name } };
    setAskName(false);
    setResult(named);
    setFormName(name);
    generatePdf(named);
  };

  const generatePdf = async (r: BmiResult) => {
    setDownloading(true);
    try {
      const { downloadBmiReport } = await import('@/lib/report');
      downloadBmiReport(r, units);
      notify('Your BMI report has been downloaded', 'success');
    } catch (err) {
      console.error(err);
      notify('Could not generate the PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    window.open(whatsappShareUrl(buildShareText(result, units)), '_blank', 'noopener,noreferrer');
  };

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Hero />
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: -1, md: -5 },
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(320px, 1fr) minmax(0, 2.3fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { md: 'sticky' }, top: { md: 16 } }}>
          <DetailsForm initialValues={DEFAULT_VALUES} name={formName} onCalculate={handleCalculate} />
        </Box>
        <Box ref={resultRef} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2, scrollMarginTop: 16, minWidth: 0 }}>
          <Box
            key={calcCount}
            data-testid="result-flash"
            sx={calcCount ? { animation: `${flash} 0.9s ease-out`, borderRadius: '20px' } : undefined}
          >
            <ResultCard
              result={result}
              units={units}
              onDownload={handleDownload}
              onShare={handleShare}
              downloading={downloading}
            />
          </Box>
          <WellnessPlan plan={plan} />
          <SaladPromo result={result} />
        </Box>
      </Box>
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 13, mt: 4, px: 2 }}>
        BMI is a screening tool and does not diagnose health. Consult a healthcare professional for medical advice.
      </Typography>

      {askName && <NameDialog open onClose={() => setAskName(false)} onConfirm={handleNameConfirm} />}

      {toast && (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={3500}
          onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.msg}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
