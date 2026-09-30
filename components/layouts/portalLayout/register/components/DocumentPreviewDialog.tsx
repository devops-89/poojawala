'use client';

import React from 'react';
import { Box, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PreviewDialogProps {
  previewFile: File | null;
  setPreviewFile: (file: File | null) => void;
}

export default function DocumentPreviewDialog({
  previewFile,
  setPreviewFile,
}: PreviewDialogProps) {
  return (
    <Dialog
      open={!!previewFile}
      onClose={() => setPreviewFile(null)}
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
          onClick={() => setPreviewFile(null)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.6)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
          }}
        >
          <CloseIcon />
        </IconButton>
        {previewFile && previewFile.type.startsWith('image/') ? (
          <img
            src={URL.createObjectURL(previewFile)}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
          />
        ) : previewFile ? (
          <Box sx={{ width: '100%', position: 'relative' }}>
            <iframe
              src={URL.createObjectURL(previewFile)}
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
        ) : null}
      </Box>
    </Dialog>
  );
}
