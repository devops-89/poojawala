'use client';
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAllBookingsByAdminAPI } from '@/api/bookingControllers';

export default function AcceptedBookingsWidget() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      try {
        // Fetch page 1, limit 5, status ACCEPTED
        const res = await getAllBookingsByAdminAPI(1, 5, 'ACCEPTED');
        if (res.success && res.data?.bookings) {
          setBookings(res.data.bookings);
        } else if (res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error('Error fetching accepted bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedBookings();
  }, []);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A' }}>
          Accepted Bookings
        </Typography>
        <Button 
          variant="text" 
          size="small"
          onClick={() => router.push('/admin/bookings?status=ACCEPTED')}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 700, 
            fontFamily: 'var(--font-outfit), sans-serif',
            color: '#FF6200',
            '&:hover': { bgcolor: 'rgba(255, 98, 0, 0.05)' }
          }}
        >
          View All
        </Button>
      </Box>
      <TableContainer sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '2px solid #eee', fontWeight: 700, color: '#666', fontFamily: 'var(--font-outfit), sans-serif', pb: 1.5 } }}>
              <TableCell>Booking ID</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(3)).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rounded" width={80} height={24} sx={{ display: 'inline-block' }} /></TableCell>
                </TableRow>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking, idx) => {
                const customerName = booking.customer?.firstName ? `${booking.customer.firstName} ${booking.customer.lastName || ''}`.trim() : 'N/A';
                const purohitName = booking.purohit?.user ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ''}`.trim() : 'Pending';
                
                return (
                  <TableRow 
                    key={idx} 
                    onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      '& td': { borderBottom: '1px solid #f5f5f5', fontFamily: 'var(--font-outfit), sans-serif', color: '#1A1A1A', transition: 'all 0.2s' },
                      '&:hover td': { bgcolor: '#fafafa' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>B-{booking.id}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>{booking.service?.name}</Typography>
                      <Typography sx={{ color: '#666', fontSize: '12px' }}>{purohitName} • {customerName}</Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}, {new Date(booking.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={booking.status || 'ACCEPTED'} 
                        size="small" 
                        sx={{ 
                          fontWeight: 600, borderRadius: '6px',
                          bgcolor: '#E8F5E9',
                          color: '#2E7D32'
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#999', fontFamily: 'var(--font-outfit), sans-serif', border: 'none' }}>
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
