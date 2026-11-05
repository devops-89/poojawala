'use client';

import React from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PreviewDialogProps {
  previewFile?: File | null;
  previewTarget?: File | string | null;
  setPreviewFile?: (file: File | null) => void;
  setPreviewTarget?: (target: File | string | null) => void;
}

export default function DocumentPreviewDialog({
  previewFile,
  previewTarget,
  setPreviewFile,
  setPreviewTarget,
}: PreviewDialogProps) {
  const activeItem = previewTarget !== undefined ? previewTarget : previewFile;
  if (!activeItem) return null;

  const isStringUrl = typeof activeItem === 'string';
  const isImage = isStringUrl
    ? !activeItem.toLowerCase().includes('.pdf')
    : activeItem.type.startsWith('image/');

  const targetUrl = isStringUrl
    ? activeItem
    : URL.createObjectURL(activeItem);

  const handleClose = () => {
    if (setPreviewTarget) setPreviewTarget(null);
    if (setPreviewFile) setPreviewFile(null);
  };

  return (
    <Dialog
      open={Boolean(activeItem)}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.6)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        {isImage ? (
          <img
            src={targetUrl}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '12px',
              backgroundColor: '#fff',
            }}
          />
        ) : (
          <Box sx={{ width: '100%', position: 'relative' }}>
            <iframe
              src={targetUrl}
              style={{
                width: '100%',
                height: '85vh',
                minWidth: '60vw',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: 'white',
              }}
              title="Document Preview"
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
