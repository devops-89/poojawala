'use client';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import { Box, Button, Card, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardRecentBookingsProps {
  recentBookings: any[];
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return { bg: '#d1fae5', text: '#059669' };
    case 'ACCEPTED':
      return { bg: '#dbeafe', text: '#2563eb' };
    case 'PENDING':
      return { bg: '#fef3c7', text: '#d97706' };
    case 'CANCELLED':
      return { bg: '#fee2e2', text: '#ef4444' };
    case 'ENROUTE':
      return { bg: '#e0e7ff', text: '#4f46e5' };
    case 'ARRIVED':
      return { bg: '#fce7f3', text: '#db2777' };
    case 'ONGOING':
      return { bg: '#e0f2fe', text: '#0284c7' };
    default:
      return { bg: '#f1f5f9', text: '#64748b' };
  }
};

export default function DashboardRecentBookings({ recentBookings }: DashboardRecentBookingsProps) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1e293b' }}>
          Recent Bookings
        </Typography>
        <Button
          component={NextLink}
          href="/customer/bookings"
          endIcon={<ArrowForwardIcon />}
          sx={{ color: '#FF6200', textTransform: 'none', fontWeight: 700 }}
        >
          View All Bookings
        </Button>
      </Box>

      {recentBookings.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: '12px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #ccc' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#666', fontSize: '16px', fontWeight: 600 }}>
            No recent bookings found.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {recentBookings.map((row) => {
            const statusLabel = row.status
              ? row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()
              : 'Pending';
            const amt = row.finalAmount ?? row.finalamount;
            const displayAmt = amt && Number(amt) > 0 ? `₹${amt}` : '-';

            return (
              <Grid size={{ xs: 12, md: 6 }} key={row.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: '16px',
                    p: 3,
                    bgcolor: 'white',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, color: '#1e293b', fontSize: '1.2rem' }}>
                      {row.service?.name || 'Puja Service'}
                    </Typography>
                    {(() => {
                      const statusStyle = getStatusColor(row.status);
                      return (
                        <Chip
                          label={statusLabel}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '11px',
                            height: '24px',
                            bgcolor: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        />
                      );
                    })()}
                  </Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', mb: 2 }}>
                    Booking ID: <span style={{ fontWeight: 700, color: '#1e293b' }}>B-{row.id}</span>
                  </Typography>

                  <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                      <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                      {row.scheduledAt
                        ? new Date(row.scheduledAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWalletIcon sx={{ color: '#FF6200', fontSize: 18 }} />
                      <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Amount:</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#333' }}>
                      {displayAmt}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      onClick={() => router.push(`/customer/bookings/${row.id}`)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#FF6200',
                        borderColor: '#FF6200',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#FFF5F0', borderColor: '#FF6200' },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
