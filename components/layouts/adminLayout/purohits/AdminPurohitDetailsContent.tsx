'use client';

import { getPurohitByIdAPI } from '@/api/userControllers';
import { useSnackbarStore } from '@/stores/snackbarStore';
import DownloadIcon from '@mui/icons-material/Download';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Box, Breadcrumbs, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPurohitDetailsContent() {
  const params = useParams();
  const [purohit, setPurohit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (params.id) {
      fetchPurohitDetails(params.id as string);
    }
  }, [params.id]);

  const fetchPurohitDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await getPurohitByIdAPI(id);
      if (res.success && res.data) {
        // Handle double-nested 'data' object based on backend response
        const userData = res.data.data?.user || res.data.data || res.data.user || res.data;
        setPurohit(userData);
      } else {
        showSnackbar('Failed to fetch purohit details', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Error fetching purohit details', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  if (!purohit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h6" color="textSecondary">Purohit not found</Typography>
      </Box>
    );
  }

  const profile = purohit.profile || purohit.purohitProfile || {};
  const bankAccount = (purohit.bankAccounts && purohit.bankAccounts[0]) || {};
  const fullName = `${purohit.firstName || ''} ${purohit.lastName || ''}`.trim() || purohit.username;
  const initials = `${purohit.firstName?.[0] || ''}${purohit.lastName?.[0] || ''}`.toUpperCase() || 'P';

  const verificationStatus = profile.verificationStatus || purohit.status;
  let statusColor = { bg: '#f1f5f9', text: '#64748b' };
  let statusLabel = 'No Profile';
  
  if (verificationStatus === 'APPROVED' || verificationStatus === 'ACTIVE') {
    statusColor = { bg: '#d1fae5', text: '#059669' };
    statusLabel = 'Approved';
  } else if (verificationStatus === 'PENDING') {
    statusColor = { bg: '#fef3c7', text: '#d97706' };
    statusLabel = 'Pending Approval';
  } else if (verificationStatus === 'REJECTED') {
    statusColor = { bg: '#fee2e2', text: '#ef4444' };
    statusLabel = 'Rejected';
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
            <NextLink href="/admin/purohits" style={{ textDecoration: 'none', color: '#64748b', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px' }}>
              Purohits
            </NextLink>
            <Typography sx={{ color: '#FF6200', fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '14px' }}>
              Purohit Details
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
            Purohit Details
          </Typography>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Core Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar src={purohit.profileImage || ''} sx={{ width: 80, height: 80, bgcolor: '#FF6200', fontSize: '2rem', fontWeight: 700 }}>
                {initials}
              </Avatar>
              <Box>
                <Chip label={statusLabel} sx={{ bgcolor: statusColor.bg, color: statusColor.text, fontWeight: 700, fontFamily: 'var(--font-outfit), sans-serif', borderRadius: '8px', mb: 1 }} />
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b' }}>
                  {fullName}
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#64748b' }}>
                  {profile.city || 'No City'} {profile.experienceYears ? `• ${profile.experienceYears} Years Experience` : ''}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />
            
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Professional Profile
            </Typography>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Bio</Typography>
                <Typography sx={{ color: '#1e293b', mt: 0.5 }}>{profile.bio || 'No bio provided.'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Qualification</Typography>
                <Typography sx={{ color: '#1e293b', mt: 0.5 }}>{profile.qualification || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Ratings & Reviews</Typography>
                <Typography sx={{ color: '#1e293b', mt: 0.5 }}>
                  {profile.avgRating || '0.0'} ⭐ ({profile.totalReviews || 0} reviews)
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Availability</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {profile.isOnlineAvailable && <Chip label="Online Services" size="small" sx={{ bgcolor: '#d1fae5', color: '#059669', fontWeight: 600 }} />}
                  {profile.isOfflineAvailable && <Chip label="Offline Services" size="small" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 600 }} />}
                  {!profile.isOnlineAvailable && !profile.isOfflineAvailable && <Typography sx={{ color: '#1e293b' }}>N/A</Typography>}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Specializations</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {(Array.isArray(profile.specializations) ? profile.specializations : (profile.specializations ? [profile.specializations] : [])).map((s: string, i: number) => (
                    <Chip key={i} label={s} size="small" sx={{ bgcolor: '#FFF0E6', color: '#FF6200', fontWeight: 600 }} />
                  ))}
                  {!profile.specializations && <Typography sx={{ color: '#1e293b' }}>N/A</Typography>}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Languages</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  {(Array.isArray(profile.languages) ? profile.languages : (profile.languages ? [profile.languages] : [])).map((l: string, i: number) => (
                    <Chip key={i} label={l} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }} />
                  ))}
                  {!profile.languages && <Typography sx={{ color: '#1e293b' }}>N/A</Typography>}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Verification Documents
            </Typography>
            <Grid container spacing={2}>
              {profile.aadhaarDocUrl && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Aadhar Card</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>{profile.aadhaarNumber || 'Uploaded'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => setPreviewDocUrl(profile.aadhaarDocUrl)} sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton component="a" href={profile.aadhaarDocUrl} target="_blank" sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )}
              {profile.panDocUrl && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>PAN Card</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>Uploaded</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => setPreviewDocUrl(profile.panDocUrl)} sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton component="a" href={profile.panDocUrl} target="_blank" sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )}
              {profile.certificateUrl && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Certificate</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>{profile.qualification || 'Uploaded'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => setPreviewDocUrl(profile.certificateUrl)} sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton component="a" href={profile.certificateUrl} target="_blank" sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )}
              {profile.templeAffiliationProofUrl && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Temple Affiliation</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>Uploaded</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => setPreviewDocUrl(profile.templeAffiliationProofUrl)} sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton component="a" href={profile.templeAffiliationProofUrl} target="_blank" sx={{ color: '#FF6200', bgcolor: '#FFF0E6' }}>
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              )}
              {!profile.aadhaarDocUrl && !profile.panDocUrl && !profile.certificateUrl && !profile.templeAffiliationProofUrl && (
                <Grid size={{ xs: 12 }}>
                   <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>No documents uploaded yet.</Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 2 }}>
              Services Offered
            </Typography>
            {profile.purohitServices && profile.purohitServices.length > 0 ? (
              <Grid container spacing={2}>
                {profile.purohitServices.map((ps: any, index: number) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        {ps.service?.iconUrl && (
                          <Avatar src={ps.service.iconUrl} sx={{ width: 40, height: 40 }} />
                        )}
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {ps.service?.name || 'Unknown Service'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {ps.durationMinutes} mins • ₹{ps.customPrice}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                         {ps.service?.supportsOnline && <Chip label="Online" size="small" sx={{ bgcolor: '#d1fae5', color: '#059669', fontSize: '0.75rem' }} />}
                         {ps.service?.supportsOffline && <Chip label="Offline" size="small" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem' }} />}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>No services offered yet.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Additional Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Contact Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{purohit.phone || 'N/A'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Email Address</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{purohit.email || 'N/A'}</Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Personal Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Date of Birth</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {purohit.dob ? `${String(new Date(purohit.dob).getDate()).padStart(2, '0')}/${String(new Date(purohit.dob).getMonth() + 1).padStart(2, '0')}/${new Date(purohit.dob).getFullYear()}` : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Aadhaar Number</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{profile.aadhaarNumber || 'N/A'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Account Created</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {purohit.createdAt ? `${String(new Date(purohit.createdAt).getDate()).padStart(2, '0')}/${String(new Date(purohit.createdAt).getMonth() + 1).padStart(2, '0')}/${new Date(purohit.createdAt).getFullYear()}` : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Last Login</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {purohit.lastLoginAt ? `${String(new Date(purohit.lastLoginAt).getDate()).padStart(2, '0')}/${String(new Date(purohit.lastLoginAt).getMonth() + 1).padStart(2, '0')}/${new Date(purohit.lastLoginAt).getFullYear()} ${String(new Date(purohit.lastLoginAt).getHours()).padStart(2, '0')}:${String(new Date(purohit.lastLoginAt).getMinutes()).padStart(2, '0')}` : 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, color: '#1e293b', mb: 3 }}>
                  Bank Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Payment Method</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.paymentMethod || 'N/A'}</Typography>
                </Box>
                {bankAccount.accountNumber || bankAccount.paymentMethod !== 'UPI' ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Bank Name</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.bankName || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Account Holder Name</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.accountHolderName || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Account Number</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.accountNumber || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>IFSC Code</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.ifscCode || 'N/A'}</Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>UPI ID</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{bankAccount.upiId || 'N/A'}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={!!previewDocUrl} onClose={() => setPreviewDocUrl(null)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          {previewDocUrl && (
            previewDocUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ? (
              <img src={previewDocUrl} alt="Document Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f8fafc' }} />
            ) : (
              <iframe src={previewDocUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Document Preview" />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDocUrl(null)} sx={{ color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-outfit), sans-serif' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
