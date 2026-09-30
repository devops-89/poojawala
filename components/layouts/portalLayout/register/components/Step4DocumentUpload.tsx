'use client';

import React from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { FormikProps } from 'formik';
import { documentFields } from '../constants';

interface Step4Props {
  formik: FormikProps<any>;
  setPreviewFile: (file: File | null) => void;
}

export default function Step4DocumentUpload({ formik, setPreviewFile }: Step4Props) {
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

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
              <Paper
                sx={{
                  p: 3,
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
                      top: 8,
                      right: 8,
                      color: '#D32F2F',
                      bgcolor: '#FFEBEE',
                      '&:hover': { bgcolor: '#FFCDD2' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                {file ? (
                  file.type.startsWith('image/') ? (
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #ccc',
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
                  ) : (
                    <CheckCircleIcon
                      sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }}
                    />
                  )
                ) : (
                  <CloudUploadIcon
                    sx={{
                      fontSize: 40,
                      color: error ? 'error.main' : '#FF6200',
                      mb: 1,
                    }}
                  />
                )}

                <Typography
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  {doc.title}
                </Typography>

                <Typography
                  onClick={() => file && setPreviewFile(file)}
                  sx={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    color: file ? '#2196F3' : '#666',
                    fontSize: '12px',
                    mb: 2,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    cursor: file ? 'pointer' : 'default',
                    textDecoration: file ? 'underline' : 'none',
                    '&:hover': { color: file ? '#1976D2' : '#666' },
                  }}
                >
                  {file ? file.name : doc.desc}
                </Typography>

                {!file && (
                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    sx={{
                      background: '#FF6200',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '30px',
                      px: 3,
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#F05A00',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          formik.setFieldValue(
                            `documents.${doc.id}`,
                            event.currentTarget.files[0]
                          );
                        }
                      }}
                    />
                  </Button>
                )}

                {error && (
                  <Typography color="error" sx={{ fontSize: '12px', mt: 1 }}>
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
