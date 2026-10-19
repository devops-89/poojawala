import { create } from 'zustand';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  key: number;
  showSnackbar: (message: string, severity?: SnackbarSeverity, duration?: number) => void;
  hideSnackbar: () => void;
}

let autoHideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useSnackbarStore = create<SnackbarState>((set, get) => ({
  open: false,
  message: '',
  severity: 'success',
  key: 0,
  showSnackbar: (message: string, severity: SnackbarSeverity = 'success', duration = 5000) => {
    // Clear any existing active timer
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      autoHideTimeout = null;
    }

    set({
      open: true,
      message,
      severity,
      key: Date.now(),
    });

    // Enforce 5-second auto close globally so snackbars never get stuck
    const autoCloseMs = typeof duration === 'number' && duration > 0 ? duration : 5000;
    autoHideTimeout = setTimeout(() => {
      get().hideSnackbar();
    }, autoCloseMs);
  },
  hideSnackbar: () => {
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      autoHideTimeout = null;
    }
    set({ open: false });
  },
}));

