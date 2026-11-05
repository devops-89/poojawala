'use client';

import React, { useState } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import { FormikProps } from 'formik';
import { documentFields } from '../constants';
import { FONTS } from '@/utils/fonts';
import { COLORS, USER_ROLE } from '@/utils/enums';

interface Step4Props {
  formik?: FormikProps<any>;
  setPreviewFile?: (file: File | null) => void;
  setPreviewTarget?: (target: File | string | null) => void;
  hideTitle?: boolean;
  isAdmin?: boolean;
  isAstrologer?: boolean;
  selectedFiles?: {
    identityDoc: File | null;
    certificate: File | null;
    templeAffiliationProof?: File | null;
    profilePhoto: File | null;
  };
  existingUrls?: {
    identityDoc?: string | null;
    certificate?: string | null;
    templeAffiliationProof?: string | null;
    profilePhoto?: string | null;
  };
  onFileChange?: (docId: string, file: File | null) => void;
}

export default function Step4DocumentUpload({
  formik,
  setPreviewFile,
  setPreviewTarget,
  hideTitle = false,
  isAdmin = false,
  isAstrologer,
  selectedFiles,
  existingUrls,
  onFileChange,
}: Step4Props) {
  const [localIdentityDocType, setLocalIdentityDocType] = useState<'aadhaar' | 'pan'>('aadhaar');

  const currentIdentityDocType =
    formik?.values?.identityDocType || localIdentityDocType;

  const handleIdentityDocTypeChange = (type: 'aadhaar' | 'pan') => {
    setLocalIdentityDocType(type);
    if (formik) {
      formik.setFieldValue('identityDocType', type);
    }
  };

  const handleFileInputChange = (
    docId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.currentTarget.files?.[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isImage && !isPdf) {
        if (formik) {
          formik.setFieldError(
            `documents.${docId}`,
            'Only image files (JPG, PNG, WEBP) and PDF documents are allowed'
          );
        }
        return;
      }

      if (onFileChange) {
        onFileChange(docId, selectedFile);
      } else if (formik) {
        formik.setFieldValue(`documents.${docId}`, selectedFile);
        formik.setFieldError(`documents.${docId}`, undefined);
      }
    }
    event.currentTarget.value = '';
  };

  const isAstro =
    isAstrologer ?? (formik?.values?.role === USER_ROLE.ASTROLOGER);

  return (
    <Box>
      {!hideTitle && (
        <Typography
          variant="h5"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            mb: 3,
          }}
        >
          Upload Verification Documents
        </Typography>
      )}

      {!isAdmin &&
        formik?.errors?.documents &&
        typeof formik.errors.documents === 'string' && (
          <Typography color="error" sx={{ mb: 2 }}>
            {formik.errors.documents}
          </Typography>
        )}

      <Grid container spacing={3}>
        {documentFields
          .filter((doc) => (isAstro ? doc.id !== 'templeAffiliationProof' : true))
          .map((doc) => {
            const file = selectedFiles
              ? (selectedFiles as any)[doc.id] as File | null
              : ((formik?.values?.documents as any)?.[doc.id] as File | null);

            const existingUrl = existingUrls
              ? (existingUrls as any)[doc.id] as string | null
              : ((formik?.values as any)?.[`${doc.id}Url`] as string | null);

            const hasContent = Boolean(file || existingUrl);

            const error =
              !isAdmin &&
              formik?.touched?.documents?.[
                doc.id as keyof typeof formik.touched.documents
              ] &&
              (formik?.errors?.documents as any)?.[doc.id];

            const isFilePdf =
              file &&
              (file.type === 'application/pdf' ||
                file.name.toLowerCase().endsWith('.pdf'));
            const isFileImage = file && file.type.startsWith('image/');

            const isUrlPdf =
              !file &&
              Boolean(
                existingUrl &&
                  existingUrl.toLowerCase().split('?')[0].endsWith('.pdf')
              );
            const isUrlImage = !file && Boolean(existingUrl && !isUrlPdf);

            const displaySubtitle = file
              ? file.name
              : existingUrl
              ? 'Uploaded Document'
              : doc.desc || 'Supports Images (JPG, PNG, WEBP) & PDF';

            const handlePreview = () => {
              if (setPreviewTarget) {
                if (file) setPreviewTarget(file);
                else if (existingUrl) setPreviewTarget(existingUrl);
              } else if (setPreviewFile && file) {
                setPreviewFile(file);
              }
            };

            return (
              <Grid size={{ xs: 12, sm: isAstro ? 4 : 6 }} key={doc.id}>
                <Paper
                  sx={{
                    p: 2.5,
                    minHeight: '250px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: error
                      ? 'error.main'
                      : hasContent
                      ? '#4CAF50'
                      : '#FFE0D0',
                    borderRadius: '16px',
                    textAlign: 'center',
                    bgcolor: hasContent ? '#F1F8E9' : '#FFFDF9',
                    transition: 'all 0.3s',
                    position: 'relative',
                    '&:hover': {
                      borderColor: hasContent ? '#4CAF50' : COLORS.PRIMARY,
                      bgcolor: hasContent ? '#E8F5E9' : '#FFF8F4',
                    },
                  }}
                >
                  {hasContent && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (onFileChange) {
                          onFileChange(doc.id, null);
                        } else if (formik) {
                          formik.setFieldValue(`documents.${doc.id}`, null);
                        }
                      }}
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: '#D32F2F',
                        bgcolor: '#FFEBEE',
                        '&:hover': { bgcolor: '#FFCDD2' },
                        zIndex: 2,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}

                  {/* Fixed Height Icon / Preview Box */}
                  <Box
                    sx={{
                      height: '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    {isFileImage ? (
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
                    ) : isUrlImage && existingUrl ? (
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
                          src={existingUrl}
                          alt="preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ) : isFilePdf || isUrlPdf ? (
                      <PictureAsPdfIcon
                        sx={{ fontSize: 44, color: '#D32F2F' }}
                      />
                    ) : hasContent ? (
                      <CheckCircleIcon
                        sx={{ fontSize: 44, color: '#4CAF50' }}
                      />
                    ) : (
                      <CloudUploadIcon
                        sx={{
                          fontSize: 44,
                          color: error ? 'error.main' : COLORS.PRIMARY,
                        }}
                      />
                    )}
                  </Box>

                  {/* Title & Document Type Toggle */}
                  {doc.id === 'identityDoc' ? (
                    <Box
                      sx={{
                        mb: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          bgcolor: '#F1F5F9',
                          p: '3px',
                          borderRadius: '24px',
                          border: '1px solid #E2E8F0',
                          mb: 1,
                        }}
                      >
                        <Button
                          size="small"
                          type="button"
                          onClick={() => handleIdentityDocTypeChange('aadhaar')}
                          sx={{
                            borderRadius: '20px',
                            px: 1.8,
                            py: 0.3,
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            textTransform: 'none',
                            boxShadow: 'none',
                            bgcolor:
                              currentIdentityDocType === 'aadhaar'
                                ? COLORS.PRIMARY
                                : 'transparent',
                            color:
                              currentIdentityDocType === 'aadhaar'
                                ? '#fff'
                                : '#64748B',
                            '&:hover': {
                              bgcolor:
                                currentIdentityDocType === 'aadhaar'
                                  ? COLORS.PRIMARY_DARK
                                  : 'rgba(0,0,0,0.04)',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          Aadhaar Card
                        </Button>
                        <Button
                          size="small"
                          type="button"
                          onClick={() => handleIdentityDocTypeChange('pan')}
                          sx={{
                            borderRadius: '20px',
                            px: 1.8,
                            py: 0.3,
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            textTransform: 'none',
                            boxShadow: 'none',
                            bgcolor:
                              currentIdentityDocType === 'pan'
                                ? COLORS.PRIMARY
                                : 'transparent',
                            color:
                              currentIdentityDocType === 'pan'
                                ? '#fff'
                                : '#64748B',
                            '&:hover': {
                              bgcolor:
                                currentIdentityDocType === 'pan'
                                  ? COLORS.PRIMARY_DARK
                                  : 'rgba(0,0,0,0.04)',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          PAN Card
                        </Button>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          fontSize: '15px',
                          color: COLORS.DARK,
                        }}
                      >
                        {currentIdentityDocType === 'pan'
                          ? isAdmin
                            ? 'PAN Card'
                            : 'PAN Card *'
                          : isAdmin
                          ? 'Aadhaar Card'
                          : 'Aadhaar Card *'}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: '15px',
                        color: COLORS.DARK,
                        mb: 0.5,
                      }}
                    >
                      {isAdmin ? doc.title.replace(/\s*\*+$/, '') : doc.title}
                    </Typography>
                  )}

                  {/* Subtitle / Filename */}
                  <Typography
                    onClick={handlePreview}
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: hasContent ? '#1976D2' : '#777',
                      fontSize: '12px',
                      mb: 1.5,
                      px: 2,
                      width: '100%',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      cursor: hasContent && (setPreviewTarget || setPreviewFile) ? 'pointer' : 'default',
                      textDecoration: hasContent && (setPreviewTarget || setPreviewFile) ? 'underline' : 'none',
                      fontWeight: hasContent ? 600 : 400,
                      '&:hover': {
                        color: hasContent && (setPreviewTarget || setPreviewFile) ? '#1565C0' : '#777',
                      },
                    }}
                  >
                    {displaySubtitle}
                  </Typography>

                  {/* Upload / Change File Button */}
                  <Button
                    component="label"
                    variant={hasContent ? 'outlined' : 'contained'}
                    size="small"
                    sx={{
                      borderColor: hasContent ? '#4CAF50' : COLORS.PRIMARY,
                      color: hasContent ? '#2E7D32' : 'white',
                      background: hasContent ? 'transparent' : COLORS.PRIMARY,
                      textTransform: 'none',
                      borderRadius: '30px',
                      px: 3,
                      fontWeight: 600,
                      fontSize: '13px',
                      boxShadow: 'none',
                      '&:hover': {
                        background: hasContent ? '#E8F5E9' : COLORS.PRIMARY_DARK,
                        borderColor: hasContent ? '#388E3C' : COLORS.PRIMARY_DARK,
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {hasContent ? 'Change File' : 'Select File'}
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      onChange={(event) => handleFileInputChange(doc.id, event)}
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
