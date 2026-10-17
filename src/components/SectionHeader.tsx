import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ icon, title, subtitle, action }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          background: 'linear-gradient(135deg, #e3f2ea, #d3eadf)',
          color: 'primary.main',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          '& svg': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" component="h2" sx={{ fontSize: { xs: 21, md: 24 } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: 'text.secondary', fontSize: 15.5, mt: 0.25 }}>{subtitle}</Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
