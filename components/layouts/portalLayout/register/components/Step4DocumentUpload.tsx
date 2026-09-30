'use client';

import React from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import { FormikProps } from 'formik';
import { documentFields } from '../constants';

interface Step4Props {
  formik: FormikProps<any>;
  setPreviewFile: (file: File | null) => void;
}

export default function Step4DocumentUpload({ formik, setPreviewFile }: Step4Props) {
  const handleFileChange = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isImage && !isPdf) {
        formik.setFieldError(
          `documents.${docId}`,
          'Only image files (JPG, PNG, WEBP) and PDF documents are allowed'
        );
        return;
      }

      formik.setFieldValue(`documents.${docId}`, selectedFile);
      formik.setFieldError(`documents.${docId}`, undefined);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'var(--font-outfit), sans-serif',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Upload Verification Documents
      </Typography>

      {formik.errors.documents &&
        typeof formik.errors.documents === 'string' && (
          <Typography color="error" sx={{ mb: 2 }}>
            {formik.errors.documents}
          </Typography>
        )}

      <Grid container spacing={3}>
        {documentFields.map((doc) => {
          const file = (formik.values.documents as any)[doc.id] as File | null;
          const error =
            formik.touched.documents?.[
              doc.id as keyof typeof formik.touched.documents
            ] && (formik.errors.documents as any)?.[doc.id];

          const isPdf =
            file &&
            (file.type === 'application/pdf' ||
              file.name.toLowerCase().endsWith('.pdf'));

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '230px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: error
                    ? 'error.main'
                    : file
                    ? '#4CAF50'
                    : '#FFE0D0',
                  borderRadius: '16px',
                  textAlign: 'center',
                  bgcolor: file ? '#F1F8E9' : '#FFFDF9',
                  transition: 'all 0.3s',
                  position: 'relative',
                  '&:hover': {
                    borderColor: file ? '#4CAF50' : '#FF6200',
                    bgcolor: file ? '#E8F5E9' : '#FFF8F4',
                  },
                }}
              >
                {file && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      formik.setFieldValue(`documents.${doc.id}`, null)
                    }
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: '#D32F2F',
                      bgcolor: '#FFEBEE',
                      '&:hover': { bgcolor: '#FFCDD2' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Fixed Height Icon Box */}
                <Box
                  sx={{
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  {file ? (
                    file.type.startsWith('image/') ? (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #C8E6C9',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ) : isPdf ? (
                      <PictureAsPdfIcon
                        sx={{ fontSize: 44, color: '#D32F2F' }}
                      />
                    ) : (
                      <CheckCircleIcon
                        sx={{ fontSize: 44, color: '#4CAF50' }}
                      />
                    )
                  ) : (
                    <CloudUploadIcon
                      sx={{
                        fontSize: 44,
                        color: error ? 'error.main' : '#FF6200',
                      }}
                    />
                  )}
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#1A1A1A',
                    mb: 0.5,
                  }}
                >
                  {doc.title}
                </Typography>

                {/* Subtitle / Filename */}
                <Typography
                  onClick={() => file && setPreviewFile(file)}
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    color: file ? '#1976D2' : '#777',
                    fontSize: '12px',
                    mb: 1.5,
                    px: 2,
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    cursor: file ? 'pointer' : 'default',
                    textDecoration: file ? 'underline' : 'none',
                    fontWeight: file ? 600 : 400,
                    '&:hover': { color: file ? '#1565C0' : '#777' },
                  }}
                >
                  {file
                    ? file.name
                    : doc.desc || 'Supports Images (JPG, PNG, WEBP) & PDF'}
                </Typography>

                {/* Upload / Change File Button */}
                <Button
                  component="label"
                  variant={file ? 'outlined' : 'contained'}
                  size="small"
                  sx={{
                    borderColor: file ? '#4CAF50' : '#FF6200',
                    color: file ? '#2E7D32' : 'white',
                    background: file ? 'transparent' : '#FF6200',
                    textTransform: 'none',
                    borderRadius: '30px',
                    px: 3,
                    fontWeight: 600,
                    fontSize: '13px',
                    boxShadow: 'none',
                    '&:hover': {
                      background: file ? '#E8F5E9' : '#F05A00',
                      borderColor: file ? '#388E3C' : '#F05A00',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {file ? 'Change File' : 'Select File'}
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(event) => handleFileChange(doc.id, event)}
                  />
                </Button>

                {error && (
                  <Typography
                    color="error"
                    sx={{ fontSize: '11px', mt: 0.8, fontWeight: 500 }}
                  >
                    {error as string}
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
