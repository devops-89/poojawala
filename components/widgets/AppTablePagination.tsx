import React from 'react';
import { Box, Typography, Select, MenuItem, Pagination, SxProps, Theme } from '@mui/material';
import { FONTS } from '@/utils/fonts';
import { COLORS } from '@/utils/enums';

interface AppTablePaginationProps {
  count: number;
  page: number; // 0-indexed
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  itemName?: string;
  showRowsPerPage?: boolean;
  sx?: SxProps<Theme>;
}

export default function AppTablePagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50],
  itemName = 'bookings',
  showRowsPerPage = true,
  sx,
}: AppTablePaginationProps) {
  if (count <= 0) return null;

  const startRecord = Math.min(page * rowsPerPage + 1, count);
  const endRecord = Math.min((page + 1) * rowsPerPage, count);
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2, sm: 3 },
        py: 1.8,
        borderTop: '1px solid #EFE6D5',
        bgcolor: '#FAF7F4',
        borderBottomLeftRadius: '22px',
        borderBottomRightRadius: '22px',
        flexWrap: 'wrap',
        gap: 2,
        ...sx,
      }}
    >
      {/* Left: Friendly Record Counter */}
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: '13.5px',
          color: '#7C6A60',
          fontWeight: 500,
        }}
      >
        Showing{' '}
        <strong style={{ color: '#2C1810', fontWeight: 700 }}>
          {startRecord}–{endRecord}
        </strong>{' '}
        of <strong style={{ color: '#2C1810', fontWeight: 700 }}>{count}</strong> {itemName}
      </Typography>

      {/* Right: Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        {showRowsPerPage && onRowsPerPageChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px', color: '#7C6A60' }}>
              Per page:
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              size="small"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#2C1810',
                height: '32px',
                borderRadius: '10px',
                bgcolor: '#FFFFFF',
                border: '1px solid #EFE6D5',
                '& .MuiSelect-select': { py: 0.5, px: 1.2 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover': { bgcolor: '#F5ECE3' },
              }}
            >
              {rowsPerPageOptions.map((opt) => (
                <MenuItem key={opt} value={opt} sx={{ fontFamily: FONTS.OUTFIT, fontSize: '12.5px' }}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, p) => onPageChange(p - 1)}
          shape="rounded"
          size="small"
          sx={{
            '& .MuiPaginationItem-root': {
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: '12.5px',
              color: '#5C4A40',
              borderRadius: '8px',
              minWidth: '30px',
              height: '30px',
              border: '1px solid #EFE6D5',
              bgcolor: '#FFFFFF',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FFF0E6',
                borderColor: '#FFD4BC',
                color: COLORS.PRIMARY,
              },
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              bgcolor: `${COLORS.PRIMARY} !important`,
              borderColor: COLORS.PRIMARY,
              color: '#FFFFFF !important',
              boxShadow: '0 2px 6px rgba(255, 98, 0, 0.25)',
            },
          }}
        />
      </Box>
    </Box>
  );
}
