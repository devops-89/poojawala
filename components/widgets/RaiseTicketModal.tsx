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
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: '18px', sm: '22px' },
          border: '1.5px solid #EFE6D5',
          p: { xs: 0.5, sm: 1 },
          m: { xs: 1.5, sm: 3 },
          maxHeight: 'calc(100% - 32px)',
          bgcolor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: '#2C1810',
          fontSize: { xs: '17px', sm: '19px' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 1, sm: 1.2 },
          px: { xs: 1.8, sm: 2.5 },
          borderBottom: '1px solid #F5ECE3',
        }}
      >
        Raise a Ticket
        <IconButton
          onClick={handleModalClose}
          size="small"
          sx={{
            color: '#7C6A60',
            bgcolor: '#FAF4EE',
            p: 0.6,
            '&:hover': { bgcolor: '#F5ECE3', color: '#2C1810' },
          }}
        >
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: { xs: 1.8, sm: 2.5 }, py: { xs: 1, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 1.8 }, pt: 0.5 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: { xs: '12px', sm: '13px' }, lineHeight: 1.4 }}>
            Tell us what went wrong and our team will resolve it promptly.
          </Typography>

          {/* Category */}
          <FormControl fullWidth size="small" variant="outlined" error={Boolean(touched.category && errors.category)}>
            <InputLabel id="category-label" sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px' }}>Category *</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              size="small"
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
                fontFamily: FONTS.OUTFIT,
                fontSize: '13.5px',
                borderRadius: '12px',
                bgcolor: '#FFFBF7',
                '& .MuiSelect-select': {
                  py: 1,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.category && errors.category ? '#ef4444' : '#EFE6D5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: touched.category && errors.category ? '#ef4444 !important' : `${COLORS.PRIMARY} !important`,
                },
              }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value} sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px' }}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
            {touched.category && errors.category && (
              <FormHelperText sx={{ color: '#ef4444', fontFamily: FONTS.OUTFIT, fontSize: '11px', mt: 0.3 }}>
                {errors.category}
              </FormHelperText>
            )}
          </FormControl>

          {/* Subject */}
          <TextField
            fullWidth
            size="small"
            label="Subject *"
            placeholder="Briefly state your issue (min 5 chars)"
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
                : `${subject.length}/100 characters`
            }
            slotProps={{
              htmlInput: { maxLength: 100 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: FONTS.OUTFIT,
                fontSize: '13.5px',
                borderRadius: '12px',
                bgcolor: '#FFFBF7',
                '& input': { py: 1 },
                '& fieldset': {
                  borderColor: touched.subject && errors.subject ? '#ef4444' : '#EFE6D5',
                },
              },
              '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px' },
              '& .MuiFormHelperText-root': { fontFamily: FONTS.OUTFIT, fontSize: '11px', mt: 0.3 },
              '& .Mui-focused fieldset': {
                borderColor: touched.subject && errors.subject ? '#ef4444 !important' : `${COLORS.PRIMARY} !important`,
              },
              '& label.Mui-focused': {
                color: touched.subject && errors.subject ? '#ef4444' : COLORS.PRIMARY,
              },
            }}
          />

          {/* Description */}
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2.5}
            label="Description *"
            placeholder="Describe the issue clearly (minimum 15 characters)..."
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
                : `${description.length}/1000 characters`
            }
            slotProps={{
              htmlInput: { maxLength: 1000 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: FONTS.OUTFIT,
                fontSize: '13.5px',
                borderRadius: '12px',
                bgcolor: '#FFFBF7',
                '& fieldset': {
                  borderColor: touched.description && errors.description ? '#ef4444' : '#EFE6D5',
                },
              },
              '& .MuiInputLabel-root': { fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px' },
              '& .MuiFormHelperText-root': { fontFamily: FONTS.OUTFIT, fontSize: '11px', mt: 0.3 },
              '& .Mui-focused fieldset': {
                borderColor: touched.description && errors.description ? '#ef4444 !important' : `${COLORS.PRIMARY} !important`,
              },
              '& label.Mui-focused': {
                color: touched.description && errors.description ? '#ef4444' : COLORS.PRIMARY,
              },
            }}
          />

          {/* Evidence Attachments - Compact Row */}
          <Box
            sx={{
              bgcolor: '#FAF7F4',
              px: 1.5,
              py: 1.2,
              borderRadius: '12px',
              border: '1px solid #EFE6D5',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '12.5px' }}>
                  Evidence / Screenshots
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '11px', display: 'block' }}>
                  Optional • Max 3 images (up to 5MB)
                </Typography>
              </Box>

              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon sx={{ color: COLORS.PRIMARY, fontSize: 16 }} />}
                disabled={evidence.length >= MAX_FILES}
                sx={{
                  flexShrink: 0,
                  textTransform: 'none',
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: '12px',
                  color: evidence.length >= MAX_FILES ? '#94a3b8' : COLORS.PRIMARY,
                  bgcolor: '#FFF0E6',
                  border: '1px solid #FFD4BC',
                  borderRadius: '16px',
                  px: 1.8,
                  py: 0.45,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: COLORS.PRIMARY, bgcolor: '#FFE4D4' },
                }}
              >
                {evidence.length >= MAX_FILES ? 'Max 3' : 'Upload'}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            {fileError && (
              <Typography sx={{ color: '#ef4444', fontSize: '11px', mt: 0.5, fontFamily: FONTS.OUTFIT }}>
                {fileError}
              </Typography>
            )}

            {evidence.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {evidence.map((file, idx) => (
                  <Chip
                    key={idx}
                    label={`${file.name.slice(0, 15)}${file.name.length > 15 ? '...' : ''} (${(file.size / (1024 * 1024)).toFixed(1)}MB)`}
                    onDelete={() => handleRemoveFile(idx)}
                    size="small"
                    sx={{
                      bgcolor: '#FFFFFF',
                      border: '1px solid #EFE6D5',
                      color: '#2C1810',
                      fontSize: '11px',
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      borderRadius: '12px',
                      height: '24px',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions
        sx={{
          px: { xs: 1.8, sm: 2.5 },
          py: { xs: 1.2, sm: 1.5 },
          gap: 1.2,
          borderTop: '1px solid #F5ECE3',
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          '& > button': {
            flex: { xs: 1, sm: 'initial' },
          },
        }}
      >
        <Button 
          onClick={handleModalClose} 
          disabled={isSubmitting}
          sx={{
            color: COLORS.PRIMARY,
            bgcolor: '#FFF0E6',
            border: '1px solid #FFD4BC',
            textTransform: 'none',
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            fontSize: '12.5px',
            borderRadius: '20px',
            px: 2.5,
            py: 0.75,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#FFE4D4',
              borderColor: COLORS.PRIMARY,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit} 
          disabled={isSubmitting}
          variant="contained"
          sx={{
            borderRadius: '20px',
            fontFamily: FONTS.OUTFIT,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '12.5px',
            px: 3,
            py: 0.75,
            boxShadow: 'none',
            bgcolor: isSubmitting ? '#e2e8f0 !important' : `${COLORS.PRIMARY} !important`,
            color: isSubmitting ? '#94a3b8 !important' : '#ffffff !important',
            '&:hover': { bgcolor: '#ea580c !important' },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
