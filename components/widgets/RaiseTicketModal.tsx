import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { addComplaintAPI } from '@/api/bookingControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useTicketModalStore } from '@/stores/ticketModalStore';
import { convertImageToWebP } from '@/utils/imageHelper';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';

const CATEGORIES = [
  { value: 'SERVICE_NOT_PROVIDED', label: 'Service Not Provided' },
  { value: 'LATE_ARRIVAL', label: 'Late Arrival' },
  { value: 'BEHAVIOR_ISSUE', label: 'Behavior Issue' },
  { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
  { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
  { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
  { value: 'ACCOUNT_ISSUE', label: 'Account Issue' },
  { value: 'GENERAL_QUERY', label: 'General Query' },
  { value: 'OTHER', label: 'Other' },
];

export default function RaiseTicketModal() {
  const { isOpen: open, closeModal: onClose, bookingId, linkedPaymentId, onSuccess } = useTicketModalStore();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showSnackbar } = useSnackbarStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidence(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!category || !subject || !description) {
      const missing = [];
      if (!category) missing.push('Category');
      if (!subject) missing.push('Subject');
      if (!description) missing.push('Description');
      showSnackbar(`Please fill in required fields: ${missing.join(', ')}`, 'error');
      return;
    }

    if (description.trim().length < 10) {
      showSnackbar('Description must be at least 10 characters long', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('bookingId', String(bookingId));
      formData.append('category', category);
      formData.append('subject', subject);
      formData.append('description', description);
      if (linkedPaymentId) {
        formData.append('linkedPaymentId', String(linkedPaymentId));
      }
      
      for (const file of evidence) {
        const webpFile = await convertImageToWebP(file);
        formData.append('evidence', webpFile);
      }

      const res = await addComplaintAPI(formData);
      if (res.success) {
        showSnackbar('Ticket raised successfully', 'success');
        
        // Reset form
        setCategory('');
        setSubject('');
        setDescription('');
        setEvidence([]);
        
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showSnackbar(res.message || 'Failed to raise ticket', 'error');
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.message || 'Error raising ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}>
      <DialogTitle sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: COLORS.SLATE_DARK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Raise a Ticket
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, fontSize: '14px' }}>
            Please provide details about your issue. We will get back to you shortly.
          </Typography>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-label" sx={{ fontFamily: FONTS.PRIMARY }}>Category *</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category *"
              sx={{
                fontFamily: FONTS.PRIMARY,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: `${COLORS.BRAND_ORANGE} !important` },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value} sx={{ fontFamily: FONTS.PRIMARY }}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Subject *"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY },
              '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY },
              '& .Mui-focused fieldset': { borderColor: `${COLORS.BRAND_ORANGE} !important` },
              '& label.Mui-focused': { color: COLORS.BRAND_ORANGE }
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description *"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY },
              '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY },
              '& .Mui-focused fieldset': { borderColor: `${COLORS.BRAND_ORANGE} !important` },
              '& label.Mui-focused': { color: COLORS.BRAND_ORANGE }
            }}
          />

          <Box>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: COLORS.SLATE_DARK, mb: 1, fontSize: '14px' }}>
              Evidence / Screenshots (Optional)
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                textTransform: 'none',
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                color: COLORS.SLATE_MUTED,
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
              }}
            >
              Upload Files
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {evidence.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evidence.map((file, idx) => (
                  <Typography key={idx} sx={{ fontSize: '12px', color: COLORS.SLATE_DARK, bgcolor: '#f1f5f9', px: 1, py: 0.5, borderRadius: '4px' }}>
                    {file.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: COLORS.SLATE_MUTED, textTransform: 'none', fontWeight: 600, fontFamily: FONTS.PRIMARY }}>
          Cancel
        </Button>
        <Box 
          component="button"
          onClick={handleSubmit} 
          disabled={isSubmitting || !category || !subject || !description} 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 16px',
            fontSize: '0.875rem',
            border: 'none',
            cursor: (isSubmitting || !category || !subject || !description) ? 'default' : 'pointer',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            backgroundColor: (isSubmitting || !category || !subject || !description) ? '#e2e8f0' : COLORS.BRAND_ORANGE,
            color: (isSubmitting || !category || !subject || !description) ? '#94a3b8' : COLORS.WHITE,
            borderRadius: '8px',
            fontFamily: FONTS.PRIMARY,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: (isSubmitting || !category || !subject || !description) ? '#e2e8f0' : COLORS.PRIMARY_DARK }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
