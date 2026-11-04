import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React from 'react';
import { Box, Typography, Paper, Avatar, Chip } from '@mui/material';

interface Props {
  booking: any;
}

const formatList = (val: any): string => {
  if (!val) return "";
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return item.name || item.title || item.label || JSON.stringify(item);
        }
        return String(item).trim();
      })
      .filter(Boolean)
      .join(", ");
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return "";
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return item.name || item.title || item.label || JSON.stringify(item);
            }
            return String(item).trim();
          })
          .filter(Boolean)
          .join(", ");
      }
    } catch {
      // not JSON string
    }
    return trimmed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
  }
  return String(val);
};

export default function ServiceDetailsCard({ booking }: Props) {
  const isAstrology = booking?.bookingType === 'ASTROLOGY' || Boolean(booking?.astrologer);

  if (isAstrology) {
    const astro = booking?.astrologer;
    const profile = astro?.astrologerProfile || booking?.astrologerProfile;
    const astroName = astro
      ? `${astro.firstName || ''} ${astro.lastName || ''}`.trim()
      : 'Astrologer';

    const specializationsText = formatList(profile?.specializations ?? profile?.specialization);
    const languagesText = formatList(profile?.languages ?? profile?.language);
    const qualificationText = formatList(profile?.qualification ?? profile?.qualifications);

    return (
      <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={astro?.profileImage || undefined}
            alt={astroName}
            sx={{ width: 56, height: 56, bgcolor: COLORS.PRIMARY, fontSize: '20px', fontWeight: 700 }}
          >
            {astroName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a' }}>
              Astrologer Details
            </Typography>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
              Verified Astrologer Consultant
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Astrologer</Typography>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
              {astroName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Phone</Typography>
            <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
              {astro?.phone || 'N/A'}
            </Typography>
          </Box>
          {Boolean(specializationsText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Specializations</Typography>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                {specializationsText}
              </Typography>
            </Box>
          )}
          {profile?.experienceYears !== undefined && profile?.experienceYears !== null && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Experience</Typography>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                {profile.experienceYears} Years
              </Typography>
            </Box>
          )}
          {Boolean(languagesText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Languages</Typography>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                {languagesText}
              </Typography>
            </Box>
          )}
          {Boolean(qualificationText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Qualification</Typography>
              <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                {qualificationText}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  // Pooja Bookings
  const purohit = booking?.purohit;
  const purohitUser = purohit?.user || purohit;
  const isAssigned = Boolean(purohitUser && (purohitUser.firstName || purohitUser.id));
  const purohitName = isAssigned
    ? `${purohitUser.firstName || ''} ${purohitUser.lastName || ''}`.trim() || `Purohit #${purohit?.id || ''}`
    : 'Not assigned';
  const purohitPhone = purohitUser?.phone || 'N/A';

  const specializationsText = formatList(
    purohit?.specializations ?? purohit?.specialization ?? purohit?.profile?.specializations
  );
  const languagesText = formatList(
    purohit?.languages ?? purohit?.language ?? purohit?.profile?.languages
  );
  const qualificationText = formatList(
    purohit?.qualification ?? purohit?.qualifications ?? purohit?.profile?.qualification
  );
  const experienceYears = purohit?.experienceYears ?? purohit?.profile?.experienceYears;
  const city = purohit?.city || purohit?.profile?.city;
  const state = purohit?.state || purohit?.profile?.state;
  const locationText = [city, state].filter(Boolean).join(', ');

  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        {isAssigned && (
          <Avatar
            src={purohitUser?.profileImage || undefined}
            alt={purohitName}
            sx={{ width: 56, height: 56, bgcolor: COLORS.PRIMARY, fontSize: '20px', fontWeight: 700 }}
          >
            {purohitName.charAt(0)}
          </Avatar>
        )}
        <Box>
          <Typography variant="h6" sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700, color: '#0f172a' }}>
            Purohit Details
          </Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '13px' }}>
            {isAssigned ? 'Verified Vedic Purohit' : 'Assignment in progress'}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Purohit</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {purohitName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isAssigned ? '1px solid #f1f5f9' : 'none', pb: isAssigned ? 2 : 0 }}>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Phone</Typography>
          <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
            {purohitPhone}
          </Typography>
        </Box>

        {isAssigned && (
          <>
            {experienceYears !== undefined && experienceYears !== null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Experience</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                  {experienceYears} {Number(experienceYears) === 1 ? 'Year' : 'Years'}
                </Typography>
              </Box>
            )}

            {Boolean(specializationsText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', pb: 2 }}>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', minWidth: '110px' }}>Specializations</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px', textAlign: 'right' }}>
                  {specializationsText}
                </Typography>
              </Box>
            )}

            {Boolean(languagesText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: Boolean(qualificationText) || Boolean(locationText) ? '1px solid #f1f5f9' : 'none', pb: Boolean(qualificationText) || Boolean(locationText) ? 2 : 0 }}>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', minWidth: '110px' }}>Languages</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px', textAlign: 'right' }}>
                  {languagesText}
                </Typography>
              </Box>
            )}

            {Boolean(qualificationText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: Boolean(locationText) ? '1px solid #f1f5f9' : 'none', pb: Boolean(locationText) ? 2 : 0 }}>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px', minWidth: '110px' }}>Qualification</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px', textAlign: 'right' }}>
                  {qualificationText}
                </Typography>
              </Box>
            )}

            {Boolean(locationText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, color: '#64748b', fontSize: '14px' }}>Location</Typography>
                <Typography sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                  {locationText}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}
