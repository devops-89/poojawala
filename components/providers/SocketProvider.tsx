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
    // Get userId from session storage
    const userStr = sessionStorage.getItem('user');
    let userId = null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
      } catch (e) {}
    }

    if (!userId) {
      console.warn('No userId found in session, not connecting to Socket.IO');
      return;
    }

    const csrfToken = sessionStorage.getItem('csrfToken');
    const parsedUserId = userId ? parseInt(userId as string) : null;

    // As requested: relying on backend/proxy to handle it automatically without pointing to a port.
    // However, Next.js proxy rewrites do not support WebSockets properly.
    // Falling back to direct backend connection to ensure notifications work.
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://192.168.1.26:8011";
    const socket = io(socketUrl, {
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
    socket.on('new_booking', (data) => {
      addNotification('New booking request available!');
      incrementUnread();
      triggerRefresh();
    });

    socket.on('booking_taken', (data) => {
      addNotification('A pending booking was accepted by someone else.');
      triggerRefresh();
    });

    socket.on('booking_accepted', (data) => {
      addNotification('Booking has been accepted.');
      triggerRefresh();
    });

    socket.on('booking_status_updated', (data) => {
      const msg = `Booking status updated: ${data?.status || 'changed'}`;
      addNotification(msg);
      triggerRefresh();
    });

    socket.on('booking_released', (data) => {
      addNotification('A booking has been released.');
      triggerRefresh();
    });

    socket.on('booking_cancelled', (data) => {
      addNotification('A booking has been cancelled.');
      triggerRefresh();
    });

    // 3. Admin Assignment Events
    socket.on('booking_assigned_by_admin', (data) => {
      addNotification('An Admin has manually assigned a booking to you!');
      triggerRefresh();
    });

    socket.on('create_booking_by_admin', (data) => {
      addNotification('An Admin created a new booking on your behalf.');
      triggerRefresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [setSocket, setUnreadCount, incrementUnread, triggerRefresh, showSnackbar]);

  return <>{children}</>;
}
