'use client';
import { createTheme } from '@mui/material/styles';

export const BRAND = {
  main: '#0F7657',
  dark: '#0B5E45',
  light: '#E8F5EF',
  bg: '#F3F7F5',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: BRAND.main, dark: BRAND.dark, light: '#3FA37F', contrastText: '#fff' },
    background: { default: BRAND.bg, paper: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#4B5563' },
    divider: '#E5E7EB',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-inter), "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 20 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10, backgroundColor: '#fff' },
      },
    },
  },
});

export default theme;
