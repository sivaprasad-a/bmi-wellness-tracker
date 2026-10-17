'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { HEALTHY_BMI, formatDate, getCategoryInfo, kgToLb, round, type BmiResult, type UnitSystem } from '@/lib/bmi';
import BmiGauge from './BmiGauge';
import BmiRangeBar from './BmiRangeBar';
import SectionHeader from './SectionHeader';

interface StatProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  caption?: string;
  testId?: string;
}

function Stat({ icon, iconBg, iconColor, label, value, caption, testId }: StatProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', minWidth: 0, py: 1 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          bgcolor: iconBg,
          color: iconColor,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.35 }}>{label}</Typography>
        <Typography sx={{ fontSize: { xs: 19, xl: 21 }, fontWeight: 700, mt: 0.5, lineHeight: 1.3 }} data-testid={testId}>
          {value}
        </Typography>
        {caption && <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.25 }}>{caption}</Typography>}
      </Box>
    </Box>
  );
}

interface Props {
  result: BmiResult;
  units: UnitSystem;
  onDownload: () => void;
  onShare: () => void;
  downloading?: boolean;
}

export default function ResultCard({ result, units, onDownload, onShare, downloading }: Props) {
  const info = getCategoryInfo(result.category);
  const { min, max } = result.healthyWeightKg;
  const weightRange =
    units === 'metric'
      ? `${round(min, 1)} – ${round(max, 1)} kg`
      : `${Math.round(kgToLb(min))} – ${Math.round(kgToLb(max))} lb`;

  return (
    <Paper
      elevation={0}
      component="section"
      aria-label="Your result"
      sx={{
        p: { xs: 2.5, md: 3 },
        background: 'linear-gradient(160deg, #eef7f2 0%, #f7fbf9 55%, #f1f8f4 100%)',
        boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)',
      }}
    >
      <SectionHeader
        icon={<RestaurantIcon />}
        title={result.input.name ? `${result.input.name.split(' ')[0]}'s Result` : 'Your Result'}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', ml: 'auto' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 13.5, mr: { md: 3 } }} suppressHydrationWarning>
              Calculated on {formatDate(result.calculatedAt)}
            </Typography>
            <Button
              variant="outlined"
              onClick={onDownload}
              disabled={downloading}
              startIcon={<DescriptionOutlinedIcon />}
              sx={{
                color: 'text.primary',
                borderColor: 'divider',
                bgcolor: '#fff',
                px: 2,
                py: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                '&:hover': { borderColor: 'primary.main', bgcolor: '#fff' },
              }}
            >
              {downloading ? 'Preparing…' : 'Download PDF'}
            </Button>
            <Button
              variant="contained"
              onClick={onShare}
              startIcon={<WhatsAppIcon />}
              sx={{
                px: 2,
                py: 1,
                background: 'linear-gradient(180deg, #16a06e 0%, #0F7657 100%)',
                boxShadow: '0 4px 12px rgba(15,118,87,.3)',
              }}
            >
              Share on WhatsApp
            </Button>
          </Box>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(260px, 340px) minmax(0, 1fr)' },
          gap: { xs: 2, md: 4 },
          alignItems: 'center',
          mt: 2,
        }}
      >
        <BmiGauge bmi={result.bmi} category={result.category} />
        <Box sx={{ borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' }, pl: { md: 3 }, py: 1 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 500 }}>Healthy BMI range</Typography>
          <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, color: 'primary.main', mt: 0.5, mb: 2.5 }}>
            {HEALTHY_BMI.min} – {HEALTHY_BMI.max}
          </Typography>
          <BmiRangeBar bmi={result.bmi} category={result.category} />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          bgcolor: '#fff',
          borderRadius: '15px',
          px: { xs: 2, md: 2.5 },
          py: 1.5,
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          columnGap: 2,
          '& > *:not(:last-child)': { borderRight: { lg: '1px solid' }, borderColor: { lg: 'divider' } },
          boxShadow: '0 2px 10px rgba(16,64,44,.04)',
        }}
      >
        <Stat
          icon={<MonitorWeightIcon />}
          iconBg="#E3F2EA"
          iconColor="#0F7657"
          label="Estimated healthy weight range"
          value={weightRange}
          testId="healthy-weight"
        />
        <Stat
          icon={<LocalFireDepartmentIcon />}
          iconBg="#FFF1E3"
          iconColor="#F97316"
          label="BMR"
          value={result.bmrKcal ? `${result.bmrKcal} kcal/day` : '—'}
          caption={result.bmrKcal ? 'Estimated daily needs' : 'Add age & gender'}
          testId="bmr"
        />
        <Stat
          icon={<WaterDropIcon />}
          iconBg="#E5F1FD"
          iconColor="#3B82F6"
          label="Hydration target"
          value={`${result.hydrationLiters} L/day`}
          caption="Water recommendation"
          testId="hydration"
        />
        <Stat
          icon={<MonitorHeartIcon />}
          iconBg="#FDE8EA"
          iconColor="#EF4444"
          label="Category"
          value={info.label}
          caption={`BMI ${info.rangeLabel}`}
        />
      </Box>
    </Paper>
  );
}
