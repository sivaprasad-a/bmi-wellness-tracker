'use client';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { BmiInput, Gender, UnitSystem } from '@/lib/bmi';
import { NAME_MAX_LENGTH, parseForm, switchUnits, type FormErrors, type FormValues } from '@/lib/form';
import { BRAND } from '@/theme';
import SectionHeader from './SectionHeader';

const unitAdornment = (label: string) => ({
  endAdornment: (
    <InputAdornment
      position="end"
      sx={{
        height: 'auto',
        maxHeight: 'none',
        alignSelf: 'stretch',
        m: 0,
        ml: 1,
        mr: '-14px',
        px: 2.25,
        bgcolor: '#F3F4F6',
        borderLeft: '1px solid',
        borderColor: 'divider',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        color: 'text.secondary',
        '& p': { fontSize: 16 },
      }}
    >
      {label}
    </InputAdornment>
  ),
});

const fieldLabelSx = { fontWeight: 600, fontSize: 15.5, mb: 1, display: 'block' } as const;
const inputSx = {
  '& .MuiOutlinedInput-input': { fontSize: 17, py: 1.75 },
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
} as const;

interface Props {
  initialValues: FormValues;
  /** Name supplied from outside the form (e.g. the PDF name prompt); synced into the field. */
  name?: string;
  onCalculate: (input: BmiInput, units: UnitSystem) => void;
}

export default function DetailsForm({ initialValues, name, onCalculate }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues);

  useEffect(() => {
    if (name !== undefined) setValues((v) => ({ ...v, name }));
  }, [name]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showOptional, setShowOptional] = useState(true);

  const set = (patch: Partial<FormValues>) => setValues((v) => ({ ...v, ...patch }));
  const numericProps = { inputMode: 'decimal' as const };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const { input, errors: errs } = parseForm(values);
    setErrors(errs);
    if (errs.age) setShowOptional(true);
    if (input) onCalculate(input, values.units);
  };

  return (
    <Paper
      component="form"
      noValidate
      onSubmit={submit}
      elevation={0}
      sx={{ p: { xs: 2.5, md: 3.5 }, boxShadow: '0 10px 30px rgba(16, 64, 44, 0.07)', height: '100%' }}
      aria-label="Your details"
    >
      <SectionHeader icon={<PersonIcon />} title="Your details" />
      <Typography sx={{ color: 'text.secondary', mt: 2.5, mb: 3, fontSize: 16, lineHeight: 1.5 }}>
        Enter your information to calculate your BMI and get a tailored wellness plan.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography component="label" htmlFor="name" sx={fieldLabelSx}>
          Name
        </Typography>
        <TextField
          id="name"
          fullWidth
          placeholder="Enter your name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          sx={inputSx}
          slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH, 'aria-label': 'Name' } }}
        />
      </Box>

      <ToggleButtonGroup
        exclusive
        fullWidth
        value={values.units}
        onChange={(_, u: UnitSystem | null) => u && setValues((v) => switchUnits(v, u))}
        aria-label="Unit system"
        sx={{
          bgcolor: '#F1F3F4',
          p: 0.5,
          borderRadius: '15px',
          mb: 3,
          '& .MuiToggleButton-root': {
            border: 0,
            borderRadius: '10px !important',
            textTransform: 'none',
            fontSize: 15,
            fontWeight: 500,
            py: 1.25,
            color: 'text.primary',
          },
          '& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover': {
            bgcolor: BRAND.main,
            color: '#fff',
            boxShadow: '0 2px 6px rgba(15,118,87,.35)',
          },
        }}
      >
        <ToggleButton value="metric">Metric (kg, cm)</ToggleButton>
        <ToggleButton value="imperial">Imperial (lb, ft)</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ mb: 3 }}>
        <Typography component="label" htmlFor={values.units === 'metric' ? 'height-cm' : 'height-ft'} sx={fieldLabelSx}>
          Height
        </Typography>
        {values.units === 'metric' ? (
          <TextField
            id="height-cm"
            fullWidth
            type="number"
            value={values.heightCm}
            onChange={(e) => set({ heightCm: e.target.value })}
            error={!!errors.height}
            helperText={errors.height}
            sx={inputSx}
            slotProps={{ input: unitAdornment('cm'), htmlInput: { ...numericProps, 'aria-label': 'Height in centimeters' } }}
          />
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              id="height-ft"
              fullWidth
              type="number"
              value={values.heightFt}
              onChange={(e) => set({ heightFt: e.target.value })}
              error={!!errors.height}
              helperText={errors.height}
              sx={inputSx}
              slotProps={{ input: unitAdornment('ft'), htmlInput: { inputMode: 'numeric', 'aria-label': 'Height in feet' } }}
            />
            <TextField
              fullWidth
              type="number"
              value={values.heightIn}
              onChange={(e) => set({ heightIn: e.target.value })}
              error={!!errors.height}
              sx={inputSx}
              slotProps={{ input: unitAdornment('in'), htmlInput: { inputMode: 'numeric', 'aria-label': 'Height in inches' } }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography component="label" htmlFor="weight" sx={fieldLabelSx}>
          Weight
        </Typography>
        <TextField
          id="weight"
          fullWidth
          type="number"
          value={values.weight}
          onChange={(e) => set({ weight: e.target.value })}
          error={!!errors.weight}
          helperText={errors.weight}
          sx={inputSx}
          slotProps={{
            input: unitAdornment(values.units === 'metric' ? 'kg' : 'lb'),
            htmlInput: { ...numericProps, 'aria-label': `Weight in ${values.units === 'metric' ? 'kilograms' : 'pounds'}` },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 15.5 }}>
          <strong>Optional details</strong> (for personalized insights)
        </Typography>
        <IconButton
          onClick={() => setShowOptional((s) => !s)}
          aria-label={showOptional ? 'Hide optional details' : 'Show optional details'}
          aria-expanded={showOptional}
          size="small"
        >
          <ExpandLessIcon sx={{ transform: showOptional ? 'none' : 'rotate(180deg)', transition: 'transform .2s' }} />
        </IconButton>
      </Box>

      <Collapse in={showOptional}>
        <Box sx={{ mb: 3, mt: 1.5 }}>
          <Typography component="label" htmlFor="age" sx={fieldLabelSx}>
            Age
          </Typography>
          <TextField
            id="age"
            fullWidth
            type="number"
            value={values.age}
            onChange={(e) => set({ age: e.target.value })}
            error={!!errors.age}
            helperText={errors.age}
            sx={inputSx}
            slotProps={{ input: unitAdornment('years'), htmlInput: { inputMode: 'numeric', 'aria-label': 'Age in years' } }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography component="label" id="gender-label" sx={fieldLabelSx}>
            Gender
          </Typography>
          <TextField
            select
            fullWidth
            value={values.gender}
            onChange={(e) => set({ gender: e.target.value as Gender })}
            sx={inputSx}
            slotProps={{ select: { displayEmpty: true }, htmlInput: { 'aria-labelledby': 'gender-label' } }}
          >
            <MenuItem value="">Prefer not to say</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
      </Collapse>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        startIcon={<CalculateOutlinedIcon />}
        endIcon={<ArrowForwardIcon />}
        sx={{
          mt: 1,
          py: 1.6,
          fontSize: 17,
          background: 'linear-gradient(180deg, #13865f 0%, #0F7657 100%)',
          boxShadow: '0 6px 16px rgba(15,118,87,.3)',
          '&:hover': { background: 'linear-gradient(180deg, #0f7657 0%, #0B5E45 100%)' },
        }}
      >
        Calculate BMI
      </Button>
    </Paper>
  );
}
