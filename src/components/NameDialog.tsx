'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { NAME_MAX_LENGTH, normalizeName, validateName } from '@/lib/form';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

/** Asks for the user's name before generating a PDF, so every report is personalised. */
export default function NameDialog({ open, onClose, onConfirm }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = normalizeName(value);
    const err = validateName(name, true);
    setError(err);
    if (!err) onConfirm(name);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: submit, noValidate: true, sx: { borderRadius: '15px' } } as object }}
      aria-labelledby="name-dialog-title"
    >
      <DialogTitle id="name-dialog-title" sx={{ fontWeight: 700 }}>
        Add your name to the report
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Your name will appear on the PDF and in its file name.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Your name"
          autoComplete="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!!error}
          helperText={error}
          slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" startIcon={<DescriptionOutlinedIcon />}>
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
