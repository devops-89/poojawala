import { Box, Button, Chip, Grid, Paper, Typography } from '@mui/material';

interface Props {
  booking: any;
  formattedDate: string;
  formattedAmount: string;
  statusLabel: string;
  statusStr: string;
  isPaymentPending: boolean;
  isActive: boolean;
  onCancelClick?: () => void;
  onRescheduleClick?: () => void;
  onRaiseTicketClick?: () => void;
  onCompletePaymentClick?: () => void;
  isRedirectingPayment?: boolean;
}

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CancelIcon from '@mui/icons-material/Cancel';

export default function BookingDetailHero({ booking, formattedDate, formattedAmount, statusLabel, statusStr, isPaymentPending, isActive, onCancelClick, onRescheduleClick, onRaiseTicketClick, onCompletePaymentClick, isRedirectingPayment }: Props) {
  return (
    <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Grid container spacing={3} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Grid size={{xs:12,md:6}}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#FF6200', mb: 1 }}>
            Booking Details
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a', mb: 1 }}>
            {booking.service?.name ?? 'Service'}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: '#64748b', fontSize: '14px', mb: 3 }}>
            Scheduled on {formattedDate}
          </Typography>
          
          {(statusStr === 'PENDING' || statusStr === 'ACCEPTED') && (
            <Box 
              component="button"
              onClick={onRescheduleClick}
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 16px',
                fontSize: '0.8125rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '12px',
                fontFamily: '"DM Sans", sans-serif',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              <EditCalendarIcon sx={{ fontSize: 18 }} />
              Reschedule
            </Box>
          )}
        </Grid>
        
        <Grid size={{xs:12,md:6}} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
          <Chip 
            label={statusLabel} 
            sx={{ 
              fontWeight: 700, 
              fontFamily: '"DM Sans", sans-serif',
              bgcolor: statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED' ? '#E8F5E9' : statusStr === 'COMPLETED' ? '#E3F2FD' : statusStr === 'CANCELLED' ? '#FFEBEE' : '#FFF5F0',
              color: statusStr === 'ONGOING' || statusStr === 'ENROUTE' || statusStr === 'ARRIVED' ? '#2E7D32' : statusStr === 'COMPLETED' ? '#1565C0' : statusStr === 'CANCELLED' ? '#C62828' : '#FF6200'
            }} 
          />
          <Typography variant="h4" sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#0f172a' }}>
            {formattedAmount}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
             {isPaymentPending && (
               <Box 
                 component="button"
                 onClick={onCompletePaymentClick}
                 disabled={isRedirectingPayment}
                 sx={{ 
                   display: 'inline-flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '6px',
                   padding: '6px 16px',
                   fontSize: '0.8125rem',
                   border: 'none',
                   cursor: 'pointer',
                   transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                   backgroundColor: '#10b981',
                   color: '#ffffff',
                   borderRadius: '12px',
                   fontFamily: '"DM Sans", sans-serif',
                   textTransform: 'none',
                   fontWeight: 600,
                   opacity: isRedirectingPayment ? 0.7 : 1,
                   '&:hover': { backgroundColor: isRedirectingPayment ? '#10b981' : '#059669' }
                 }}
               >
                 <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />
                 {isRedirectingPayment ? 'Processing...' : 'Complete Payment'}
               </Box>
             )}
             <Box 
               component="button"
               onClick={onRaiseTicketClick}
               sx={{ 
                 display: 'inline-flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '6px',
                 padding: '6px 16px',
                 fontSize: '0.8125rem',
                 border: 'none',
                 cursor: 'pointer',
                 transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                 backgroundColor: '#f59e0b',
                 color: '#ffffff',
                 borderRadius: '12px',
                 fontFamily: '"DM Sans", sans-serif',
                 textTransform: 'none',
                 fontWeight: 600,
                 '&:hover': { backgroundColor: '#d97706' }
               }}
             >
               <SupportAgentIcon sx={{ fontSize: 18 }} />
               Raise Ticket
             </Box>
             {isActive && (
               <Box 
                 component="button"
                 onClick={onCancelClick}
                 sx={{ 
                   display: 'inline-flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '6px',
                   padding: '6px 16px',
                   fontSize: '0.8125rem',
                   border: 'none',
                   cursor: 'pointer',
                   transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                   backgroundColor: '#ef4444',
                   color: '#ffffff',
                   borderRadius: '12px',
                   fontFamily: '"DM Sans", sans-serif',
                   textTransform: 'none',
                   fontWeight: 600,
                   '&:hover': { backgroundColor: '#dc2626' }
                 }}
               >
                 <CancelIcon sx={{ fontSize: 18 }} />
                 Cancel Booking
               </Box>
             )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
