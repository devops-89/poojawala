'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Divider, Chip, Breadcrumbs, Button, CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NextLink from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useUserStore } from '@/stores/userStore';
import { getPurohitPayoutRange } from '@/utils/payoutHelper';
import { parseList, cleanItem } from '@/components/layouts/adminLayout/astrologers/EditAstrologerForm';

const checkIsImage = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.startsWith("data:image/") || lowerUrl.startsWith("blob:")) {
    return !lowerUrl.includes("pdf");
  }
  const cleanUrl = lowerUrl.split("?")[0].split("#")[0];
  return /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i.test(cleanUrl);
};

const getPdfUrlWithParams = (url: string) => {
  if (!url) return "";
  if (url.includes("#")) return url;
  return `${url}#toolbar=0&navpanes=0&view=FitH`;
};

export default function PortalProfileDetailsContent() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profile: profileData, fetchProfile } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAstrologer =
    profileData?.role === "ASTROLOGER" ||
    profileData?.user?.role === "ASTROLOGER" ||
    (mounted &&
      (sessionStorage.getItem("role") === "ASTROLOGER" ||
        (() => {
          try {
            return JSON.parse(sessionStorage.getItem("user") || "{}")?.role === "ASTROLOGER";
          } catch (e) {
            return false;
          }
        })()));
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [currentDocUrl, setCurrentDocUrl] = useState('');

  const handleOpenDoc = (url: string) => {
    setCurrentDocUrl(url);
    setDocModalOpen(true);
  };

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="text.secondary">Failed to load profile data.</Typography>
      </Box>
    );
  }

  const { profile, bankAccounts, purohitServices, serviceAreas } = profileData;
  const astroProfile = profileData.astrologerProfile || profileData.profile || profile || {};
  const rawLangs = profile?.languages;
  const languages = parseList(rawLangs);

  const rawSpecs = profile?.specializations || profile?.specialization;
  const specializations = parseList(rawSpecs);

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 1.5, sm: 2.5, md: 4 }, pb: { xs: 4, sm: 6 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: { xs: 2.5, sm: 3.5 } }}>
        <Box>
          <AppBreadcrumbs
            items={[
              {
                label: isAstrologer ? "Astrology Bookings" : "Dashboard",
                href: isAstrologer ? "/partner/astrologybookings" : "/partner/dashboard",
              },
              { label: "Profile" },
            ]}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: '#1A1A1A',
              fontSize: { xs: '22px', sm: '26px', md: '28px' },
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            My Profile
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748B', fontSize: { xs: '13px', sm: '14px' } }}>
            View your complete public profile and contact information.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
        
        {/* Left Column - Basic & Contact Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center', mb: { xs: 2.5, sm: 3.5 } }}>
            <Avatar 
              src={profileData.profileImage || undefined} 
              sx={{
                width: { xs: 96, sm: 110, md: 120 },
                height: { xs: 96, sm: 110, md: 120 },
                mx: 'auto',
                mb: 2,
                border: '4px solid #FFF0E6',
                bgcolor: COLORS.PRIMARY
              }}
            >
              {!profileData.profileImage && <PersonIcon sx={{ fontSize: { xs: 60, sm: 76 }, color: 'white' }} />}
            </Avatar>
            <Typography variant="h5" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: '#1A1A1A', mb: 0.8, fontSize: { xs: '18px', sm: '21px', md: '23px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {profileData.firstName} {profileData.lastName}
              {(profile?.verificationStatus === 'APPROVED' || profileData.verificationStatus === 'APPROVED') && <VerifiedIcon sx={{ color: '#4CAF50', fontSize: 24 }} />}
            </Typography>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', mb: 2, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' } }}>
              {(profile?.verificationStatus === 'APPROVED' || profileData.verificationStatus === 'APPROVED')
                ? (isAstrologer ? 'Verified Astrologer' : 'Verified Partner')
                : (profile?.verificationStatus === 'REJECTED' || profileData.verificationStatus === 'REJECTED')
                ? 'Verification Rejected'
                : 'Pending Verification'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {profileData.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', mb: 1.5 }}>
                <PhoneIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#333', fontWeight: 600, fontSize: { xs: '13.5px', sm: '14px' } }}>
                  +91 {profileData.phone}
                </Typography>
              </Box>
            )}
            
            {profileData.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', wordBreak: 'break-all' }}>
                <EmailIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#333', fontWeight: 500, fontSize: { xs: '13px', sm: '13.5px' } }}>
                  {profileData.email}
                </Typography>
              </Box>
            )}

            {(profile?.city || profileData?.city) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mt: 1.5 }}>
                <LocationOnIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#444', fontWeight: 500, fontSize: { xs: '13px', sm: '14px' } }}>
                  {[profile?.city || profileData?.city, profile?.state || profileData?.state].filter(Boolean).join(', ')}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: { xs: 2, sm: 2.5 }, borderColor: '#F2E8DC' }} />

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <NextLink href="/partner/support" passHref style={{ flex: 1, textDecoration: 'none' }}>
                <Button 
                  fullWidth
                  variant="outlined" 
                  startIcon={<SupportAgentIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                  sx={{ 
                    borderColor: COLORS.PRIMARY, 
                    color: COLORS.PRIMARY,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    height: '40px',
                    bgcolor: '#FFF0E6',
                    '&:hover': { borderColor: COLORS.PRIMARY_DARK, bgcolor: '#FFE0CC' }
                  }}
                >
                  Get Support
                </Button>
              </NextLink>
              <NextLink href="/partner/profile/edit" passHref style={{ flex: 1, textDecoration: 'none' }}>
                <Button 
                  fullWidth
                  variant="contained" 
                  sx={{ 
                    background: COLORS.PRIMARY, 
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    height: '40px',
                    boxShadow: '0 4px 12px rgba(255, 98, 0, 0.25)',
                    '&:hover': { background: COLORS.PRIMARY_DARK }
                  }}
                >
                  Edit Profile
                </Button>
              </NextLink>
            </Box>
          </Paper>

          {/* Bank Details Card */}
          {bankAccounts && bankAccounts.length > 0 && (
            <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mb: { xs: 2.5, sm: 3.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <AccountBalanceIcon sx={{ color: COLORS.PRIMARY }} />
                <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', fontSize: { xs: '16px', sm: '18px' } }}>
                  Bank Accounts
                </Typography>
              </Box>
              
              {bankAccounts.map((bank: any, idx: number) => (
                <Box key={bank.id} sx={{ mb: idx !== bankAccounts.length - 1 ? 2.5 : 0, pb: idx !== bankAccounts.length - 1 ? 2.5 : 0, borderBottom: idx !== bankAccounts.length - 1 ? '1px dashed #eee' : 'none' }}>
                  {bank.paymentMethod === 'UPI' || (bank.upiId && !bank.bankName) ? (
                    <Box sx={{ wordBreak: 'break-all' }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>UPI ID</Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>{bank.upiId || 'N/A'}</Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ mb: 1.5, wordBreak: 'break-word' }}>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Bank Name</Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>{bank.bankName || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 1.5, wordBreak: 'break-word' }}>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Account Holder</Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>{bank.accountHolderName || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 1.5, wordBreak: 'break-all' }}>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Account Number</Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>{bank.accountNumber || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ wordBreak: 'break-all' }}>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#999', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>IFSC Code</Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: '14px' }}>{bank.ifscCode || 'N/A'}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Paper>
          )}

          {/* Documents Card */}
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <DescriptionIcon sx={{ color: COLORS.PRIMARY }} />
              <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', fontSize: { xs: '16px', sm: '18px' } }}>
                Documents
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {profile?.aadhaarDocUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.aadhaarDocUrl)} 
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: '#1A1A1A',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    py: 1,
                    px: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: COLORS.PRIMARY }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 1 }}>
                    <DescriptionIcon sx={{ mr: 1, color: COLORS.PRIMARY, flexShrink: 0 }} fontSize="small" />
                    <Typography noWrap sx={{ fontFamily: FONTS.OUTFIT, fontSize: 'inherit', fontWeight: 600 }}>
                      {profile?.aadhaarNumber ? `Aadhaar (${profile.aadhaarNumber})` : 'Aadhaar Card'}
                    </Typography>
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#94A3B8', flexShrink: 0 }} />
                </Button>
              )}
              {profile?.panDocUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.panDocUrl)} 
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: '#1A1A1A',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    py: 1,
                    px: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: COLORS.PRIMARY }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 1 }}>
                    <DescriptionIcon sx={{ mr: 1, color: COLORS.PRIMARY, flexShrink: 0 }} fontSize="small" />
                    <Typography noWrap sx={{ fontFamily: FONTS.OUTFIT, fontSize: 'inherit', fontWeight: 600 }}>
                      PAN Card
                    </Typography>
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#94A3B8', flexShrink: 0 }} />
                </Button>
              )}
              {profile?.certificateUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.certificateUrl)} 
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: '#1A1A1A',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    py: 1,
                    px: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: COLORS.PRIMARY }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 1 }}>
                    <DescriptionIcon sx={{ mr: 1, color: COLORS.PRIMARY, flexShrink: 0 }} fontSize="small" />
                    <Typography noWrap sx={{ fontFamily: FONTS.OUTFIT, fontSize: 'inherit', fontWeight: 600 }}>
                      Qualification Certificate
                    </Typography>
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#94A3B8', flexShrink: 0 }} />
                </Button>
              )}
              {!isAstrologer && profile?.templeAffiliationProofUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.templeAffiliationProofUrl)} 
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    color: '#1A1A1A',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: '12.5px', sm: '13.5px' },
                    py: 1,
                    px: 1.5,
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: COLORS.PRIMARY }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 1 }}>
                    <DescriptionIcon sx={{ mr: 1, color: COLORS.PRIMARY, flexShrink: 0 }} fontSize="small" />
                    <Typography noWrap sx={{ fontFamily: FONTS.OUTFIT, fontSize: 'inherit', fontWeight: 600 }}>
                      Temple Affiliation Proof
                    </Typography>
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#94A3B8', flexShrink: 0 }} />
                </Button>
              )}
              {!profile?.aadhaarDocUrl && !profile?.panDocUrl && !profile?.certificateUrl && (!isAstrologer ? !profile?.templeAffiliationProofUrl : true) && (
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '14px' }}>No documents uploaded.</Typography>
              )}
            </Box>
          </Paper>

          {/* Help & Support Card (for Astrologer) */}
          {isAstrologer && (
            <Paper sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #FFE2D1', bgcolor: '#FFFDF9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', mt: { xs: 2.5, sm: 3 }, textAlign: 'center' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#FFF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                <SupportAgentIcon sx={{ color: COLORS.PRIMARY, fontSize: 26 }} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', mb: 0.5, fontSize: '15px' }}>
                Need Help or Support?
              </Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748b', mb: 2, fontSize: '12px', lineHeight: 1.5 }}>
                Track existing complaint status or raise a new support ticket.
              </Typography>
              <NextLink href="/partner/support" passHref style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SupportAgentIcon />}
                  sx={{
                    background: COLORS.PRIMARY,
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: '13.5px',
                    py: 1,
                    '&:hover': { background: COLORS.PRIMARY_DARK },
                  }}
                >
                  Go to Get Support
                </Button>
              </NextLink>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Professional Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <WorkIcon sx={{ color: COLORS.PRIMARY }} />
              <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', fontSize: { xs: '16px', sm: '18px' } }}>
                {isAstrologer ? 'Astrologer Profile' : 'Professional Profile'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '12px', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Biography</Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#333', lineHeight: 1.6, fontSize: { xs: '13.5px', sm: '14px' } }}>
                {profile?.bio || 'No biography provided.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2.5, borderColor: '#F2E8DC' }} />

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '12px', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qualifications</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: { xs: '14px', sm: '15px' } }}>
                  {Array.isArray(profile?.qualification)
                    ? profile.qualification.join(", ")
                    : (profile?.qualification || 'N/A')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '12px', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Experience</Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#1A1A1A', fontWeight: 600, fontSize: { xs: '14px', sm: '15px' } }}>
                  {profile?.experienceYears ? `${profile.experienceYears} Years` : 'N/A'}
                </Typography>
              </Grid>

              {isAstrologer && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: "14px",
                      bgcolor: "#FFFDF9",
                      border: "1px solid #F3E7D9",
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      gap: 2,
                    }}
                  >
                    <Box sx={{ p: { xs: 0.5, sm: 0 } }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '11.5px', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Astrology Price
                      </Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: COLORS.PRIMARY, fontWeight: 800, fontSize: { xs: '20px', sm: '22px' } }}>
                        ₹{astroProfile?.astrologyPrice || astroProfile?.ratePerMinute || profile?.astrologyPrice || profile?.ratePerMinute || '0.00'}
                      </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 0.5, sm: 0 }, borderLeft: { xs: 'none', sm: '1px solid #EFE6D5' }, borderTop: { xs: '1px solid #EFE6D5', sm: 'none' }, pl: { sm: 2.5 }, pt: { xs: 1.5, sm: 0 } }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '11.5px', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Commission
                      </Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#EA580C', fontWeight: 800, fontSize: { xs: '20px', sm: '22px' } }}>
                        {astroProfile?.commissionPercentage || profile?.commissionPercentage
                          ? `${astroProfile.commissionPercentage || profile.commissionPercentage}%`
                          : '0%'}
                      </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 0.5, sm: 0 }, borderLeft: { xs: 'none', sm: '1px solid #EFE6D5' }, borderTop: { xs: '1px solid #EFE6D5', sm: 'none' }, pl: { sm: 2.5 }, pt: { xs: 1.5, sm: 0 } }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '11.5px', fontWeight: 700, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Astrologer Payout
                      </Typography>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#059669', fontWeight: 800, fontSize: { xs: '20px', sm: '22px' } }}>
                        ₹{astroProfile?.astrologerPayout !== undefined && astroProfile?.astrologerPayout !== null
                          ? astroProfile.astrologerPayout
                          : profile?.astrologerPayout !== undefined && profile?.astrologerPayout !== null
                          ? profile.astrologerPayout
                          : '0.00'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <Divider sx={{ my: 2.5, borderColor: '#F2E8DC' }} />

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '12px', fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Languages Spoken</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languages.length > 0 ? languages.map((lang: string, idx: number) => (
                  <Chip key={idx} label={cleanItem(lang)} sx={{ bgcolor: '#FFF0E6', color: COLORS.PRIMARY, fontWeight: 600, fontFamily: FONTS.OUTFIT, fontSize: { xs: '12px', sm: '13px' }, textTransform: 'capitalize' }} />
                )) : (
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '13.5px' }}>N/A</Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#8C6F5A', fontSize: '12px', fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isAstrologer ? 'Astrology Specializations' : 'Specialized Rituals'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specializations.length > 0 ? specializations.map((spec: string, idx: number) => (
                  <Chip key={idx} label={cleanItem(spec)} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontFamily: FONTS.OUTFIT, fontSize: { xs: '12px', sm: '13px' }, textTransform: 'capitalize' }} />
                )) : (
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '13.5px' }}>N/A</Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Purohit Services Card (Only for Purohit) */}
          {!isAstrologer && (
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mt: { xs: 2.5, sm: 3.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <AssignmentIcon sx={{ color: COLORS.PRIMARY }} />
              <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A' }}>
                Services Offered
              </Typography>
            </Box>

            {purohitServices && purohitServices.length > 0 ? (
              <Grid container spacing={2}>
                {purohitServices.map((serviceItem: any) => {
                  const payout =
                    serviceItem.purohitPayoutAmount ??
                    serviceItem.service?.purohitPayoutAmount ??
                    (serviceItem.offlinePrice ||
                      serviceItem.onlinePrice ||
                      serviceItem.service?.plans?.basic?.price ||
                      serviceItem.service?.minPrice);
                  const duration =
                    serviceItem.durationMinutes ||
                    serviceItem.service?.durationMinutes;

                  return (
                    <Grid
                      size={{ xs: 12, sm: 6 }}
                      key={serviceItem.id}
                      sx={{ display: "flex" }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justify: "space-between",
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid #eee",
                          bgcolor: "#fafafa",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 700,
                            color: "#1A1A1A",
                            mb: 1,
                          }}
                        >
                          {serviceItem.service?.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "13px",
                              color: "#666",
                            }}
                          >
                            <strong style={{ color: "#333" }}>Payout:</strong>{" "}
                            {getPurohitPayoutRange(serviceItem)}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "13px",
                              color: "#666",
                            }}
                          >
                            <strong style={{ color: "#333" }}>Duration:</strong>{" "}
                            {duration ? `${duration} mins` : "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '14px' }}>No services added yet.</Typography>
            )}
          </Paper>
        )}

          {/* Service Areas Card */}
          {!isAstrologer && (
            <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: { xs: '14px', sm: '18px' }, border: '1px solid #EFE6D5', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mt: { xs: 2.5, sm: 3.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LocationOnIcon sx={{ color: COLORS.PRIMARY }} />
                <Typography variant="h6" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A' }}>
                  Service Areas
                </Typography>
              </Box>

              {serviceAreas && serviceAreas.length > 0 ? (
                <Grid container spacing={2}>
                  {serviceAreas.map((area: any) => (
                    <Grid size={{ xs: 12 }} key={area.id}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, borderRadius: '12px', border: '1px solid #EFE6D5', bgcolor: '#FFFDF9' }}>
                        <LocationOnIcon sx={{ color: COLORS.PRIMARY, mt: 0.5 }} fontSize="small" />
                        <Box>
                          <Typography component="div" sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1 }}>
                            {area.addressLabel} {area.isDefault && <Chip label="Default" size="small" sx={{ bgcolor: '#FFF0E6', color: COLORS.PRIMARY, fontSize: '10px', height: '20px' }} />}
                          </Typography>
                          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', color: '#666', mt: 0.5 }}>
                            {area.fullAddress}
                          </Typography>
                          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13px', color: '#999', mt: 0.5 }}>
                            {area.city}, {area.pincode}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '14px' }}>No service areas added.</Typography>
              )}
            </Paper>
          )}
        </Grid>

      </Grid>
      
      {/* Document Viewer Modal */}
      <Dialog
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: "14px", sm: "18px" },
              border: "1px solid #EFE6D5",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.16)",
              m: { xs: 1.5, sm: "auto" },
              width: { xs: "calc(100% - 24px)", sm: "auto" },
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 1.5,
            bgcolor: "#FAF4EE",
            borderBottom: "1px solid #EFE6D5",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "15px",
              color: "#2C1810",
            }}
          >
            Document Preview
          </Typography>
          <IconButton
            onClick={() => setDocModalOpen(false)}
            size="small"
            sx={{
              color: "#64748B",
              "&:hover": { color: "#1E293B", bgcolor: "#EFE6D5" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            p: { xs: 1, sm: 2 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#F8FAFC",
            height: { xs: "65vh", sm: "75vh" },
          }}
        >
          {currentDocUrl &&
            (checkIsImage(currentDocUrl) ? (
              <Box
                component="img"
                src={currentDocUrl}
                alt="Document Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <object
                data={getPdfUrlWithParams(currentDocUrl)}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ borderRadius: '8px' }}
              >
                <iframe
                  src={
                    currentDocUrl.startsWith('blob:') || currentDocUrl.startsWith('data:')
                      ? getPdfUrlWithParams(currentDocUrl)
                      : `https://docs.google.com/gview?url=${encodeURIComponent(currentDocUrl)}&embedded=true`
                  }
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                  title="Document Preview"
                >
                  <Typography sx={{ p: 2, fontFamily: FONTS.OUTFIT }}>
                    Unable to display PDF preview.
                  </Typography>
                </iframe>
              </object>
            ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
