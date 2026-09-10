import { create } from 'zustand';

interface TicketModalState {
  isOpen: boolean;
  bookingId: string | number | null;
  linkedPaymentId?: string | number | null;
  onSuccess?: () => void;
  openModal: (bookingId: string | number, linkedPaymentId?: string | number, onSuccess?: () => void) => void;
  closeModal: () => void;
}

export const useTicketModalStore = create<TicketModalState>((set) => ({
  isOpen: false,
  bookingId: null,
  linkedPaymentId: null,
  onSuccess: undefined,
  openModal: (bookingId, linkedPaymentId, onSuccess) => set({ isOpen: true, bookingId, linkedPaymentId, onSuccess }),
  closeModal: () => set({ isOpen: false, bookingId: null, linkedPaymentId: null, onSuccess: undefined }),
}));
