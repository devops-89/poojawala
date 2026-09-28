"use client";

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface BankDetailsTabProps {
  bankAccounts: any[];
  onAddNew: () => void;
  onEdit: (bank: any) => void;
  onDelete: (id: number) => void;
}

export const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  bankAccounts,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              fontSize: "22px",
              color: "#1A1A1A",
              mb: 0.5,
            }}
          >
            Bank Details
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Manage your accounts for receiving ceremony payouts.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={onAddNew}
          sx={{
            borderColor: "#FF6200",
            color: "#FF6200",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 0.8,
            fontFamily: "var(--font-outfit), sans-serif",
            "&:hover": {
              borderColor: "#E65800",
              bgcolor: "#FFF8F2",
            },
          }}
        >
          Add Bank Account
        </Button>
      </Box>

      {bankAccounts.length === 0 ? (
        <Card
          variant="outlined"
          sx={{ borderRadius: "14px", p: 4, textAlign: "center", borderStyle: "dashed" }}
        >
          <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#666" }}>
            No bank accounts added yet. Click "Add Bank Account" to add your payout details.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {bankAccounts.map((bank: any) => (
            <Grid size={{ xs: 12, sm: 6 }} key={bank.id} sx={{ display: "flex" }}>
              <Card
                variant="outlined"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#FFF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between",
                    p: 2.5,
                    "&:last-child": { pb: 2.5 },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccountBalanceIcon sx={{ color: "#FF6200", fontSize: 20 }} />
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "#1A1A1A",
                          }}
                        >
                          {bank.paymentMethod === "UPI"
                            ? `UPI - ${bank.upiId}`
                            : bank.bankName || "Bank Account"}
                        </Typography>
                        {bank.isPrimary && (
                          <Chip
                            label="Primary"
                            size="small"
                            sx={{
                              bgcolor: "#E8F5E9",
                              color: "#2E7D32",
                              fontWeight: 700,
                              fontSize: "11px",
                              height: "22px",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(bank)}
                            sx={{ color: "#64748b", "&:hover": { color: "#1E293B" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(bank.id)}
                            sx={{ color: "#64748b", "&:hover": { color: "#ef4444" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {bank.paymentMethod === "UPI" ? (
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          color: "#64748b",
                          fontSize: "13px",
                          mt: 1,
                        }}
                      >
                        UPI ID: <span style={{ fontWeight: 600, color: "#1E293B" }}>{bank.upiId}</span>
                      </Typography>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            color: "#1E293B",
                            fontSize: "14px",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          {bank.accountHolderName}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          A/C: {bank.accountNumber} • IFSC: {bank.ifscCode}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
