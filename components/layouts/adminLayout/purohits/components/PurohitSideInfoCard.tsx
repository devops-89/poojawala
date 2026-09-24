"use client";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export interface PurohitSideInfoCardProps {
  purohit: any;
  profile: any;
  bankAccount: any;
}

export default function PurohitSideInfoCard({
  purohit,
  profile,
  bankAccount,
}: PurohitSideInfoCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const bankAccounts = Array.isArray(purohit.bankAccounts)
    ? purohit.bankAccounts
    : bankAccount && Object.keys(bankAccount).length > 0
    ? [bankAccount]
    : [];

  return (
    <Grid container spacing={3}>
      {/* Contact Information */}
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              color: "#1e293b",
              mb: 2.5,
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PhoneIcon sx={{ color: "#FF6200", fontSize: 20 }} />
            Contact Information
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
              Phone Number
            </Typography>
            <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
              {purohit.countryCode ? `+${purohit.countryCode} ` : ""}{purohit.phone || "N/A"}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
              Email Address
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem", wordBreak: "break-all" }}>
              {purohit.email || "N/A"}
            </Typography>
          </Box>

          {purohit.emergencyContact && (
            <Box>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                Emergency Contact
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                {purohit.emergencyContact}
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Personal Details */}
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              color: "#1e293b",
              mb: 2.5,
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonIcon sx={{ color: "#FF6200", fontSize: 20 }} />
            Personal Details
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                Date of Birth
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", mt: 0.5 }}>
                {formatDate(purohit.dob)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                Birth Place
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", mt: 0.5 }}>
                {purohit.birthPlace || "N/A"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                Aadhaar Number
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem", mt: 0.5 }}>
                {profile.aadhaarNumber || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Bank & Payment Accounts */}
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "white",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              color: "#1e293b",
              mb: 2.5,
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AccountBalanceIcon sx={{ color: "#FF6200", fontSize: 20 }} />
            Bank & Payment Accounts ({bankAccounts.length})
          </Typography>

          {bankAccounts.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {bankAccounts.map((acc: any, index: number) => (
                <Box
                  key={acc.id || index}
                  sx={{
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Chip
                      label={acc.paymentMethod || "BANK"}
                      size="small"
                      sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700, fontSize: "0.75rem" }}
                    />
                    {acc.isPrimary && (
                      <Chip
                        label="Primary Account"
                        size="small"
                        sx={{ bgcolor: "#d1fae5", color: "#059669", fontWeight: 700, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>

                  {acc.paymentMethod === "UPI" || acc.upiId ? (
                    <>
                      <Box sx={{ mb: 1 }}>
                        <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                          UPI ID
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>
                          {acc.upiId || "N/A"}
                        </Typography>
                      </Box>
                      {acc.accountType && (
                        <Box>
                          <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                            Account Type
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem" }}>
                            {acc.accountType}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {acc.bankName && (
                        <Box sx={{ mb: 1 }}>
                          <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                            Bank Name
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>
                            {acc.bankName}
                          </Typography>
                        </Box>
                      )}
                      {acc.accountHolderName && (
                        <Box sx={{ mb: 1 }}>
                          <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                            Account Holder Name
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                            {acc.accountHolderName}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ mb: 1 }}>
                        <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                          Account Number
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>
                          {acc.accountNumber || "N/A"}
                        </Typography>
                      </Box>
                      {acc.ifscCode && (
                        <Box>
                          <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 600 }}>
                            IFSC Code
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>
                            {acc.ifscCode}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
              No bank account added.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
