'use client';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { getCustomerBookingsAPI } from '@/api/bookingControllers';
import { getAllServicesAPI } from '@/api/serviceControllers';

import ServiceDetailsPujaSamagri from '../services/serviceDetails/ServiceDetailsPujaSamagri';
import DashboardRecentBookings from './DashboardRecentBookings';
import DashboardServicesSection from './DashboardServicesSection';

export default function CustomerDashboardOverview() {
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  const fetchServicesData = async () => {
    setLoadingServices(true);
    try {
      // Fetch max 3 active services without city/state filter
      const res = await getAllServicesAPI(1, 3, '', true);
      let list: any[] = [];
      const payload = res?.data || res;
      if (Array.isArray(payload?.services)) {
        list = payload.services;
      } else if (Array.isArray(payload?.data)) {
        list = payload.data;
      } else if (Array.isArray(payload)) {
        list = payload;
      }
      setServices(list.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch services for dashboard:', err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    // 1. Fetch Services
    fetchServicesData();

    // 2. Fetch Recent Bookings
    getCustomerBookingsAPI()
      .then((res) => {
        if (res?.data?.bookings) {
          setRecentBookings(res.data.bookings.slice(0, 2));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Box>
      {/* Recent Bookings Section (Shown if user has recent bookings) */}
      {recentBookings.length > 0 && (
        <DashboardRecentBookings recentBookings={recentBookings} />
      )}

      {/* Sacred Puja Services (Max 3) */}
      <DashboardServicesSection
        services={services}
        loadingServices={loadingServices}
      />

      {/* Pooja Samagri & Products (Max 3) */}
      <ServiceDetailsPujaSamagri
        maxItems={3}
        title="Essential Pooja Products & Samagri"
        subtitle="Explore essential pooja items, kits, and sacred offerings for your rituals. Add what you need — we'll arrange delivery right to your doorstep."
        showSummaryBar={false}
      />
    </Box>
  );
}
