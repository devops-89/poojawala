'use client';
import { Box, Button, Container, Grid, Paper, TextField, Typography, CircularProgress, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { useLoaderStore } from '@/stores/loaderStore';
import { verifyOtpAPI, registerPurohitAPI, sendOtpAPI } from '@/api/userControllers';
import Link from 'next/link';

export default function VerifyOtpContent() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      if (signupData) {
        const res = await sendOtpAPI({ phone: signupData.phone, email: signupData.email, role: 'CUSTOMER' });
        if (res.success || res.statusCode === 200) {
          showSnackbar('OTP resent successfully!', 'success');
          setResendTimer(30);
        } else {
          showSnackbar(res.message || 'Failed to resend OTP', 'error');
        }
      }
    } catch (err: any) {
      showSnackbar(err?.response?.data?.message || err.message || 'Failed to resend OTP', 'error');
    }
  };

  useEffect(() => {
    const data = sessionStorage.getItem('signupData');
    if (!data) {
      showSnackbar('Session expired. Please sign up again.', 'error');
      router.push('/sign-up');
    } else {
      setSignupData(JSON.parse(data));
    }
  }, [router, showSnackbar]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    // Take only the last character if multiple are pasted/typed
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showSnackbar('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      showLoader('Verifying OTP...');
      
      const verifyRes = await verifyOtpAPI({ 
        phone: signupData.phone, 
        otp: otpValue,
        role: 'CUSTOMER'
      });

      if (verifyRes.success || verifyRes.statusCode === 200) {
        showSnackbar('OTP verified successfully! Creating account...', 'success');
        
        // Register user
        showLoader('Creating your account...');
        const formData = new FormData();
        Object.keys(signupData).forEach(key => {
          formData.append(key, signupData[key]);
        });
        
        const registerRes = await registerPurohitAPI(formData); // This hits /users/register which works for both roles
        
        if (registerRes.success || registerRes.statusCode === 200 || registerRes.statusCode === 201) {
          sessionStorage.removeItem('signupData');
          
          // Save tokens and user data returned by register API
          if (registerRes.csrfToken) {
            sessionStorage.setItem('csrfToken', registerRes.csrfToken);
          }
          if (registerRes.user) {
            sessionStorage.setItem('user', JSON.stringify(registerRes.user));
            sessionStorage.setItem('role', registerRes.user.role);
          }
          if (registerRes.accessToken) {
            sessionStorage.setItem('accessToken', registerRes.accessToken);
          }
          if (registerRes.refreshToken) {
            sessionStorage.setItem('refreshToken', registerRes.refreshToken);
          }
          
          showSnackbar('Account created successfully!', 'success');
          router.push('/customer/dashboard');
        } else {
          showSnackbar(registerRes.message || 'Failed to create account', 'error');
        }
      } else {
        showSnackbar(verifyRes.message || 'Invalid OTP', 'error');
      }
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || error.message || 'Verification failed', 'error');
    } finally {
      hideLoader();
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#FFFDF9', 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decor */}
      <Box 
        component="img"
        src="/images/home/chakra.webp"
        alt="Chakra Decor Left"
        sx={{ position: 'absolute', top: -150, left: -150, width: '500px', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }}
      />
      <Box 
        component="img"
        src="/images/home/chakraright.webp"
        alt="Chakra Decor Right"
        sx={{ position: 'absolute', bottom: -150, right: -150, width: '500px', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 0 } }}>
        <Grid container spacing={0} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 10 }}>
            <Paper 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid #FFE0D0'
              }}
            >
              {/* Left Side Branding */}
              <Box 
                sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #FF6200 0%, #FF9100 100%)',
                  p: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <Typography variant="h3" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, mb: 2 }}>
                  Verify Email
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', lineHeight: 1.6, opacity: 0.9, mb: 4 }}>
                  Please enter the 6-digit one-time password sent to your email address to securely complete your registration.
                </Typography>
                <Box component="img" src="/images/home/poojaPackages/dhanush.webp" sx={{ width: '250px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
              </Box>

              {/* Right Side Form */}
              <Box sx={{ flex: 1.2, p: { xs: 3, md: 5 }, bgcolor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Enter OTP
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', mb: 4 }}>
                  Code sent to <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{signupData?.email || 'your email'}</span>
                </Typography>

                <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, justifyContent: 'space-between', mb: 4 }}>
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      value={digit}
                      inputRef={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      variant="outlined"
                      slotProps={{ 
                        htmlInput: { 
                          maxLength: 1, 
                          style: { textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, padding: '12px 8px' } 
                        } 
                      }}
                      sx={{
                        width: { xs: '40px', sm: '48px' },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#FF6200',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>

                <Button 
                  onClick={handleVerify}
                  fullWidth 
                  disabled={isSubmitting || otp.join('').length !== 6}
                  variant="contained" 
                  sx={{
                    background: '#FF6200',
                    color: 'white',
                    py: 1.5,
                    borderRadius: '31px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '16px',
                    boxShadow: '0 8px 20px rgba(255, 98, 0, 0.3)',
                    '&:hover': {
                      background: '#E65800',
                      boxShadow: '0 8px 25px rgba(255, 98, 0, 0.4)',
                    }
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Verify & Create Account'}
                </Button>
                
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', textAlign: 'center', mt: 4, fontSize: '14px' }}>
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span style={{ color: '#999', fontWeight: 600 }}>Resend in {resendTimer}s</span>
                  ) : (
                    <MuiLink 
                      component="button"
                      onClick={handleResendOtp} 
                      sx={{ color: '#FF6200', fontWeight: 700, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}
                    >
                      Resend
                    </MuiLink>
                  )}
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', textAlign: 'center', mt: 1, fontSize: '14px' }}>
                  <Link href="/sign-up" style={{ color: '#64748b', textDecoration: 'none' }}>
                    ← Back to Sign Up
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
