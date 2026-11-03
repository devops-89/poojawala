'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import CheckIcon from '@mui/icons-material/Check';
import VideocamIcon from '@mui/icons-material/Videocam';
import {
  Box,
  Card,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useEffect, useMemo } from 'react';

interface AddBookingServiceSectionProps {
  allServices: any[];
  values: any;
  setFieldValue: any;
}

const formatFeatureKey = (key: string) => {
  if (key.includes(' ')) {
    return key
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const getPlanFeaturesList = (
  planKey: string,
  planData: any,
  isOnline: boolean,
  serviceFeatures?: any[]
) => {
  const extracted: { label: string; value?: string }[] = [];

  if (Array.isArray(planData?.features)) {
    planData.features.forEach((f: any) => {
      if (f && f.isActive !== false && f.type !== 'PRICE') {
        const title = f.title || f.name || f.key || '';
        if (title) {
          extracted.push({
            label: formatFeatureKey(title),
            value: f.value && f.value !== 'true' ? String(f.value) : undefined,
          });
        }
      }
    });
  } else if (planData?.features && typeof planData.features === 'object') {
    Object.entries(planData.features).forEach(([key, val]) => {
      const lower = key.toLowerCase();
      if (
        lower === 'price' ||
        lower === 'tokenamount' ||
        lower.includes('payout') ||
        lower === 'features' ||
        val === false ||
        val === 'false' ||
        val === null ||
        val === undefined
      ) {
        return;
      }
      if (typeof val === 'object') return;
      extracted.push({
        label: formatFeatureKey(key),
        value: val === true || val === 'true' ? undefined : String(val),
      });
    });
  }

  // Fallback to serviceFeatures if present
  if (extracted.length === 0 && Array.isArray(serviceFeatures)) {
    serviceFeatures
      .filter(
        (sf: any) =>
          !sf.plan || sf.plan.toUpperCase() === planKey.toUpperCase()
      )
      .forEach((sf: any) => {
        const title = sf.title || sf.name || '';
        if (title) extracted.push({ label: formatFeatureKey(title) });
      });
  }

  // If still empty, provide rich descriptive items tailored for online vs offline
  if (extracted.length === 0) {
    if (isOnline) {
      return [
        { label: 'Live 1-on-1 Interactive Video Pooja with Vedic Purohit' },
        { label: 'Personalized Sankalp with Family Names & Gotra' },
        { label: 'Authentic Vedic Mantra Chanting, Stotram & Aarti' },
        { label: 'Digital Video Recording & E-Prasad Blessings Included' },
      ];
    }
    if (planKey.toLowerCase() === 'standard') {
      return [
        { label: 'Senior Certified Vedic Scholar / Purohit at Venue' },
        { label: 'All Essential Puja Samagri & Havan Setup Included' },
        { label: 'Complete Extended Rituals, Havan & Aarti Vidhi' },
        { label: 'Sacred Prasad & Divine Blessings for Family' },
      ];
    }
    return [
      { label: 'Certified Vedic Purohit Visit at Your Location' },
      { label: 'Complete Sankalp & Sacred Puja Vidhi' },
      { label: 'Traditional Vedic Mantra Chanting & Aarti' },
      { label: 'Purohit Guides Samagri Arrangement' },
    ];
  }

  return extracted;
};

export default function AddBookingServiceSection({
  allServices,
  values,
  setFieldValue,
}: AddBookingServiceSectionProps) {
  const selectedService = allServices.find(
    (s) => s.id === Number(values.serviceId)
  );

  const isOnlineMode =
    values.bookingMode === 'ONLINE' || Boolean(selectedService?.isOnline);

  const plansObj = selectedService?.plans || {};
  const planKeys = useMemo(
    () =>
      Object.keys(plansObj).filter(
        (key) => plansObj[key] && typeof plansObj[key] === 'object'
      ),
    [plansObj]
  );

  // When online, lock plan to 'basic'
  useEffect(() => {
    if (isOnlineMode && values.plan !== 'basic') {
      setFieldValue('plan', 'basic');
    }
  }, [isOnlineMode, values.plan, setFieldValue]);

  if (!selectedService) return null;

  const imageSrc =
    selectedService?.iconDownloadurl ||
    selectedService?.iconUrl ||
    selectedService?.coverImage;

  // Selected plan price or fallback
  const currentPlanKey = isOnlineMode ? 'basic' : values.plan || planKeys[0] || 'basic';
  const currentPlanObj =
    plansObj[currentPlanKey] || plansObj['basic'] || plansObj['standard'] || {};
  const displayPrice =
    currentPlanObj?.price ??
    selectedService?.price ??
    selectedService?.priceWithoutSamagri ??
    selectedService?.minPrice ??
    0;

  // For offline services, ensure both basic and standard are shown if available
  const offlinePlanKeys =
    planKeys.length > 0
      ? (planKeys.includes('basic') || planKeys.includes('standard')
          ? planKeys
          : ['basic', ...planKeys])
      : plansObj.standard
      ? ['basic', 'standard']
      : ['basic'];

  return (
    <Grid size={{ xs: 12 }}>
      {/* Service Summary Card */}
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '1.1rem',
              }}
            >
              {selectedService.name}
            </Typography>
            {isOnlineMode && (
              <Chip
                label="Online"
                size="small"
                icon={<VideocamIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  bgcolor: '#EFF6FF',
                  color: '#1D4ED8',
                  fontWeight: 700,
                  fontSize: '11px',
                  border: '1px solid #BFDBFE',
                  borderRadius: '6px',
                  height: 22,
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
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
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: '#10b981',
              fontSize: '1.3rem',
            }}
          >
            ₹{Number(displayPrice).toLocaleString('en-IN')}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: '#64748b',
              fontSize: '0.85rem',
              mt: 0.5,
            }}
          >
            {selectedService.durationMinutes || currentPlanObj?.durationMinutes || 60} mins
          </Typography>
        </Box>
      </Card>

      {/* Package Plan Section Header */}
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 1.5,
          color: '#1e293b',
        }}
      >
        {isOnlineMode ? 'Online Package' : 'Select Package Plan'}
      </Typography>

      {/* ONLINE MODE: Single well-presented Online Package Card */}
      {isOnlineMode ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8, md: 7 }}>
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                border: '2px solid #FF6200',
                bgcolor: '#FFF8F5',
                boxShadow: '0 4px 14px rgba(255, 98, 0, 0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Top Header: Title & Badges + Price */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1.5,
                  gap: 1.5,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        color: COLORS.PRIMARY,
                      }}
                    >
                      Online Pooja Package
                    </Typography>
                    <Chip
                      icon={<VideocamIcon sx={{ fontSize: '14px !important' }} />}
                      label="Live Video"
                      size="small"
                      sx={{
                        bgcolor: '#EFF6FF',
                        color: '#1D4ED8',
                        fontWeight: 700,
                        fontSize: '11px',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        height: 22,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '12.5px',
                      color: '#64748B',
                    }}
                  >
                    1-on-1 Personalized Live Vedic Pooja & Sankalp via Video Call
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    color: '#10b981',
                    lineHeight: 1.2,
                  }}
                >
                  ₹{Number(displayPrice).toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2, borderColor: '#FED7AA' }} />

              {/* Online Features List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {getPlanFeaturesList('basic', plansObj['basic'] || plansObj[planKeys[0]], true, selectedService?.serviceFeatures).map((f, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon sx={{ color: '#059669', fontSize: 14 }} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#334155',
                        fontWeight: 600,
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {f.label}
                      {f.value && (
                        <strong style={{ color: '#0F172A' }}>: {f.value}</strong>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Footer Selected Tag */}
              <Box
                sx={{
                  pt: 1.5,
                  borderTop: '1px dashed #FDBA74',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '11.5px',
                    color: '#8A5D3B',
                    fontFamily: FONTS.OUTFIT,
                    fontStyle: 'italic',
                  }}
                >
                  * Includes complete live vidhi & video meeting link
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.OUTFIT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  ✓ SELECTED
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      ) : (
        /* OFFLINE MODE: Render both plans (or all offlinePlanKeys) */
        <Grid container spacing={2}>
          {offlinePlanKeys.map((planKey) => {
            const planData = plansObj[planKey] || {};
            const isSelected = (values.plan || 'basic').toLowerCase() === planKey.toLowerCase();
            const price =
              planData?.price ||
              (planKey === 'basic' ? selectedService?.price : 0) ||
              0;
            const features = getPlanFeaturesList(
              planKey,
              planData,
              false,
              selectedService?.serviceFeatures
            );
            const planTitle =
              planKey.toLowerCase() === 'basic'
                ? 'Basic Plan'
                : planKey.toLowerCase() === 'standard'
                ? 'Standard Plan'
                : `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`;

            return (
              <Grid size={{ xs: 12, sm: 6 }} key={planKey}>
                <Card
                  onClick={() => setFieldValue('plan', planKey.toLowerCase())}
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
                    '&:hover': { borderColor: COLORS.PRIMARY },
                  }}
                >
                  <Box>
                    {/* Header: Plan Title & Price */}
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
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          color: isSelected ? COLORS.PRIMARY : '#1e293b',
                        }}
                      >
                        {planTitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
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
                      {features.map((f, idx) => (
                        <Box
                          key={idx}
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
                              fontFamily: FONTS.OUTFIT,
                            }}
                          >
                            {f.label}
                            {f.value && (
                              <strong style={{ color: '#0F172A' }}>: {f.value}</strong>
                            )}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Footer Selected Tag */}
                  <Box sx={{ mt: 2.5, textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isSelected ? COLORS.PRIMARY : '#94a3b8',
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
      )}
    </Grid>
  );
}
