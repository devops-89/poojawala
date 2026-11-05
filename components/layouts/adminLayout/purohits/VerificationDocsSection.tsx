"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import Step4DocumentUpload from "@/components/layouts/portalLayout/register/components/Step4DocumentUpload";
import DocumentPreviewDialog from "@/components/layouts/portalLayout/register/components/DocumentPreviewDialog";

interface VerificationDocsSectionProps {
  values: any;
  selectedFiles: {
    identityDoc: File | null;
    certificate: File | null;
    templeAffiliationProof?: File | null;
    profilePhoto: File | null;
  };
  handleFileUpload: (
    key: any,
    urlKey: string,
    file: File | null
  ) => void;
  isAstrologer?: boolean;
}

export const VerificationDocsSection: React.FC<VerificationDocsSectionProps> = ({
  values,
  selectedFiles,
  handleFileUpload,
  isAstrologer = false,
}) => {
  const [previewTarget, setPreviewTarget] = useState<File | string | null>(null);

  const existingUrls = {
    identityDoc: values.identityDocUrl,
    certificate: values.certificateUrl,
    templeAffiliationProof: values.templeAffiliationProofUrl,
    profilePhoto: values.profilePhotoUrl,
  };

  const handleFileChange = (docId: string, file: File | null) => {
    const urlKey = `${docId}Url`;
    handleFileUpload(docId, urlKey, file);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <DescriptionIcon sx={{ color: COLORS.PRIMARY }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          3. Verification Documents Upload
        </Typography>
      </Box>

      <Step4DocumentUpload
        selectedFiles={selectedFiles}
        existingUrls={existingUrls}
        onFileChange={handleFileChange}
        setPreviewTarget={setPreviewTarget}
        isAdmin={true}
        isAstrologer={isAstrologer}
        hideTitle={true}
      />

      <DocumentPreviewDialog
        previewTarget={previewTarget}
        setPreviewTarget={setPreviewTarget}
      />
    </Box>
  );
};
