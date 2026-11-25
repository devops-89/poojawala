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
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: { xs: 2.5, sm: 3.5 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "18px", sm: "20px" },
              color: "#1A1A1A",
              mb: 0.3,
            }}
          >
            Bank Details
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "12.5px", sm: "13.5px" },
            }}
          >
            Manage your accounts for receiving ceremony payouts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onAddNew}
          sx={{
            bgcolor: COLORS.PRIMARY,
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: "13px", sm: "13.5px" },
            px: 2.2,
            height: "38px",
            fontFamily: FONTS.OUTFIT,
            boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              bgcolor: COLORS.PRIMARY_DARK,
            },
          }}
        >
          Add Bank Account
        </Button>
      </Box>

      {bankAccounts.length === 0 ? (
        <Card
          elevation={0}
          sx={{ borderRadius: "14px", p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px dashed #EFE6D5", bgcolor: "#FFFDF9" }}
        >
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748B", fontSize: "14px" }}>
            No bank accounts added yet. Click "Add Bank Account" to add your payout details.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          {bankAccounts.map((bank: any) => (
            <Grid size={{ xs: 12, sm: 6 }} key={bank.id} sx={{ display: "flex" }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                  borderRadius: "14px",
                  border: "1px solid #EFE6D5",
                  bgcolor: "#FFFDF9",
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
                        <AccountBalanceIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 700,
                            fontSize: "16px",
                            color: COLORS.DARK,
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
                          fontFamily: FONTS.OUTFIT,
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
                            fontFamily: FONTS.OUTFIT,
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
                            fontFamily: FONTS.OUTFIT,
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
