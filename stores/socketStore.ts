import { create } from 'zustand';
import { Socket } from 'socket.io-client';

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

interface SocketState {
  socket: Socket | null;
  unreadCount: number;
  refreshTrigger: number;
  notifications: NotificationItem[];
  setSocket: (socket: Socket | null) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  triggerRefresh: () => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  unreadCount: 0,
  refreshTrigger: 0,
  notifications: [],
  setSocket: (socket) => set({ socket }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  addNotification: (message) => set((state) => {
    const newNotif = {
      id: Math.random().toString(36).substring(7),
      message,
      time: new Date().toLocaleTimeString()
    };
    return { notifications: [newNotif, ...state.notifications].slice(0, 20) };
  }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
