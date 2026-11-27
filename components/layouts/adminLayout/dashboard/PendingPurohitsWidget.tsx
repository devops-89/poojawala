'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { getPurohitsAPI } from '@/api/userControllers';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Avatar, Box, Button, Chip, Divider, Paper, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function PendingPurohitsWidget() {
  const router = useRouter();
  const [purohits, setPurohits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPurohits = async () => {
      try {
        // Fetch page 1, limit 5, status PENDING
        const res = await getPurohitsAPI(1, 5, undefined, 'PENDING');
        if (res.success && res.data?.data && Array.isArray(res.data.data)) {
          setPurohits(res.data.data);
        } else if (res.data && Array.isArray(res.data)) {
          setPurohits(res.data);
        }
      } catch (err) {
        console.error('Error fetching pending purohits', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPurohits();
  }, []);

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
          Pending Approvals
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => router.push('/admin/purohits?status=Pending')}
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

      {/* List */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {loading ? (
          Array.from(new Array(3)).map((_, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1 }}>
              <Skeleton variant="circular" width={44} height={44} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" height={22} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
          ))
        ) : purohits.length > 0 ? (
          purohits.map((purohit, idx) => (
            <Box
              key={idx}
              onClick={() => router.push(`/admin/purohits/${purohit.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: { xs: 1.2, sm: 1.4 },
                borderRadius: '12px',
                bgcolor: '#FAF8F5',
                border: '1px solid #EFEAE3',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#FFF5EE',
                  borderColor: '#FFD4BC',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <Avatar 
                src={purohit.profileImage} 
                sx={{ 
                  width: { xs: 40, sm: 44 }, 
                  height: { xs: 40, sm: 44 }, 
                  bgcolor: '#FFF0E6', 
                  color: COLORS.PRIMARY,
                  border: '1.5px solid #FFE0D0',
                }}
              >
                <SupervisorAccountIcon sx={{ fontSize: 22 }} />
              </Avatar>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                  noWrap 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1A1A1A', 
                    fontFamily: FONTS.OUTFIT, 
                    fontSize: { xs: '14px', sm: '14.5px' },
                    lineHeight: 1.2,
                  }}
                >
                  {purohit.firstName} {purohit.lastName}
                </Typography>
                <Typography 
                  noWrap 
                  sx={{ 
                    color: '#666', 
                    fontSize: { xs: '12px', sm: '12.5px' },
                    fontFamily: FONTS.OUTFIT,
                    mt: 0.2,
                  }}
                >
                  {purohit.email || purohit.phone || 'N/A'}
                </Typography>
              </Box>

              <Chip
                label="Review"
                size="small"
                sx={{
                  height: 24,
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  bgcolor: '#FFF0E6',
                  color: COLORS.PRIMARY,
                  border: '1px solid #FFD4BC',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography sx={{ color: '#999', fontFamily: FONTS.OUTFIT, fontSize: '14px' }}>
              No pending approvals at this time
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
