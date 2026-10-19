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
  FormHelperText,
  IconButton,
  Chip,
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
  { value: 'GENERAL_QUERY', label: 'General Query' },
  { value: 'SERVICE_NOT_PROVIDED', label: 'Service Not Provided' },
  { value: 'LATE_ARRIVAL', label: 'Late Arrival' },
  { value: 'BEHAVIOR_ISSUE', label: 'Behavior Issue' },
  { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
  { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
  { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
  { value: 'ACCOUNT_ISSUE', label: 'Account Issue' },
  { value: 'OTHER', label: 'Other' },
];

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const validateCategory = (val: string): string => {
  if (!val || !val.trim()) return 'Please select a category';
  return '';
};

const validateSubject = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return 'Subject is required';
  if (trimmed.length < 5) return 'Subject must be at least 5 characters long';
  if (trimmed.length > 100) return 'Subject cannot exceed 100 characters';

  // Check for meaningful letters
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letterCount < 3) return 'Subject must contain at least 3 letters';

  // Disallow excessive/random special characters: #, $, %, ^, &, *, ~, `, +, =, <, >, {, }, [, ], |, \
  if (/[#$%^&*~`+=<>{}\[\]|\\]/.test(trimmed)) {
    return 'Special symbols (#, $, %, ^, &, *, etc.) are not allowed in subject';
  }

  // Prevent repeated identical characters e.g. aaaaaa
  if (/(.)\1{4,}/.test(trimmed)) {
    return 'Subject cannot contain repetitive characters';
  }

  return '';
};

const validateDescription = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return 'Description is required';
  if (trimmed.length < 15) return 'Description must be at least 15 characters long';
  if (trimmed.length > 1000) return 'Description cannot exceed 1000 characters';

  // Must contain at least 10 letters
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letterCount < 10) return 'Please describe your issue in meaningful words (at least 10 letters)';

  // Check for repeated special symbols e.g. #$%^&*
  if (/[#$%^&*~`+=<>{}\[\]|\\]{2,}/.test(trimmed)) {
    return 'Please remove excessive special symbols from the description';
  }

  // Prevent repeated identical characters e.g. aaaaaaa
  if (/(.)\1{5,}/.test(trimmed)) {
    return 'Description cannot contain repetitive characters';
  }

  return '';
};

export default function RaiseTicketModal() {
  const { isOpen: open, closeModal: onClose, bookingId, linkedPaymentId, onSuccess } = useTicketModalStore();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState({
    category: false,
    subject: false,
    description: false,
  });

  const [errors, setErrors] = useState({
    category: '',
    subject: '',
    description: '',
  });

  const { showSnackbar } = useSnackbarStore();

  const isLinkedBooking = Boolean(bookingId && bookingId !== 0 && bookingId !== '0' && bookingId !== 'null');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const currentTotal = evidence.length;

    if (currentTotal + files.length > MAX_FILES) {
      setFileError(`You can upload a maximum of ${MAX_FILES} images.`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setFileError('Only image files (JPG, PNG, WebP) are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      validFiles.push(file);
    }

    setFileError('');
    setEvidence((prev) => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setEvidence((prev) => prev.filter((_, i) => i !== index));
    setFileError('');
  };

  const handleModalClose = () => {
    setCategory('');
    setSubject('');
    setDescription('');
    setEvidence([]);
    setFileError('');
    setTouched({
      category: false,
      subject: false,
      description: false,
    });
    setErrors({
      category: '',
      subject: '',
      description: '',
    });
    onClose();
  };

  const handleSubmit = async () => {
    // Mark all as touched
    setTouched({
      category: true,
      subject: true,
      description: true,
    });

    const catErr = validateCategory(category);
    const subjErr = validateSubject(subject);
    const descErr = validateDescription(description);

    setErrors({
      category: catErr,
      subject: subjErr,
      description: descErr,
    });

    if (catErr || subjErr || descErr || fileError) {
      showSnackbar('Please fix the highlighted errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (isLinkedBooking) {
        formData.append('bookingId', String(bookingId));
      }
      formData.append('category', category);
      formData.append('subject', subject.trim());
      formData.append('description', description.trim());
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
        handleModalClose();
        if (onSuccess) onSuccess();
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
    <Dialog 
      open={open} 
      onClose={handleModalClose} 
      fullWidth 
      maxWidth="sm" 
      sx={{ '& .MuiDialog-paper': { borderRadius: '16px', p: 1 } }}
    >
      <DialogTitle sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 800, color: COLORS.SLATE_DARK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Raise a Ticket
        <IconButton onClick={handleModalClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: COLORS.SLATE_MUTED, fontSize: '14px' }}>
            Please provide accurate details about your issue. We will review and get back to you shortly.
          </Typography>

          {/* Category */}
          <FormControl fullWidth variant="outlined" error={Boolean(touched.category && errors.category)}>
            <InputLabel id="category-label" sx={{ fontFamily: FONTS.PRIMARY }}>Category *</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (touched.category) {
                  setErrors((prev) => ({ ...prev, category: validateCategory(e.target.value) }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, category: true }));
                setErrors((prev) => ({ ...prev, category: validateCategory(category) }));
              }}
              label="Category *"
              sx={{
                fontFamily: FONTS.PRIMARY,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.category && errors.category ? '#ef4444' : '#e2e8f0',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.category && errors.category ? '#ef4444 !important' : `${COLORS.BRAND_ORANGE} !important`,
                },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value} sx={{ fontFamily: FONTS.PRIMARY }}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {touched.category && errors.category && (
              <FormHelperText sx={{ color: '#ef4444', fontFamily: FONTS.PRIMARY }}>
                {errors.category}
              </FormHelperText>
            )}
          </FormControl>

          {/* Subject */}
          <TextField
            fullWidth
            label="Subject *"
            placeholder="Briefly state your issue (e.g. Timing delay for morning pooja)"
            variant="outlined"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (touched.subject) {
                setErrors((prev) => ({ ...prev, subject: validateSubject(e.target.value) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, subject: true }));
              setErrors((prev) => ({ ...prev, subject: validateSubject(subject) }));
            }}
            error={Boolean(touched.subject && errors.subject)}
            helperText={
              touched.subject && errors.subject
                ? errors.subject
                : `${subject.length}/100 characters (min 5)`
            }
            slotProps={{
              htmlInput: { maxLength: 100 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY },
              '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY },
              '& .Mui-focused fieldset': {
                borderColor: touched.subject && errors.subject ? '#ef4444 !important' : `${COLORS.BRAND_ORANGE} !important`,
              },
              '& label.Mui-focused': {
                color: touched.subject && errors.subject ? '#ef4444' : COLORS.BRAND_ORANGE,
              },
            }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description *"
            placeholder="Describe the issue clearly in meaningful words (minimum 15 characters)..."
            variant="outlined"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (touched.description) {
                setErrors((prev) => ({ ...prev, description: validateDescription(e.target.value) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, description: true }));
              setErrors((prev) => ({ ...prev, description: validateDescription(description) }));
            }}
            error={Boolean(touched.description && errors.description)}
            helperText={
              touched.description && errors.description
                ? errors.description
                : `${description.length}/1000 characters (min 15)`
            }
            slotProps={{
              htmlInput: { maxLength: 1000 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': { fontFamily: FONTS.PRIMARY },
              '& .MuiInputLabel-root': { fontFamily: FONTS.PRIMARY },
              '& .Mui-focused fieldset': {
                borderColor: touched.description && errors.description ? '#ef4444 !important' : `${COLORS.BRAND_ORANGE} !important`,
              },
              '& label.Mui-focused': {
                color: touched.description && errors.description ? '#ef4444' : COLORS.BRAND_ORANGE,
              },
            }}
          />

          {/* Evidence Attachments */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: COLORS.SLATE_DARK, fontSize: '14px' }}>
                Evidence / Screenshots (Optional)
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Max 3 images (JPG, PNG, WebP up to 5MB each)
              </Typography>
            </Box>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={evidence.length >= MAX_FILES}
              sx={{
                textTransform: 'none',
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                color: evidence.length >= MAX_FILES ? '#94a3b8' : COLORS.SLATE_MUTED,
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
              }}
            >
              {evidence.length >= MAX_FILES ? 'Maximum 3 files reached' : 'Upload Images'}
              <input
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
              />
            </Button>

            {fileError && (
              <Typography sx={{ color: '#ef4444', fontSize: '12px', mt: 1, fontFamily: FONTS.PRIMARY }}>
                {fileError}
              </Typography>
            )}

            {evidence.length > 0 && (
              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {evidence.map((file, idx) => (
                  <Chip
                    key={idx}
                    label={`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`}
                    onDelete={() => handleRemoveFile(idx)}
                    size="small"
                    sx={{
                      bgcolor: '#f1f5f9',
                      color: '#334155',
                      fontSize: '12px',
                      fontFamily: FONTS.PRIMARY,
                      borderRadius: '6px',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={handleModalClose} 
          disabled={isSubmitting}
          sx={{ color: COLORS.SLATE_MUTED, textTransform: 'none', fontWeight: 600, fontFamily: FONTS.PRIMARY }}
        >
          Cancel
        </Button>
        <Box 
          component="button"
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 20px',
            fontSize: '0.875rem',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            backgroundColor: isSubmitting ? '#e2e8f0' : COLORS.BRAND_ORANGE,
            color: isSubmitting ? '#94a3b8' : COLORS.WHITE,
            borderRadius: '8px',
            fontFamily: FONTS.PRIMARY,
            textTransform: 'none',
            fontWeight: 700,
            '&:hover': { backgroundColor: isSubmitting ? '#e2e8f0' : COLORS.PRIMARY_DARK },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
