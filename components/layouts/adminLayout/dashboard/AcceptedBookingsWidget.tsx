'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Skeleton, 
  Box, 
  Button 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import { getAllBookingsByAdminAPI } from '@/api/bookingControllers';

export default function AcceptedBookingsWidget() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      try {
        const res = await getAllBookingsByAdminAPI(1, 5, 'ACCEPTED', undefined, 'POOJA');
        if (res.success && res.data?.bookings) {
          setBookings(res.data.bookings);
        } else if (res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
          setBookings(list);
        }
      } catch (err) {
        console.error('Error fetching accepted bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedBookings();
  }, []);

  const formatDate = (val: any) => {
    if (!val) return 'Date TBD';
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Date TBD';
    return `${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatAmount = (booking: any) => {
    const amt = booking.finalAmount ?? booking.finalamount ?? booking.servicePrice ?? booking.totalAmount;
    if (amt !== undefined && amt !== null && !isNaN(Number(amt)) && Number(amt) > 0) {
      return `₹${Math.round(Number(amt)).toLocaleString('en-IN')}`;
    }
    return '-';
  };

  return (
    <Paper 
      sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 }, 
        borderRadius: { xs: '16px', sm: '20px' }, 
        border: '1px solid #EFEAE3', 
        boxShadow: '0 4px 20px rgba(44, 24, 16, 0.04)', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 2.5 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: FONTS.OUTFIT, 
            fontWeight: 800, 
            color: '#1A1A1A',
            fontSize: { xs: '16px', sm: '18px' },
          }}
        >
          Accepted Bookings
        </Typography>
        <Button 
          variant="text" 
          size="small"
          onClick={() => router.push('/admin/bookings?status=ACCEPTED')}
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: '11px !important' }} />}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 700, 
            fontSize: '13px',
            fontFamily: FONTS.OUTFIT,
            color: COLORS.PRIMARY,
            p: 0.5,
            '&:hover': { bgcolor: 'rgba(255, 98, 0, 0.06)' }
          }}
        >
          View All
        </Button>
      </Box>

      {/* 1. Mobile Cards View (Visible on xs screens) */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
        {loading ? (
          Array.from(new Array(3)).map((_, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 1.8, 
                borderRadius: '14px', 
                bgcolor: '#FAF8F5', 
                border: '1px solid #F0ECE4' 
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Skeleton width={80} height={20} />
                <Skeleton width={60} height={20} />
              </Box>
              <Skeleton width="70%" height={24} />
              <Skeleton width="50%" height={18} />
            </Box>
          ))
        ) : bookings.length > 0 ? (
          bookings.map((booking, idx) => {
            const customerName = booking.customer?.firstName 
              ? `${booking.customer.firstName} ${booking.customer.lastName || ''}`.trim() 
              : 'Unknown';
            const purohitName = booking.purohit?.user 
              ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ''}`.trim() 
              : 'Pending';
            const serviceTitle = 
              booking.service?.name || 
              booking.serviceName || 
              booking.title || 
              'Pooja Service';
            
            return (
              <Box
                key={idx}
                onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                sx={{
                  p: 1.8,
                  borderRadius: '14px',
                  bgcolor: '#FAF8F5',
                  border: '1px solid #EFEAE3',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:active': { transform: 'scale(0.98)', bgcolor: '#F5F0E8' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Typography 
                    sx={{ 
                      fontFamily: FONTS.OUTFIT, 
                      fontWeight: 800, 
                      fontSize: '13.5px', 
                      color: COLORS.PRIMARY 
                    }}
                  >
                    B-{booking.id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '13.5px', color: '#0F172A', fontFamily: FONTS.OUTFIT }}>
                      {formatAmount(booking)}
                    </Typography>
                    <Chip 
                      label={booking.status || 'ACCEPTED'} 
                      size="small" 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '10.5px',
                        height: 20,
                        borderRadius: '6px',
                        bgcolor: '#E8F5E9', 
                        color: '#2E7D32',
                        border: '1px solid #C8E6C9',
                      }} 
                    />
                  </Box>
                </Box>

                <Typography 
                  sx={{ 
                    fontFamily: FONTS.OUTFIT, 
                    fontWeight: 700, 
                    fontSize: '14.5px', 
                    color: '#0F172A',
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {serviceTitle}
                </Typography>

                <Typography 
                  sx={{ 
                    fontFamily: FONTS.PRIMARY, 
                    color: '#64748B', 
                    fontSize: '12px',
                    mb: 0.8,
                  }}
                >
                  Customer: <strong style={{ color: '#334155' }}>{customerName}</strong> • Purohit: <strong style={{ color: purohitName === 'Pending' ? '#ED6C02' : '#334155' }}>{purohitName}</strong>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#888' }}>
                  <AccessTimeIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '11.5px', color: '#64748B' }}>
                    {formatDate(booking.scheduledAt)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#94A3B8', fontFamily: FONTS.OUTFIT, fontSize: '14px' }}>
              No accepted bookings at this time
            </Typography>
          </Box>
        )}
      </Box>

      {/* 2. Desktop/Tablet Table View (Visible on sm+ screens) */}
      <TableContainer sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '2px solid #EFEAE3', fontWeight: 700, color: '#88776D', fontFamily: FONTS.OUTFIT, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', pb: 1.5 } }}>
              <TableCell sx={{ pl: 1 }}>Booking ID</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right" sx={{ pr: 1 }}>Amount / Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ pl: 1 }}><Skeleton variant="text" width={75} /></TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} height={22} />
                    <Skeleton variant="text" width={220} height={18} />
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell align="right" sx={{ pr: 1 }}>
                    <Skeleton variant="rounded" width={70} height={22} sx={{ display: 'inline-block', mb: 0.5 }} />
                    <Skeleton variant="rounded" width={80} height={20} sx={{ display: 'inline-block' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking, idx) => {
                const customerName = booking.customer?.firstName 
                  ? `${booking.customer.firstName} ${booking.customer.lastName || ''}`.trim() 
                  : 'Unknown';
                const purohitName = booking.purohit?.user 
                  ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ''}`.trim() 
                  : 'Pending';
                const serviceTitle = 
                  booking.service?.name || 
                  booking.serviceName || 
                  booking.title || 
                  'Pooja Service';
                
                return (
                  <TableRow 
                    key={idx} 
                    onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      '& td': { borderBottom: '1px solid #F5F0E8', fontFamily: FONTS.OUTFIT, transition: 'all 0.2s', py: 1.8 },
                      '&:hover td': { bgcolor: '#FAF5EE' }
                    }}
                  >
                    <TableCell sx={{ pl: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: COLORS.PRIMARY, fontSize: '13.5px', fontFamily: FONTS.OUTFIT }}>
                        B-{booking.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', lineHeight: 1.3, mb: 0.3 }}>
                        {serviceTitle}
                      </Typography>
                      <Typography sx={{ color: '#64748B', fontSize: '12px', fontFamily: FONTS.PRIMARY }}>
                        Customer: <strong style={{ color: '#334155' }}>{customerName}</strong> • Purohit: <strong style={{ color: purohitName === 'Pending' ? '#ED6C02' : '#334155' }}>{purohitName}</strong>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: '12.5px', color: '#475569', fontWeight: 500, fontFamily: FONTS.OUTFIT }}>
                          {formatDate(booking.scheduledAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.4 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#0F172A', fontFamily: FONTS.OUTFIT }}>
                          {formatAmount(booking)}
                        </Typography>
                        <Chip 
                          label={booking.status || 'ACCEPTED'} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, 
                            borderRadius: '6px',
                            bgcolor: '#E8F5E9', 
                            color: '#2E7D32',
                            border: '1px solid #C8E6C9',
                            height: 20,
                            fontSize: '10.5px',
                          }} 
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94A3B8', fontFamily: FONTS.OUTFIT, border: 'none' }}>
                  No accepted bookings at this time
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
