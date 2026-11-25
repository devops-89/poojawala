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
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          borderRadius: { xs: '18px', md: '24px' },
          border: '1.5px solid #EFE6D5',
          boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
          bgcolor: '#FFFFFF',
          height: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={astro?.profileImage || undefined}
            alt={astroName}
            sx={{ width: 56, height: 56, bgcolor: COLORS.PRIMARY, fontSize: '20px', fontWeight: 700 }}
          >
            {astroName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '18px' }}>
              Astrologer Details
            </Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px' }}>
              Verified Astrologer Consultant
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Astrologer</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>
              {astroName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Phone</Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
              {astro?.phone || 'N/A'}
            </Typography>
          </Box>
          {Boolean(specializationsText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Specializations</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
                {specializationsText}
              </Typography>
            </Box>
          )}
          {profile?.experienceYears !== undefined && profile?.experienceYears !== null && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Experience</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
                {profile.experienceYears} Years
              </Typography>
            </Box>
          )}
          {Boolean(languagesText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Languages</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
                {languagesText}
              </Typography>
            </Box>
          )}
          {Boolean(qualificationText) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Qualification</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
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
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 },
        borderRadius: { xs: '18px', md: '24px' },
        border: '1.5px solid #EFE6D5',
        boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)',
        bgcolor: '#FFFFFF',
        height: '100%',
      }}
    >
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
          <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '18px' }}>
            Purohit Details
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '13px' }}>
            {isAssigned ? 'Verified Vedic Purohit' : 'Assignment in progress'}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Purohit</Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>
            {purohitName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isAssigned ? '1px solid #F5ECE3' : 'none', pb: isAssigned ? 2 : 0 }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Phone</Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
            {purohitPhone}
          </Typography>
        </Box>

        {isAssigned && (
          <>
            {experienceYears !== undefined && experienceYears !== null && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Experience</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
                  {experienceYears} {Number(experienceYears) === 1 ? 'Year' : 'Years'}
                </Typography>
              </Box>
            )}

            {Boolean(specializationsText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F5ECE3', pb: 2 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px', minWidth: '110px' }}>Specializations</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
                  {specializationsText}
                </Typography>
              </Box>
            )}

            {Boolean(languagesText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: Boolean(qualificationText) || Boolean(locationText) ? '1px solid #F5ECE3' : 'none', pb: Boolean(qualificationText) || Boolean(locationText) ? 2 : 0 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px', minWidth: '110px' }}>Languages</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
                  {languagesText}
                </Typography>
              </Box>
            )}

            {Boolean(qualificationText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: Boolean(locationText) ? '1px solid #F5ECE3' : 'none', pb: Boolean(locationText) ? 2 : 0 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px', minWidth: '110px' }}>Qualification</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px', textAlign: 'right' }}>
                  {qualificationText}
                </Typography>
              </Box>
            )}

            {Boolean(locationText) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#7C6A60', fontSize: '14px' }}>Location</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: '#2C1810', fontSize: '14px' }}>
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
