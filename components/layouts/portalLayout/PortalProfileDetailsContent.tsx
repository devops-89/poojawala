'use client';
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
import { useUserStore } from '@/stores/userStore';

export default function PortalProfileDetailsContent() {
  const { profile: profileData, fetchProfile } = useUserStore();
  const [loading, setLoading] = useState(true);
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
        <CircularProgress sx={{ color: '#FF6200' }} />
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
  const languages = profile?.languages ? (Array.isArray(profile.languages) ? profile.languages : profile.languages.split(',')).map((l: string) => l.trim()) : [];
  const specializations = profile?.specializations ? (Array.isArray(profile.specializations) ? profile.specializations : profile.specializations.split(',')).map((s: string) => s.trim()) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
            My Profile
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 2 }}>
            View your complete public profile and contact information.
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
            <NextLink href="/purohit/dashboard" style={{ textDecoration: 'none', color: '#666', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
              Dashboard
            </NextLink>
            <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
              Profile
            </Typography>
          </Breadcrumbs>
        </Box>
        <NextLink href="/purohit/profile/edit" passHref>
          <Button 
            variant="contained" 
            sx={{ 
              background: '#FF6200', 
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              '&:hover': { background: '#E65800' }
            }}
          >
            Edit Profile
          </Button>
        </NextLink>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column - Basic & Contact Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center', mb: 4 }}>
            <Avatar 
              src={profileData.profileImage || undefined} 
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #FFF0E6', bgcolor: '#FF6200' }}
            >
              {!profileData.profileImage && <PersonIcon sx={{ fontSize: 80, color: 'white' }} />}
            </Avatar>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {profileData.firstName} {profileData.lastName}
              {profile?.verificationStatus === 'APPROVED' && <VerifiedIcon sx={{ color: '#4CAF50', fontSize: 24 }} />}
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', mb: 3, fontWeight: 500 }}>
              {profile?.verificationStatus === 'APPROVED' ? 'Verified Partner' : 'Pending Verification'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {profileData.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', mb: 2 }}>
                <PhoneIcon sx={{ color: '#FF6200', fontSize: 20 }} />
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#333', fontWeight: 500 }}>
                  +91 {profileData.phone}
                </Typography>
              </Box>
            )}
            
            {profileData.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                <EmailIcon sx={{ color: '#FF6200', fontSize: 20 }} />
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#333', fontWeight: 500 }}>
                  {profileData.email}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Bank Details Card */}
          {bankAccounts && bankAccounts.length > 0 && (
            <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AccountBalanceIcon sx={{ color: '#FF6200' }} />
                <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
                  Bank Accounts
                </Typography>
              </Box>
              
              {bankAccounts.map((bank: any, idx: number) => (
                <Box key={bank.id} sx={{ mb: idx !== bankAccounts.length - 1 ? 3 : 0, pb: idx !== bankAccounts.length - 1 ? 3 : 0, borderBottom: idx !== bankAccounts.length - 1 ? '1px dashed #eee' : 'none' }}>
                  {bank.paymentMethod === 'UPI' || (bank.upiId && !bank.bankName) ? (
                    <Box>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>UPI ID</Typography>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{bank.upiId || 'N/A'}</Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Bank Name</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{bank.bankName || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Account Holder</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{bank.accountHolderName || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Account Number</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{bank.accountNumber || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>IFSC Code</Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{bank.ifscCode || 'N/A'}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ))}
            </Paper>
          )}

          {/* Documents Card */}
          <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <DescriptionIcon sx={{ color: '#FF6200' }} />
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
                Documents
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {profile?.aadhaarDocUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.aadhaarDocUrl)} 
                  sx={{ justifyContent: 'space-between', textTransform: 'none', color: '#1A1A1A', borderColor: '#eee', borderRadius: '8px' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#FF6200' }} fontSize="small" /> Aadhaar Card
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#999' }} />
                </Button>
              )}
              {profile?.panDocUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.panDocUrl)} 
                  sx={{ justifyContent: 'space-between', textTransform: 'none', color: '#1A1A1A', borderColor: '#eee', borderRadius: '8px' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#FF6200' }} fontSize="small" /> PAN Card
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#999' }} />
                </Button>
              )}
              {profile?.certificateUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.certificateUrl)} 
                  sx={{ justifyContent: 'space-between', textTransform: 'none', color: '#1A1A1A', borderColor: '#eee', borderRadius: '8px' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#FF6200' }} fontSize="small" /> Qualification Certificate
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#999' }} />
                </Button>
              )}
              {profile?.templeAffiliationProofUrl && (
                <Button 
                  variant="outlined" 
                  onClick={() => handleOpenDoc(profile.templeAffiliationProofUrl)} 
                  sx={{ justifyContent: 'space-between', textTransform: 'none', color: '#1A1A1A', borderColor: '#eee', borderRadius: '8px' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: '#FF6200' }} fontSize="small" /> Temple Affiliation Proof
                  </Box>
                  <VisibilityIcon fontSize="small" sx={{ color: '#999' }} />
                </Button>
              )}
              {!profile?.aadhaarDocUrl && !profile?.panDocUrl && !profile?.certificateUrl && !profile?.templeAffiliationProofUrl && (
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>No documents uploaded.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Professional Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <WorkIcon sx={{ color: '#FF6200' }} />
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
                Professional Profile
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '14px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>Biography</Typography>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#333', lineHeight: 1.6 }}>
                {profile?.bio || 'No biography provided.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '14px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>Qualifications</Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>
                  {profile?.qualification || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '14px', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>Experience</Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', fontWeight: 600 }}>
                  {profile?.experienceYears ? `${profile.experienceYears} Years` : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '14px', fontWeight: 600, mb: 1.5, textTransform: 'uppercase' }}>Languages Spoken</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languages.length > 0 ? languages.map((lang: string, idx: number) => (
                  <Chip key={idx} label={lang} sx={{ bgcolor: '#FFF0E6', color: '#FF6200', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', textTransform: 'capitalize' }} />
                )) : (
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>N/A</Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#999', fontSize: '14px', fontWeight: 600, mb: 1.5, textTransform: 'uppercase' }}>Specialized Rituals</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specializations.length > 0 ? specializations.map((spec: string, idx: number) => (
                  <Chip key={idx} label={spec} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif', textTransform: 'capitalize' }} />
                )) : (
                  <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>N/A</Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Purohit Services Card */}
          <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <AssignmentIcon sx={{ color: '#FF6200' }} />
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
                Services Offered
              </Typography>
            </Box>

            {purohitServices && purohitServices.length > 0 ? (
              <Grid container spacing={2}>
                {purohitServices.map((serviceItem: any) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={serviceItem.id}>
                    <Box sx={{ p: 2, borderRadius: '12px', border: '1px solid #eee', bgcolor: '#fafafa' }}>
                      <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
                        {serviceItem.service?.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {serviceItem.isOnline && (
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '13px', color: '#666' }}>
                            <strong style={{ color: '#333' }}>Online:</strong> ₹{serviceItem.onlinePrice}
                          </Typography>
                        )}
                        {serviceItem.isOffline && (
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '13px', color: '#666' }}>
                            <strong style={{ color: '#333' }}>Offline:</strong> ₹{serviceItem.offlinePrice}
                          </Typography>
                        )}
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '13px', color: '#666' }}>
                          <strong style={{ color: '#333' }}>Duration:</strong> {serviceItem.durationMinutes} mins
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>No services added yet.</Typography>
            )}
          </Paper>

          {/* Service Areas Card */}
          <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <LocationOnIcon sx={{ color: '#FF6200' }} />
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A' }}>
                Service Areas
              </Typography>
            </Box>

            {serviceAreas && serviceAreas.length > 0 ? (
              <Grid container spacing={2}>
                {serviceAreas.map((area: any) => (
                  <Grid size={{ xs: 12 }} key={area.id}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, borderRadius: '12px', border: '1px solid #eee' }}>
                      <LocationOnIcon sx={{ color: '#FF6200', mt: 0.5 }} fontSize="small" />
                      <Box>
                        <Typography component="div" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {area.addressLabel} {area.isDefault && <Chip label="Default" size="small" sx={{ bgcolor: '#FFF0E6', color: '#FF6200', fontSize: '10px', height: '20px' }} />}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '14px', color: '#666', mt: 0.5 }}>
                          {area.fullAddress}
                        </Typography>
                        <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: '13px', color: '#999', mt: 0.5 }}>
                          {area.city}, {area.pincode}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>No service areas added.</Typography>
            )}
          </Paper>
        </Grid>

      </Grid>
      
      {/* Document Viewer Modal */}
      <Dialog open={docModalOpen} onClose={() => setDocModalOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, bgcolor: '#f5f5f5' }}>
          <IconButton onClick={() => setDocModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
          <img src={currentDocUrl} alt="Document" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
