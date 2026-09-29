'use client';

import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Card,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

interface AddBookingServiceSectionProps {
  allServices: any[];
  values: any;
  setFieldValue: any;
}

export default function AddBookingServiceSection({
  allServices,
  values,
  setFieldValue,
}: AddBookingServiceSectionProps) {
  const selectedService = allServices.find(
    (s) => s.id === Number(values.serviceId)
  );

  if (!selectedService) return null;

  const imageSrc =
    selectedService?.iconDownloadurl ||
    selectedService?.iconUrl ||
    selectedService?.coverImage;

  const plansObj = selectedService?.plans || {};
  const planKeys = Object.keys(plansObj).filter(
    (key) => plansObj[key] && typeof plansObj[key] === 'object'
  );

  // Selected plan price or fallback
  const currentPlanKey = values.plan || planKeys[0] || 'basic';
  const currentPlanObj = plansObj[currentPlanKey] || plansObj['basic'] || plansObj['standard'] || {};
  const displayPrice =
    currentPlanObj?.price ??
    selectedService?.price ??
    selectedService?.priceWithoutSamagri ??
    selectedService?.minPrice ??
    0;

  return (
    <Grid size={{ xs: 12 }}>
      {/* Service Summary Card */}
      <Typography
        sx={{
          fontFamily: 'var(--font-outfit), sans-serif',
          fontWeight: 700,
          mb: 1,
          color: '#1e293b',
        }}
      >
        Service Details
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          p: 2,
          gap: 2,
          mb: 3,
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src =
                'https://via.placeholder.com/80?text=No+Image';
            }}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '8px',
              bgcolor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#94a3b8', fontSize: '12px' }}>
              No Image
            </Typography>
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '1.1rem',
            }}
          >
            {selectedService.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), sans-serif',
              color: '#64748b',
              fontSize: '0.9rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {selectedService.description || 'No description available.'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), sans-serif',
              fontWeight: 800,
              color: '#10b981',
              fontSize: '1.3rem',
            }}
          >
            ₹{Number(displayPrice).toLocaleString('en-IN')}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), sans-serif',
              color: '#64748b',
              fontSize: '0.85rem',
              mt: 0.5,
            }}
          >
            {selectedService.durationMinutes || currentPlanObj?.durationMinutes || 60} mins
          </Typography>
        </Box>
      </Card>

      {/* Select Package Plan Section */}
      <Typography
        sx={{
          fontFamily: 'var(--font-outfit), sans-serif',
          fontWeight: 700,
          mb: 1.5,
          color: '#1e293b',
        }}
      >
        Select Package Plan
      </Typography>

      {planKeys.length > 0 ? (
        <Grid container spacing={2}>
          {planKeys.map((planKey) => {
            const planData = plansObj[planKey];
            const isSelected = (values.plan || planKeys[0]) === planKey;
            const price = planData?.price || 0;

            return (
              <Grid size={{ xs: 12, sm: 6 }} key={planKey}>
                <Card
                  onClick={() => setFieldValue('plan', planKey)}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    border: isSelected
                      ? '2px solid #FF6200'
                      : '1px solid #e2e8f0',
                    bgcolor: isSelected ? '#FFF8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': { borderColor: '#FF6200' },
                  }}
                >
                  <Box>
                    {/* Header: Plan Title (Left) & Price (Right Corner) */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-outfit), sans-serif',
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          color: isSelected ? '#FF6200' : '#1e293b',
                          textTransform: 'uppercase',
                        }}
                      >
                        {planKey} Plan
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-outfit), sans-serif',
                          fontWeight: 800,
                          fontSize: '1.25rem',
                          color: '#10b981',
                        }}
                      >
                        ₹{Number(price).toLocaleString('en-IN')}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2, opacity: 0.6 }} />

                    {/* Features List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      {Object.entries(planData || {}).map(([key, val]) => {
                        if (
                          key === 'price' ||
                          key === 'tokenAmount' ||
                          val === false ||
                          val === 'false' ||
                          val === null ||
                          val === undefined
                        )
                          return null;

                        const isBoolTrue = val === true || val === 'true';
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase());

                        if (isBoolTrue) {
                          return (
                            <Box
                              key={key}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <CheckIcon
                                sx={{ color: '#10b981', fontSize: 18 }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '13px',
                                  color: '#334155',
                                  fontWeight: 600,
                                  fontFamily: 'var(--font-outfit), sans-serif',
                                }}
                              >
                                {label}
                              </Typography>
                            </Box>
                          );
                        }

                        return (
                          <Box
                            key={key}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <CheckIcon
                              sx={{ color: '#10b981', fontSize: 18 }}
                            />
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#475569',
                                fontFamily: 'var(--font-outfit), sans-serif',
                              }}
                            >
                              <span style={{ color: '#64748b' }}>
                                {label}:
                              </span>{' '}
                              <strong style={{ color: '#0f172a' }}>
                                {String(val)}
                              </strong>
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Footer Selected Tag */}
                  <Box sx={{ mt: 2.5, textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isSelected ? '#FF6200' : '#94a3b8',
                      }}
                    >
                      {isSelected ? '✓ SELECTED' : 'SELECT THIS PLAN'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Card
          elevation={0}
          sx={{
            p: 2,
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            bgcolor: '#f8fafc',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              color: '#64748b',
              fontFamily: 'var(--font-outfit), sans-serif',
            }}
          >
            Basic Plan selected by default.
          </Typography>
        </Card>
      )}
    </Grid>
  );
}
