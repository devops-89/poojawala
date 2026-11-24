'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
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
    <Box sx={{ mb: { xs: 3.5, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: { xs: "19px", sm: "24px", md: "26px" },
            color: '#1e293b',
          }}
        >
          Recent Bookings
        </Typography>
        <Button
          component={NextLink}
          href="/customer/bookings"
          endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
          sx={{
            color: COLORS.PRIMARY,
            textTransform: 'none',
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            fontSize: { xs: "13px", sm: "14px" },
            whiteSpace: "nowrap",
            minWidth: "auto",
            p: { xs: "4px 8px", sm: "6px 12px" },
            "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            View All Bookings
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            View All
          </Box>
        </Button>
      </Box>

      {recentBookings.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: '16px', textAlign: 'center', bgcolor: '#FFF', border: '1px dashed #EADCCF' }}>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#666', fontSize: '15px', fontWeight: 600 }}>
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
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    bgcolor: 'white',
                    border: '1.5px solid #EFE6D5',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    transition:
                      'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(184, 134, 11, 0.12)',
                      borderColor: '#D4B076',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        color: '#1e293b',
                        fontSize: { xs: '16.5px', sm: '18px' },
                      }}
                    >
                      {row.service?.name || 'Pooja Service'}
                    </Typography>
                    {(() => {
                      const statusStyle = getStatusColor(row.status);
                      return (
                        <Chip
                          label={statusLabel}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            fontSize: '11px',
                            height: '24px',
                            bgcolor: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        />
                      );
                    })()}
                  </Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, color: '#64748b', fontSize: '13.5px', mb: 2 }}>
                    Booking ID: <span style={{ fontWeight: 700, color: '#1e293b' }}>B-{row.id}</span>
                  </Typography>

                  <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>Date:</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', fontWeight: 700, color: '#333' }}>
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
                      <AccountBalanceWalletIcon sx={{ color: COLORS.PRIMARY, fontSize: 18 }} />
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>Amount:</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '14px', fontWeight: 800, color: '#333' }}>
                      {displayAmt}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      onClick={() => router.push(`/customer/bookings/${row.id}`)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: COLORS.PRIMARY,
                        borderColor: COLORS.PRIMARY,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontFamily: FONTS.OUTFIT,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#FFF5F0', borderColor: COLORS.PRIMARY },
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
