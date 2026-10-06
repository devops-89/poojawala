"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { BankDetailsTab } from "@/components/layouts/portalLayout/profile/BankDetailsTab";
import { BankModal } from "@/components/layouts/portalLayout/profile/BankModal";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import {
  addBankAccountAPI,
  updateBankAccountAPI,
  deleteBankAccountAPI,
  getPurohitByIdAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";

interface BankAccountsSectionProps {
  purohitId: string | number;
  bankAccounts: any[];
  setBankAccounts: React.Dispatch<React.SetStateAction<any[]>>;
}

export const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
  purohitId,
  bankAccounts,
  setBankAccounts,
}) => {
  const { showSnackbar } = useSnackbarStore();

  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [savingBank, setSavingBank] = useState(false);

  const [deleteBankTarget, setDeleteBankTarget] = useState<any>(null);
  const [isDeletingBank, setIsDeletingBank] = useState(false);

  const [bankForm, setBankForm] = useState({
    paymentMethod: "BANK",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountType: "SAVINGS",
    upiId: "",
    isPrimary: false,
  });

  const initialBankDataRef = React.useRef<any>(null);

  const handleAddNewBankClick = () => {
    setSelectedBankId(null);
    const initialData = {
      paymentMethod: "BANK",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountType: "SAVINGS",
      upiId: "",
      isPrimary: bankAccounts.length === 0,
    };
    initialBankDataRef.current = null;
    setBankForm(initialData);
    setBankModalOpen(true);
  };

  const handleEditBankClick = (bank: any) => {
    setSelectedBankId(bank.id);
    const initialData = {
      paymentMethod: bank.paymentMethod || (bank.upiId ? "UPI" : "BANK"),
      accountHolderName: bank.accountHolderName || "",
      accountNumber: bank.accountNumber || "",
      ifscCode: bank.ifscCode || "",
      bankName: bank.bankName || "",
      accountType: bank.accountType || "SAVINGS",
      upiId: bank.upiId || "",
      isPrimary: bank.isPrimary || false,
    };
    initialBankDataRef.current = initialData;
    setBankForm(initialData);
    setBankModalOpen(true);
  };

  const handleOpenDeleteBankModal = (bank: any) => {
    setDeleteBankTarget(bank);
  };

  const handleConfirmDeleteBank = async () => {
    if (!deleteBankTarget) return;
    setIsDeletingBank(true);
    try {
      await deleteBankAccountAPI(deleteBankTarget.id);
      setBankAccounts((prev) => prev.filter((b) => b.id !== deleteBankTarget.id));
      showSnackbar("Bank account deleted successfully!", "success");
    } catch (error: any) {
      console.error("Bank account delete error:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to delete bank account",
        "error"
      );
    } finally {
      setIsDeletingBank(false);
      setDeleteBankTarget(null);
    }
  };

  const handleSaveBankModal = async () => {
    if (selectedBankId && initialBankDataRef.current) {
      const isUnchanged =
        JSON.stringify(bankForm) === JSON.stringify(initialBankDataRef.current);
      if (isUnchanged) {
        showSnackbar("No changes detected to save", "info");
        setBankModalOpen(false);
        setSelectedBankId(null);
        return;
      }
    }
    setSavingBank(true);
    try {
      const isBank = bankForm.paymentMethod === "BANK";
      const payload = isBank
        ? {
            purohitId: Number(purohitId),
            paymentMethod: "BANK",
            accountHolderName: bankForm.accountHolderName,
            accountNumber: bankForm.accountNumber,
            ifscCode: bankForm.ifscCode,
            bankName: bankForm.bankName,
            accountType: bankForm.accountType || "SAVINGS",
            isPrimary: bankForm.isPrimary,
          }
        : {
            purohitId: Number(purohitId),
            paymentMethod: "UPI",
            upiId: bankForm.upiId,
            isPrimary: bankForm.isPrimary,
          };

      if (selectedBankId) {
        await updateBankAccountAPI(selectedBankId, payload);
        showSnackbar("Bank account updated successfully!", "success");
      } else {
        await addBankAccountAPI(payload);
        showSnackbar("Bank account added successfully!", "success");
      }

      const updatedPurohitRes = await getPurohitByIdAPI(purohitId);
      const wrapper = updatedPurohitRes?.data?.data || updatedPurohitRes?.data;
      const u = wrapper?.user || wrapper || {};
      const updatedList = u?.bankAccounts || wrapper?.bankAccounts || [];
      setBankAccounts(updatedList);

      setBankModalOpen(false);
      setSelectedBankId(null);
    } catch (error: any) {
      console.error("Bank account save error:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to save bank account",
        "error"
      );
    } finally {
      setSavingBank(false);
    }
  };

  return (
    <Box>
      <BankDetailsTab
        bankAccounts={bankAccounts}
        onAddNew={handleAddNewBankClick}
        onEdit={handleEditBankClick}
        onDelete={(bankId: number) => {
          const target = bankAccounts.find((b) => b.id === bankId);
          if (target) handleOpenDeleteBankModal(target);
        }}
      />

      {/* Add / Edit Bank Account Modal */}
      <BankModal
        open={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        selectedBankId={selectedBankId}
        bankForm={bankForm}
        setBankForm={setBankForm}
        onSaveBank={handleSaveBankModal}
        savingBank={savingBank}
      />

      {/* Delete Bank Account Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteBankTarget)}
        title="Delete Payout Account"
        itemName={
          deleteBankTarget?.paymentMethod === "UPI"
            ? deleteBankTarget?.upiId
            : `${deleteBankTarget?.bankName || "Bank Account"} (${deleteBankTarget?.accountNumber || ""})`
        }
        customMessage={`Are you sure you want to delete this payout account?`}
        onClose={() => setDeleteBankTarget(null)}
        onConfirm={handleConfirmDeleteBank}
        loading={isDeletingBank}
      />
    </Box>
  );
};
