"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { Column } from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import AdminTableActionMenu from "../common/AdminTableActionMenu";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface GetAstrologerTableColumnsProps {
  onStatusChange: (astrologer: any, newStatus: string) => void;
}

export const getAstrologerTableColumns = ({
  onStatusChange,
}: GetAstrologerTableColumnsProps): Column<any>[] => [
    {
      id: "id",
      label: "ASTROLOGER ID",
      width: "11%",
      minWidth: 100,
      render: (astrologer) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          AST-{astrologer.id}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "ASTROLOGER NAME",
      width: "24%",
      minWidth: 180,
      render: (astrologer) => (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {astrologer.name}
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {astrologer.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: "ratePerMinute",
      label: "PRICE / COMM.",
      width: "15%",
      minWidth: 120,
      render: (astrologer) => (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: COLORS.PRIMARY,
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {astrologer.ratePerMinute}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#64748b",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
            }}
          >
            Comm: {astrologer.commissionPrice}
          </Typography>
        </Box>
      ),
    },
    {
      id: "phone",
      label: "PHONE NUMBER",
      width: "18%",
      minWidth: 130,
      render: (astrologer) => (
        <Typography
          sx={{
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.85rem",
          }}
        >
          {astrologer.phone}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      width: "22%",
      minWidth: 160,
      render: (astrologer) => {
        const currentStatus = String(astrologer.status || "").trim().toLowerCase();
        const options =
          currentStatus === "approved"
            ? [
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]
            : currentStatus === "rejected"
            ? [
                { value: "Rejected", label: "Rejected" },
                { value: "Approved", label: "Approved" },
              ]
            : [
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ];

        return (
          <AdminStatusSelect
            value={astrologer.status}
            options={options}
            onChange={(newStatus) => {
              if (newStatus !== astrologer.status) {
                onStatusChange(astrologer, newStatus);
              }
            }}
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      width: "10%",
      minWidth: 70,
      align: "center",
      render: (astrologer) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Profile",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/purohits/${astrologer.id}`,
              },
              {
                label: "Edit Profile",
                icon: <EditIcon fontSize="small" />,
                href: `/admin/astrologers/edit/${astrologer.id}`,
              },
            ]}
          />
        </Box>
      ),
    },
  ];
