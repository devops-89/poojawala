'use client';
import { useUserStore } from '@/stores/userStore';
import { addServiceAreaAPI, updateProfileAPI, updateServiceAreaAPI, deleteServiceAreaAPI, addBankAccountAPI, updateBankAccountAPI, deleteBankAccountAPI } from '@/api/userControllers';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useSnackbarStore } from '@/stores/snackbarStore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import WorkIcon from '@mui/icons-material/Work';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography, Slider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AVAILABLE_LANGUAGES = ['Hindi', 'English', 'Sanskrit', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
const AVAILABLE_RITUALS = ['Astrology', 'Satyanarayan Katha', 'Grah Pravesh', 'Marriage Ceremony', 'Vastu Shanti', 'Navagraha Shanti', 'Maha Mrityunjaya Jaap', 'Rudrabhishek'];

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: <PersonIcon sx={{ fontSize: 20 }} /> },
  { id: 'skills', label: 'Skills', icon: <WorkIcon sx={{ fontSize: 20 }} /> },
  { id: 'location', label: 'Service Area', icon: <LocationOnIcon sx={{ fontSize: 20 }} /> },
  { id: 'bank', label: 'Bank Details', icon: <AccountBalanceIcon sx={{ fontSize: 20 }} /> },
];

export default function ProfileContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('profileActiveTab') || 'personal';
    }
    return 'personal';
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  // --- Form State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(true);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  
  // --- Service Areas State ---
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressLabel: '',
    streetName: '',
    fullAddress: '',
    city: '',
    pincode: '',
    isDefault: false,
    latitude: '',
    longitude: '',
    serviceRadiusKm: 10
  });
  const [savingAddress, setSavingAddress] = useState(false);
  
  // --- Bank Accounts State ---
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [bankDeleteConfirmOpen, setBankDeleteConfirmOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<number | null>(null);
  const [bankForm, setBankForm] = useState({
    paymentMethod: 'BANK', // BANK or UPI
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: 'SAVINGS',
    upiId: '',
    isPrimary: false
  });
  const [savingBank, setSavingBank] = useState(false);
  
  // Files
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      if (profile.profile) {
        const p = profile.profile;
        setBio(p.bio || '');
        setCity(p.city || '');
        setLanguages(p.languages ? p.languages.split(',').map((l: string) => l.trim()) : []);
        setSpecializations(p.specializations ? p.specializations.split(',').map((s: string) => s.trim()) : []);
        setQualification(p.qualification || '');
        setExperienceYears(p.experienceYears ? p.experienceYears.toString() : '');
        setIsOnlineAvailable(p.isOnlineAvailable ?? true);
        setIsOfflineAvailable(p.isOfflineAvailable ?? false);
      }
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setUsername(profile.username || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setDob(profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '');
      setBirthPlace(profile.birthPlace || '');
      setProfileImageUrl(profile.profileImage || null);
      setServiceAreas(profile.serviceAreas || []);
      setBankAccounts(profile.bankAccounts || []);
    }
  }, [profile]);

  const handleLanguageChange = (event: any) => {
    const { target: { value } } = event;
    setLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRitualsChange = (event: any) => {
    const { target: { value } } = event;
    setSpecializations(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phone', phone);
      if (dob) formData.append('dob', new Date(dob).toISOString());
      formData.append('birthPlace', birthPlace);
      formData.append('bio', bio);
      formData.append('city', city);
      formData.append('languages', languages.join(','));
      formData.append('specializations', specializations.join(','));
      formData.append('qualification', qualification);
      formData.append('experienceYears', experienceYears);
      
      formData.append('isOnlineAvailable', isOnlineAvailable ? 'true' : 'false');
      formData.append('isOfflineAvailable', isOfflineAvailable ? 'true' : 'false');

      if (profileImage) formData.append('profileImage', profileImage);

      await updateProfileAPI(formData);
      showSnackbar('Profile updated successfully!', 'success');
      
      // Show loader on screen and fetch fresh data from me API
      setLoading(true);
      await fetchProfile(true);
      setLoading(false);
      setSaving(false);
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to update profile.', 'error');
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      const payload = { ...addressForm };
      if (!payload.latitude) delete (payload as any).latitude;
      if (!payload.longitude) delete (payload as any).longitude;

      if (selectedAddressId) {
        const res = await updateServiceAreaAPI(selectedAddressId, payload);
        if (res.success) {
          showSnackbar('Service area updated successfully', 'success');
          const updatedArea = res.data?.data || res.data;
          setServiceAreas(serviceAreas.map(a => a.id === selectedAddressId ? updatedArea : a));
          setAddressModalOpen(false);
          setSelectedAddressId(null);
          setAddressForm({ addressLabel: '', streetName: '', fullAddress: '', city: '', pincode: '', isDefault: false, latitude: '', longitude: '', serviceRadiusKm: 10 });
        }
      } else {
        const res = await addServiceAreaAPI(payload);
        if (res.success) {
          showSnackbar('Service area added successfully', 'success');
          const newArea = res.data?.data || res.data;
          setServiceAreas([...serviceAreas, newArea]);
          setAddressModalOpen(false);
          setAddressForm({ addressLabel: '', streetName: '', fullAddress: '', city: '', pincode: '', isDefault: false, latitude: '', longitude: '', serviceRadiusKm: 10 });
        }
      }
    } catch (error) {
      console.error(error);
      showSnackbar(`Failed to ${selectedAddressId ? 'update' : 'add'} service area.`, 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditClick = (area: any) => {
    setSelectedAddressId(area.id);
    setAddressForm({
      addressLabel: area.addressLabel || '',
      streetName: area.streetName || '',
      fullAddress: area.fullAddress || '',
      city: area.city || '',
      pincode: area.pincode || '',
      isDefault: area.isDefault || false,
      latitude: area.latitude || '',
      longitude: area.longitude || '',
      serviceRadiusKm: area.serviceRadiusKm || 10
    });
    setAddressModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      const res = await deleteServiceAreaAPI(addressToDelete);
      if (res.success) {
        showSnackbar('Service area deleted successfully', 'success');
        setServiceAreas(serviceAreas.filter(a => a.id !== addressToDelete));
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to delete service area.', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar('Geolocation is not supported by your browser', 'error');
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toString();
        const lng = position.coords.longitude.toString();
        
        let addressUpdates: any = { latitude: lat, longitude: lng };
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.state_district || '';
              const pincode = data.address.postcode || '';
              const streetName = data.address.road || data.address.suburb || '';
              const fullAddress = data.display_name || '';
              
              addressUpdates = {
                ...addressUpdates,
                city,
                pincode,
                streetName,
                fullAddress
              };
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }

        setAddressForm(prev => ({
          ...prev,
          ...addressUpdates
        }));
        
        showSnackbar('Location data fetched successfully!', 'success');
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        showSnackbar('Failed to fetch location. Please allow location access.', 'error');
        setIsFetchingLocation(false);
      }
    );
  };

  const handleSaveBank = async () => {
    setSavingBank(true);
    try {
      if (selectedBankId) {
        const res = await updateBankAccountAPI(selectedBankId, bankForm);
        if (res.success) {
          showSnackbar('Bank account updated successfully', 'success');
          setLoading(true);
          await fetchProfile(true);
          setLoading(false);
          setBankModalOpen(false);
          setSelectedBankId(null);
          setBankForm({ paymentMethod: 'BANK', accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', accountType: 'SAVINGS', upiId: '', isPrimary: false });
        }
      } else {
        const res = await addBankAccountAPI(bankForm);
        if (res.success) {
          showSnackbar('Bank account added successfully', 'success');
          setLoading(true);
          await fetchProfile(true);
          setLoading(false);
          setBankModalOpen(false);
          setBankForm({ paymentMethod: 'BANK', accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', accountType: 'SAVINGS', upiId: '', isPrimary: false });
        }
      }
    } catch (error) {
      console.error(error);
      showSnackbar(`Failed to ${selectedBankId ? 'update' : 'add'} bank account.`, 'error');
    } finally {
      setSavingBank(false);
    }
  };

  const handleEditBankClick = (bank: any) => {
    setSelectedBankId(bank.id);
    setBankForm({
      paymentMethod: bank.paymentMethod || 'BANK',
      accountHolderName: bank.accountHolderName || '',
      accountNumber: bank.accountNumber || '',
      ifscCode: bank.ifscCode || '',
      bankName: bank.bankName || '',
      accountType: bank.accountType || 'SAVINGS',
      upiId: bank.upiId || '',
      isPrimary: bank.isPrimary || false
    });
    setBankModalOpen(true);
  };

  const handleDeleteBankClick = (id: number) => {
    setBankToDelete(id);
    setBankDeleteConfirmOpen(true);
  };

  const confirmBankDelete = async () => {
    if (!bankToDelete) return;
    try {
      const res = await deleteBankAccountAPI(bankToDelete);
      if (res.success) {
        showSnackbar('Bank account deleted successfully', 'success');
        setBankAccounts(bankAccounts.filter(b => b.id !== bankToDelete));
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Failed to delete bank account.', 'error');
    } finally {
      setBankDeleteConfirmOpen(false);
      setBankToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <Box>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '20px', mb: 3 }}>Personal Info</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar src={profileImage ? URL.createObjectURL(profileImage) : (profileImageUrl || undefined)} sx={{ width: 100, height: 100, border: '2px solid #FFE0D0', bgcolor: '#FF6200' }}>
                  {!profileImage && !profileImageUrl && <PersonIcon sx={{ fontSize: 60, color: 'white' }} />}
                </Avatar>
                <IconButton component="label" sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: '#FF6200', color: 'white', '&:hover': { bgcolor: '#F05A00' }, width: 32, height: 32 }}>
                  <PhotoCameraIcon sx={{ fontSize: 18 }} />
                  <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && setProfileImage(e.target.files[0])} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 700, fontSize: '18px' }}>Profile Photo</Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '13px' }}>Upload a clear passport size photograph.</Typography>
              </Box>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} variant="outlined" slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12,sm:6}}>
                <TextField fullWidth label="Birth Place" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
            </Grid>

            <TextField fullWidth multiline rows={4} label="Biography" value={bio} onChange={(e) => setBio(e.target.value)} variant="outlined" sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
            
            <Button onClick={handleSaveProfile} disabled={saving} variant="contained" sx={{ background: '#FF6200 !important', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '30px', px: 4, mt: 4, boxShadow: 'none' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        );
      
      case 'skills':
        return (
          <Box>
            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '20px', mb: 3 }}>Skills & Availability</Typography>
            <Grid container spacing={3}>
              <Grid size={{xs:12, sm:6}}>
                <TextField fullWidth label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <TextField fullWidth type="number" label="Experience (Years)" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
              <Grid size={{xs:12}}>
                <FormControl fullWidth>
                  <InputLabel>Languages Spoken</InputLabel>
                  <Select
                    multiple
                    label="Languages Spoken"
                    value={languages}
                    onChange={handleLanguageChange}
                    input={<OutlinedInput label="Languages Spoken" sx={{ borderRadius: '12px' }} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => <Chip key={value} label={value} sx={{ bgcolor: '#FFF0E6', color: '#FF6200', fontWeight: 600 }} />)}
                      </Box>
                    )}
                  >
                    {AVAILABLE_LANGUAGES.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12}}>
                <FormControl fullWidth>
                  <InputLabel>Specialized Rituals</InputLabel>
                  <Select
                    multiple
                    label="Specialized Rituals"
                    value={specializations}
                    onChange={handleRitualsChange}
                    input={<OutlinedInput label="Specialized Rituals" sx={{ borderRadius: '12px' }} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => <Chip key={value} label={value} sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }} />)}
                      </Box>
                    )}
                  >
                    {AVAILABLE_RITUALS.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#eee' }}>
                  <FormControlLabel 
                    control={<Checkbox checked={isOnlineAvailable} onChange={(e) => setIsOnlineAvailable(e.target.checked)} sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }} />} 
                    label={<Typography sx={{ fontWeight: 600 }}>Available for Online Pooja</Typography>} 
                  />
                  <Typography variant="body2" sx={{ color: '#666', ml: 4, mt: -0.5 }}>I can conduct rituals via video call</Typography>
                </Paper>
              </Grid>
              <Grid size={{xs:12, sm:6}}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#eee' }}>
                  <FormControlLabel 
                    control={<Checkbox checked={isOfflineAvailable} onChange={(e) => setIsOfflineAvailable(e.target.checked)} sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }} />} 
                    label={<Typography sx={{ fontWeight: 600 }}>Available for Offline Pooja</Typography>} 
                  />
                  <Typography variant="body2" sx={{ color: '#666', ml: 4, mt: -0.5 }}>I can travel to the devotee's venue</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Button onClick={handleSaveProfile} disabled={saving} variant="contained" sx={{ background: '#FF6200 !important', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '30px', px: 4, mt: 4, boxShadow: 'none' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        );

      case 'location':
        return (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '20px' }}>Service Area</Typography>
              <Button onClick={() => {
                setSelectedAddressId(null);
                setAddressForm({ addressLabel: '', streetName: '', fullAddress: '', city: '', pincode: '', isDefault: false, latitude: '', longitude: '', serviceRadiusKm: 10 });
                setAddressModalOpen(true);
              }} variant="outlined" sx={{ color: '#FF6200', borderColor: '#FF6200', textTransform: 'none', borderRadius: '8px', '&:hover': { borderColor: '#F05A00', bgcolor: '#FFF0E6' } }}>
                Add New Address
              </Button>
            </Box>
            <Typography sx={{ mb: 4, color: '#666', fontSize: '14px' }}>Manage the locations where you are willing to travel for services.</Typography>
            
            <Grid container spacing={3}>
              {serviceAreas.map((area, index) => (
                <Grid size={{xs:12,sm:6}} key={index}>
                  <Card sx={{ borderRadius: '16px', border: '1px solid #eee', boxShadow: 'none', position: 'relative' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                        <Typography component="div" sx={{ fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ color: '#FF6200', fontSize: 20 }} />
                          {area.addressLabel || 'Address'}
                          {area.isDefault && (
                            <Chip label="Default" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '10px', height: 20 }} />
                          )}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditClick(area)} sx={{ color: '#666', '&:hover': { color: '#FF6200' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(area.id)} sx={{ color: '#666', '&:hover': { color: '#d32f2f' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography sx={{ color: '#475569', fontSize: '14px', pl: 3.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {area.fullAddress}
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '13px', pl: 3.5, mt: 0.5 }}>
                        {area.city} - {area.pincode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {serviceAreas.length === 0 && (
                <Grid size={{xs:12}}>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa', borderRadius: '16px', border: '1px dashed #ccc', boxShadow: 'none' }}>
                    <Typography sx={{ color: '#666' }}>No service areas added yet.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px', padding: 1 } }}>
              <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to delete this service area?</Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                <Button onClick={confirmDelete} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Add Address Modal */}
            <Dialog 
              open={addressModalOpen} 
              onClose={() => setAddressModalOpen(false)} 
              maxWidth="sm" 
              fullWidth 
              sx={{ 
                '& .MuiDialog-paper': { borderRadius: '20px' },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#FF6200' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6200' }
              }}
            >
              <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>
                {selectedAddressId ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogContent dividers>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={fetchCurrentLocation} 
                  disabled={isFetchingLocation}
                  startIcon={isFetchingLocation ? <CircularProgress size={16} /> : <MyLocationIcon />}
                  sx={{ mb: 3, py: 1.5, color: '#388e3c', borderColor: '#c8e6c9', bgcolor: '#e8f5e9', '&:hover': { bgcolor: '#c8e6c9', borderColor: '#a5d6a7' }, textTransform: 'none', fontWeight: 600, borderRadius: '12px' }}
                >
                  {isFetchingLocation ? 'Locating...' : 'Use Current Location Coordinates'}
                </Button>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{xs:12}}>
                    <TextField fullWidth label="Address Label (e.g., Home, Office)" value={addressForm.addressLabel} onChange={(e) => setAddressForm({...addressForm, addressLabel: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <TextField fullWidth label="Street Name" value={addressForm.streetName} onChange={(e) => setAddressForm({...addressForm, streetName: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <TextField fullWidth multiline rows={2} label="Full Address" value={addressForm.fullAddress} onChange={(e) => setAddressForm({...addressForm, fullAddress: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField fullWidth label="City" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12, sm:6}}>
                    <TextField fullWidth label="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <FormControlLabel control={<Checkbox checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }} />} label="Set as default address" />
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField fullWidth label="Latitude (Optional)" value={addressForm.latitude} onChange={(e) => setAddressForm({...addressForm, latitude: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField fullWidth label="Longitude (Optional)" value={addressForm.longitude} onChange={(e) => setAddressForm({...addressForm, longitude: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 600, fontSize: '14px', color: '#666', mb: 1 }}>Service Radius: {addressForm.serviceRadiusKm} km</Typography>
                    <Slider
                      value={Number(addressForm.serviceRadiusKm) || 10}
                      onChange={(e, newValue) => setAddressForm({...addressForm, serviceRadiusKm: newValue as number})}
                      min={5}
                      max={50}
                      step={5}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ color: '#FF6200', '& .MuiSlider-thumb': { '&:hover, &.Mui-focusVisible': { boxShadow: '0px 0px 0px 8px rgba(255, 98, 0, 0.16)' } } }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, px: 3 }}>
                <Button onClick={() => setAddressModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                <Button onClick={handleSaveAddress} disabled={savingAddress} variant="contained" sx={{ background: '#FF6200 !important', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', px: 3 }}>
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );

      case 'bank':
        return (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, fontSize: '20px', color: '#1A1A1A' }}>Bank Details</Typography>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '13px', mt: 0.5 }}>Manage your accounts for receiving payments.</Typography>
              </Box>
              <Button variant="outlined" onClick={() => { setSelectedBankId(null); setBankForm({ paymentMethod: 'BANK', accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', accountType: 'SAVINGS', upiId: '', isPrimary: false }); setBankModalOpen(true); }} sx={{ color: '#FF6200', borderColor: '#FF6200', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { borderColor: '#F05A00', bgcolor: '#FFF0E6' } }}>
                Add New Account
              </Button>
            </Box>

            {bankAccounts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f8f9fa', borderRadius: '16px', border: '1px dashed #ddd' }}>
                <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontWeight: 500 }}>No bank accounts added yet.</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {bankAccounts.map((bank, index) => (
                  <Grid size={{xs:12,sm:6}} key={index}>
                    <Card sx={{ borderRadius: '16px', border: '1px solid #eee', boxShadow: 'none', position: 'relative' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                          <Typography component="div" sx={{ fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccountBalanceIcon sx={{ color: '#FF6200', fontSize: 20 }} />
                            {bank.paymentMethod === 'UPI' ? 'UPI Account' : (bank.bankName || 'Bank Account')}
                            {bank.isPrimary && (
                              <Chip label="Primary" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: '10px', height: 20 }} />
                            )}
                          </Typography>
                          <Box>
                            <IconButton size="small" onClick={() => handleEditBankClick(bank)} sx={{ color: '#666', '&:hover': { color: '#FF6200' } }}>
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteBankClick(bank.id)} sx={{ color: '#666', '&:hover': { color: '#F44336' } }}>
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        {bank.paymentMethod === 'UPI' ? (
                          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#444', fontSize: '14px', mt: 1 }}>
                            UPI ID: {bank.upiId}
                          </Typography>
                        ) : (
                          <>
                            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#444', fontSize: '14px', mt: 1 }}>
                              A/c Name: {bank.accountHolderName}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>
                              A/c No: {bank.accountNumber ? `••••${bank.accountNumber.slice(-4)}` : ''}
                            </Typography>
                            <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px' }}>
                              IFSC: {bank.ifscCode}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Delete Bank Confirmation */}
            <Dialog open={bankDeleteConfirmOpen} onClose={() => setBankDeleteConfirmOpen(false)} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
              <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>Confirm Delete</DialogTitle>
              <DialogContent dividers>
                <Typography>Are you sure you want to delete this bank account? This action cannot be undone.</Typography>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setBankDeleteConfirmOpen(false)} sx={{ color: '#666', fontWeight: 600 }}>Cancel</Button>
                <Button onClick={confirmBankDelete} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}>Delete</Button>
              </DialogActions>
            </Dialog>

            {/* Add Bank Modal */}
            <Dialog 
              open={bankModalOpen} 
              onClose={() => setBankModalOpen(false)} 
              maxWidth="sm" 
              fullWidth 
              sx={{ 
                '& .MuiDialog-paper': { borderRadius: '20px' },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#FF6200' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FF6200' }
              }}
            >
              <DialogTitle sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800 }}>
                {selectedBankId ? 'Edit Bank Account' : 'Add New Bank Account'}
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid size={{xs:12}}>
                    <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                      <InputLabel>Payment Method</InputLabel>
                      <Select 
                        value={bankForm.paymentMethod} 
                        onChange={(e) => setBankForm({...bankForm, paymentMethod: e.target.value})} 
                        label="Payment Method"
                      >
                        <MenuItem value="BANK">Bank Transfer</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {bankForm.paymentMethod === 'UPI' ? (
                    <Grid size={{xs:12}}>
                      <TextField fullWidth label="UPI ID (e.g. name@okhdfcbank)" value={bankForm.upiId} onChange={(e) => setBankForm({...bankForm, upiId: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Grid>
                  ) : (
                    <>
                      <Grid size={{xs:12}}>
                        <TextField fullWidth label="Account Holder Name" value={bankForm.accountHolderName} onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      </Grid>
                      <Grid size={{xs:12, sm:6}}>
                        <TextField fullWidth label="Account Number" value={bankForm.accountNumber} onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      </Grid>
                      <Grid size={{xs:12, sm:6}}>
                        <TextField fullWidth label="IFSC Code" value={bankForm.ifscCode} onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      </Grid>
                      <Grid size={{xs:12, sm:6}}>
                        <TextField fullWidth label="Bank Name" value={bankForm.bankName} onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})} variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      </Grid>
                      <Grid size={{xs:12, sm:6}}>
                        <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                          <InputLabel>Account Type</InputLabel>
                          <Select 
                            value={bankForm.accountType} 
                            onChange={(e) => setBankForm({...bankForm, accountType: e.target.value})} 
                            label="Account Type"
                          >
                            <MenuItem value="SAVINGS">Savings</MenuItem>
                            <MenuItem value="CURRENT">Current</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  <Grid size={{xs:12}}>
                    <FormControlLabel control={<Checkbox checked={bankForm.isPrimary} onChange={(e) => setBankForm({...bankForm, isPrimary: e.target.checked})} sx={{ color: '#FF6200', '&.Mui-checked': { color: '#FF6200' } }} />} label="Set as primary payment method" />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, px: 3 }}>
                <Button onClick={() => setBankModalOpen(false)} sx={{ color: '#666', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                <Button onClick={handleSaveBank} disabled={savingBank} variant="contained" sx={{ background: '#FF6200 !important', color: 'white', textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', px: 3 }}>
                  {savingBank ? 'Saving...' : 'Save Account'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={() => router.back()} 
          sx={{ bgcolor: 'white', border: '1px solid #eee', width: 44, height: 44, '&:hover': { bgcolor: '#f8f9fa' } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A' }}>
            Edit Profile
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-outfit), sans-serif', color: '#666', fontSize: '14px', mt: 0.5 }}>
            Manage your professional account details
          </Typography>
        </Box>
      </Box>

      {/* Main Split Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        
        {/* Sidebar Navigation */}
        <Box sx={{ width: { xs: '100%', lg: 280 }, flexShrink: 0 }}>
          <Paper sx={{ p: 2, borderRadius: '24px', border: '1px solid #eee', boxShadow: 'none', position: 'sticky', top: 24 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'contained' : 'text'}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('profileActiveTab', tab.id);
                    }
                  }}
                  startIcon={tab.icon}
                  disableElevation
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2.5, py: 1.5,
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'var(--font-outfit), sans-serif',
                    fontSize: '14px',
                    color: activeTab === tab.id ? '#FF6200' : '#475569',
                    background: activeTab === tab.id ? '#FFF0E6 !important' : 'transparent',
                    '&:hover': {
                      background: activeTab === tab.id ? '#FFF0E6 !important' : '#F8FAFC !important',
                      color: activeTab === tab.id ? '#FF6200' : '#0F172A',
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Tab Content Area */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 0,
          '& .MuiOutlinedInput-root.Mui-focused fieldset': {
            borderColor: '#FF6200',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#FF6200',
          }
        }}>
          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid #eee', boxShadow: 'none', minHeight: '600px' }}>
            {renderTabContent()}
          </Paper>
        </Box>

      </Box>
    </Box>
  );
}
