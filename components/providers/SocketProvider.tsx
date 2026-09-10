"use client";

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSocketStore } from '@/stores/socketStore';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { SERVER_ENDPOINTS } from '@/api/serverConstant';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { setSocket, setUnreadCount, incrementUnread, triggerRefresh, addNotification } = useSocketStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    let userId = null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Backend might send 'id' or '_id' (MongoDB)
        userId = user.id || user._id || user.userId;
      } catch (e) {}
    }

    if (!userId) {
      console.warn('No userId found in session, not connecting to Socket.IO');
      return;
    }

    const csrfToken = sessionStorage.getItem('csrfToken');
    // JSON.parse already preserves numbers. parseInt destroys string IDs like UUIDs/ObjectIds.
    const parsedUserId = userId;

    // As requested: relying on backend/proxy to handle it automatically without pointing to a port.
    // However, Next.js proxy rewrites do not support WebSockets properly.
    // Falling back to direct backend connection to ensure notifications work.
    // Extract origin from NEXT_PUBLIC_SOCKET_URL (e.g. "http://200.234.41.149/api" -> "http://200.234.41.149")
    const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const socketUrl = envUrl ? new URL(envUrl).origin : "http://200.234.41.149";
    
    const socket = io(socketUrl, {
      path: "/socket.io/",
      auth: {
        userId: parsedUserId
      },
      transports: ['websocket', 'polling'],
    });

    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err.message);
    });

    socket.on('notification:new', (data) => {
      const msg = data?.message || 'You have a new notification!';
      addNotification(msg);
      incrementUnread();
      triggerRefresh();
    });

    socket.on('notification:unread-count', (data) => {
      if (data && typeof data.count === 'number') {
        setUnreadCount(data.count);
      }
    });

    // 2. Booking Flow Events
    // Note: Backend emits notification:new for all these, so we only triggerRefresh here
    // to update the UI lists without showing duplicate snackbars/toasts.
    socket.on('new_booking', (data) => {
      triggerRefresh();
    });

    socket.on('booking_taken', (data) => {
      triggerRefresh();
    });

    socket.on('booking_accepted', (data) => {
      triggerRefresh();
    });

    socket.on('booking_status_updated', (data) => {
      triggerRefresh();
    });

    socket.on('booking_released', (data) => {
      triggerRefresh();
    });

    socket.on('booking_cancelled', (data) => {
      triggerRefresh();
    });

    // 3. Admin Assignment Events
    socket.on('booking_assigned_by_admin', (data) => {
      triggerRefresh();
    });

    socket.on('create_booking_by_admin', (data) => {
      triggerRefresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [setSocket, setUnreadCount, incrementUnread, triggerRefresh, showSnackbar]);

  return <>{children}</>;
}
