'use client';
import { getPurohitsAPI } from '@/api/userControllers';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
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
        // Fetch page 1, limit 3, status PENDING
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
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-outfit), sans-serif', fontWeight: 800, color: '#1A1A1A' }}>
            Pending Approvals
          </Typography>
          <Chip label="Action Needed" size="small" sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
        </Box>
        <Button 
          variant="text" 
          size="small"
          onClick={() => router.push('/admin/purohits?status=Pending Approval')}
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
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          Array.from(new Array(3)).map((_, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))
        ) : purohits.length > 0 ? (
          purohits.map((purohit, idx) => (
            <React.Fragment key={idx}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar src={purohit.profileImage} sx={{ width: 48, height: 48, bgcolor: '#f5f5f5', color: '#999' }}>
                  <SupervisorAccountIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 700, color: '#1A1A1A', fontFamily: 'var(--font-outfit), sans-serif', fontSize: '15px' }}>
                    {purohit.firstName} {purohit.lastName}
                  </Typography>
                  <Typography noWrap sx={{ color: '#666', fontSize: '13px' }}>
                    {purohit.email || purohit.phone || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              {idx < purohits.length - 1 && <Divider sx={{ my: 0.5 }} />}
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: '#999', fontFamily: 'var(--font-outfit), sans-serif' }}>No pending approvals</Typography>
          </Box>
        )}
      </Box>

    </Paper>
  );
}
