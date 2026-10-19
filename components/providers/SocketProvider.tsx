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
    let userRole = '';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Backend might send 'id' or '_id' (MongoDB)
        userId = user.id || user._id || user.userId;
        userRole = (user.role || sessionStorage.getItem('role') || '').toUpperCase();
      } catch (e) {}
    }

    if (!userId) {
      console.warn('No userId found in session, not connecting to Socket.IO');
      return;
    }

    // JSON.parse already preserves numbers. parseInt destroys string IDs like UUIDs/ObjectIds.
    const parsedUserId = userId;

    // Direct backend connection to ensure notifications work.
    const socketUrl = SERVER_ENDPOINTS.SOCKET_URL;
    
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

    const getAstrologyDefaultMsg = () => {
      if (userRole === 'ADMIN' || userRole === 'SUPERADMIN' || userRole === 'SUPER_ADMIN') {
        return 'New Astrology Booking Request';
      }
      if (userRole === 'ASTROLOGER') {
        return 'New Astrology Consultation Scheduled';
      }
      // Customer
      return 'New Astrology Consultation Scheduled';
    };

    const handleAstrologyNotification = (data?: any) => {
      const defaultMsg = getAstrologyDefaultMsg();
      const msg = data?.message || defaultMsg;
      addNotification(msg);
      incrementUnread();
      triggerRefresh();
    };

    // 1. Core Notifications
    socket.on('notification:new', (data) => {
      const refType = (data?.referenceType || '').toUpperCase();
      const type = (data?.type || '').toUpperCase();
      const bookingType = (data?.bookingType || data?.booking?.bookingType || '').toUpperCase();
      const rawMsg = data?.message || '';
      const lowerMsg = rawMsg.toLowerCase();

      const isAstrology =
        refType === 'ASTROLOGY' ||
        type.includes('ASTROLOGY') ||
        bookingType === 'ASTROLOGY' ||
        lowerMsg.includes('astrology') ||
        lowerMsg.includes('consultation');

      let finalMsg = rawMsg;
      if (isAstrology) {
        if (!finalMsg || finalMsg === 'You have a new notification!') {
          finalMsg = getAstrologyDefaultMsg();
        }
      } else if (!finalMsg) {
        finalMsg = 'You have a new notification!';
      }

      addNotification(finalMsg);
      incrementUnread();
      triggerRefresh();
    });

    socket.on('notification:unread-count', (data) => {
      if (data && typeof data.count === 'number') {
        setUnreadCount(data.count);
      }
    });

    // 2. Dedicated Astrology Consultation Events
    socket.on('new_astrology_booking', (data) => {
      handleAstrologyNotification(data);
    });

    socket.on('astrology_booking_created', (data) => {
      handleAstrologyNotification(data);
    });

    socket.on('astrology_consultation_scheduled', (data) => {
      handleAstrologyNotification(data);
    });

    socket.on('astrology:scheduled', (data) => {
      handleAstrologyNotification(data);
    });

    socket.on('astrology:new_booking', (data) => {
      handleAstrologyNotification(data);
    });

    // 3. Booking Flow Events
    socket.on('new_booking', (data) => {
      const bookingType = (data?.bookingType || data?.booking?.bookingType || '').toUpperCase();
      if (bookingType === 'ASTROLOGY' || data?.astrologerId != null) {
        handleAstrologyNotification(data);
      } else {
        triggerRefresh();
      }
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

    // 4. Admin & Order Events
    socket.on('order:new', () => triggerRefresh());
    socket.on('order_updated', () => triggerRefresh());
    socket.on('order_status_updated', () => triggerRefresh());
    socket.on('order:status-change', () => triggerRefresh());
    socket.on('order:created', () => triggerRefresh());
    socket.on('order:cancelled', () => triggerRefresh());
    socket.on('payment:success', () => triggerRefresh());

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
