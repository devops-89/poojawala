'use client';

import React from 'react';
import {
  Paper,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';

export interface Column<T = any> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: number | string;
  width?: number | string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface TabOption {
  id: string;
  label: string;
}

export interface AdminDataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  
  // Tabs props (optional)
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (newTab: string) => void;
  
  // Table Styling & Customization
  minWidth?: number | string;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
}

export default function AdminDataTable<T = any>({
  columns,
  data,
  isLoading = false,
  totalCount,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  tabs,
  activeTab,
  onTabChange,
  minWidth = 1000,
  emptyMessage = 'No data found matching your criteria.',
  keyExtractor,
}: AdminDataTableProps<T>) {
  const effectiveCount = totalCount !== undefined ? totalCount : data.length;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Optional Tabs Bar */}
      {tabs && tabs.length > 0 && (
        <Tabs
          value={activeTab ?? tabs[0]?.id}
          onChange={(_, val) => onTabChange?.(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            pt: 1,
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTabs-indicator': { backgroundColor: '#FF6200' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b',
              minWidth: 100,
              fontFamily: 'var(--font-outfit), sans-serif',
            },
            '& .MuiTab-root.Mui-selected': { color: '#FF6200' },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      )}

      {/* Table Container */}
      <TableContainer>
        <Table sx={{ minWidth }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    py: 2,
                    minWidth: col.minWidth,
                    width: col.width,
                    fontFamily: 'var(--font-outfit), sans-serif',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress sx={{ color: '#FF6200' }} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontFamily: 'var(--font-outfit), sans-serif',
                    }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => {
                const rowKey = keyExtractor
                  ? keyExtractor(item, index)
                  : (item as any)?.id || (item as any)?.orderId || index;

                return (
                  <TableRow
                    key={rowKey}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#f8fafc' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align || 'left'}>
                        {col.render
                          ? col.render(item, index)
                          : (item as any)?.[col.id] ?? '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Bar */}
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={effectiveCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => {
            onRowsPerPageChange?.(parseInt(e.target.value, 10));
          }}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'var(--font-outfit), sans-serif',
            },
          }}
        />
      )}
    </Paper>
  );
}
