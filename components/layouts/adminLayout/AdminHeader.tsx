'use client';
import React from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <Box 
      component="header" 
      sx={{ 
        display: 'flex', 
        height: { xs: '64px', sm: '80px' }, 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 30, 
        justifyContent: 'space-between', 
        bgcolor: '#F8FAFC', 
        borderBottom: '1px solid #e2e8f0', 
        px: { xs: 2, sm: 4 }, 
        gap: 1.5 
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ 
            display: { lg: 'none' }, 
            color: '#475569', 
            borderRadius: '8px',
            p: 1,
            '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' } 
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
