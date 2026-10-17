'use client';
import { useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { evaluate, type BmiInput, type BmiResult, type UnitSystem } from '@/lib/bmi';
import { DEFAULT_VALUES, parseForm } from '@/lib/form';
import { buildPlan } from '@/lib/plan';
import { buildShareText, whatsappShareUrl } from '@/lib/share';
import DetailsForm from './DetailsForm';
import Hero from './Hero';
import NameDialog from './NameDialog';
import ResultCard from './ResultCard';
import WellnessPlan from './WellnessPlan';

const initialResult = (): BmiResult => evaluate(parseForm(DEFAULT_VALUES).input!);

export default function BmiApp() {
  const [result, setResult] = useState<BmiResult>(initialResult);
  const [units, setUnits] = useState<UnitSystem>(DEFAULT_VALUES.units);
  const [downloading, setDownloading] = useState(false);
  const [askName, setAskName] = useState(false);
  const [formName, setFormName] = useState<string>();
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const plan = useMemo(() => buildPlan(result), [result]);

  const handleCalculate = (input: BmiInput, u: UnitSystem) => {
    setResult(evaluate(input));
    setUnits(u);
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
      setToast({ msg: 'Your BMI report has been downloaded', severity: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ msg: 'Could not generate the PDF. Please try again.', severity: 'error' });
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
          <ResultCard
            result={result}
            units={units}
            onDownload={handleDownload}
            onShare={handleShare}
            downloading={downloading}
          />
          <WellnessPlan plan={plan} />
        </Box>
      </Box>
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 13, mt: 4, px: 2 }}>
        BMI is a screening tool and does not diagnose health. Consult a healthcare professional for medical advice.
      </Typography>

      {askName && <NameDialog open onClose={() => setAskName(false)} onConfirm={handleNameConfirm} />}

      {toast && (
        <Snackbar
          open
          autoHideDuration={3500}
          onClose={() => setToast(null)}
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
