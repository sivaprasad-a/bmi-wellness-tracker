'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import HeroArt from './HeroArt';
import { useInstallPrompt } from './useInstallPrompt';

export default function Hero() {
  const { canInstall, install } = useInstallPrompt();

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderBottomLeftRadius: { md: 32 },
        borderBottomRightRadius: { md: 32 },
        background: 'linear-gradient(120deg, #eef6f2 0%, #f4f8f6 45%, #f3efe6 100%)',
        pb: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: { xs: '100%', md: '52%' },
          opacity: { xs: 0.25, md: 1 },
          pointerEvents: 'none',
        }}
      >
        <HeroArt />
      </Box>
      <Box sx={{ position: 'relative', maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: 'primary.main',
              color: '#fff',
              px: 2,
              py: 0.6,
              borderRadius: 99,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            BMI &amp; Wellness Tracker
          </Box>
          {canInstall && (
            <Button size="small" variant="outlined" startIcon={<InstallMobileIcon />} onClick={install} sx={{ bgcolor: '#fff' }}>
              Install app
            </Button>
          )}
        </Box>
        <Typography variant="h1" sx={{ fontSize: { xs: 34, sm: 44, md: 48 }, mt: 2.5, mb: 1.5 }}>
          Your Health, Made Simple
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 19 }, color: 'text.primary', maxWidth: 680, lineHeight: 1.45 }}>
          Calculate your BMI and get personalized nutrition and activity suggestions to reach your goals.
        </Typography>
      </Box>
    </Box>
  );
}
