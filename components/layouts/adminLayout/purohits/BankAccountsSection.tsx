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
import { validateBankForm, extractBackendErrorMessage } from "@/utils/helpers";

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
    const bankId = bank.id ?? bank._id ?? null;
    setSelectedBankId(bankId);
    const initialData = {
      id: bankId,
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
      const bankId = deleteBankTarget.id ?? deleteBankTarget._id;
      if (bankId && typeof bankId === "number" && bankId < 1000000000000) {
        await deleteBankAccountAPI(bankId);
      }
      setBankAccounts((prev) => prev.filter((b) => (b.id ?? b._id) !== bankId));
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
    const err = validateBankForm(bankForm);
    if (err) {
      showSnackbar(err, "error");
      return;
    }
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

      if (
        selectedBankId &&
        (typeof selectedBankId === "string" ||
          (typeof selectedBankId === "number" && selectedBankId < 1000000000000))
      ) {
        const res = await updateBankAccountAPI(selectedBankId, payload);
        const resObj =
          res?.data?.data ||
          (res?.data && typeof res.data === "object" && !("success" in res.data) ? res.data : {}) ||
          {};
        const updatedObj = { ...bankForm, ...payload, ...resObj, id: selectedBankId };
        setBankAccounts((prev) =>
          prev.map((b) => ((b.id ?? b._id) === selectedBankId ? updatedObj : b))
        );
        showSnackbar("Bank account updated successfully!", "success");
      } else {
        const res = await addBankAccountAPI(payload);
        const resObj =
          res?.data?.data ||
          (res?.data && typeof res.data === "object" && !("success" in res.data) ? res.data : {}) ||
          {};
        const assignedId = resObj.id || resObj._id || res?.data?.id || Date.now();
        const newObj = { ...bankForm, ...payload, ...resObj, id: assignedId };
        setBankAccounts((prev) => [...prev, newObj]);
        showSnackbar("Bank account added successfully!", "success");
      }

      if (purohitId && Number(purohitId) < 1000000000000) {
        try {
          const updatedPurohitRes = await getPurohitByIdAPI(purohitId);
          const wrapper = updatedPurohitRes?.data?.data || updatedPurohitRes?.data;
          const u = wrapper?.user || wrapper || {};
          const updatedList = u?.bankAccounts || wrapper?.bankAccounts;
          if (Array.isArray(updatedList) && updatedList.length > 0) {
            setBankAccounts(updatedList);
          }
        } catch (e) {
          // ignore refetch error
        }
      }

      setBankModalOpen(false);
      setSelectedBankId(null);
    } catch (error: any) {
      console.error("Bank account save error:", error);
      showSnackbar(
        extractBackendErrorMessage(error, "Failed to save bank account"),
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
