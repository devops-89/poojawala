'use client';
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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

import { Column, TabOption, AdminDataTableProps } from "@/utils/types";
export type { Column, TabOption, AdminDataTableProps };

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
            '& .MuiTabs-indicator': { backgroundColor: COLORS.PRIMARY },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b',
              minWidth: 100,
              fontFamily: FONTS.OUTFIT,
            },
            '& .MuiTab-root.Mui-selected': { color: COLORS.PRIMARY },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      )}

      {/* Table Container */}
      <TableContainer>
        <Table sx={{ minWidth, tableLayout: 'fixed' }}>
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
                    fontFamily: FONTS.OUTFIT,
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
                  <CircularProgress sx={{ color: COLORS.PRIMARY }} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontFamily: FONTS.OUTFIT,
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
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{
                          width: col.width,
                          minWidth: col.minWidth,
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
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
          slotProps={{
            select: {
              MenuProps: {
                variant: "menu",
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                disableScrollLock: true,
              },
            },
          }}
          sx={{
            borderTop: '1px solid #e2e8f0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: FONTS.OUTFIT,
            },
          }}
        />
      )}
    </Paper>
  );
}
