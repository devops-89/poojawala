'use client';
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NextLink from 'next/link';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

export interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string;
  disabled?: boolean;
}

export interface AdminTableActionMenuProps {
  actions: (ActionMenuItem | null | undefined | false)[];
  buttonSize?: number;
  align?: 'left' | 'right' | 'center';
}

export default function AdminTableActionMenu({
  actions,
  buttonSize = 32,
  align = 'right',
}: AdminTableActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const validActions = actions.filter(
    (action): action is ActionMenuItem => Boolean(action)
  );

  if (validActions.length === 0) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="Actions menu"
        sx={{
          width: buttonSize,
          height: buttonSize,
          color: open ? COLORS.PRIMARY : '#64748b',
          bgcolor: open ? '#FFF0E6' : '#f8fafc',
          border: '1px solid',
          borderColor: open ? '#fed7aa' : '#e2e8f0',
          borderRadius: '8px',
          '&:hover': {
            color: COLORS.PRIMARY,
            bgcolor: '#FFF0E6',
            borderColor: '#fed7aa',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: align === 'left' ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: align === 'left' ? 'left' : 'right',
        }}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: 150,
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
              p: 0.5,
            },
          },
        }}
      >
        {validActions.map((item, index) => {
          const isDanger =
            item.color === '#ef4444' || item.label.toLowerCase().includes('delete');
          const defaultColor = isDanger ? '#ef4444' : '#334155';
          const itemColor = item.color || defaultColor;

          return (
            <MenuItem
              key={index}
              disabled={item.disabled}
              component={item.href ? (NextLink as any) : undefined}
              href={item.href || undefined}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                handleClose();
                if (item.onClick) {
                  item.onClick();
                }
              }}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: '8px',
                my: 0.2,
                color: itemColor,
                '&:hover': {
                  bgcolor: isDanger ? '#fef2f2' : '#f8fafc',
                  color: isDanger ? '#dc2626' : COLORS.PRIMARY,
                  '& .MuiListItemIcon-root': {
                    color: isDanger ? '#dc2626' : COLORS.PRIMARY,
                  },
                },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 28,
                  color: itemColor,
                  '& svg': { fontSize: 18 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'inherit',
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
