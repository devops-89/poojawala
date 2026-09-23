'use client';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { getMeAPI } from '@/api/authControllers';
import { getCustomerBookingsAPI } from '@/api/bookingControllers';
import { getAllServicesAPI } from '@/api/serviceControllers';
import {
  getCustomerAddressesAPI,
  getCustomerDashboardStatsAPI,
} from '@/api/userControllers';

import ServiceDetailsPujaSamagri from '../services/serviceDetails/ServiceDetailsPujaSamagri';
import DashboardHeroProfile from './DashboardHeroProfile';
import DashboardRecentBookings from './DashboardRecentBookings';
import DashboardServicesSection from './DashboardServicesSection';
import DashboardStatsGrid from './DashboardStatsGrid';

export default function CustomerDashboardOverview() {
  const [statsData, setStatsData] = useState<any>({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  });
  const [profile, setProfile] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{
    city: string;
    state: string;
  }>({
    city: 'Noida',
    state: 'Uttar Pradesh',
  });

  const fetchServicesData = async (userCity: string, userState: string) => {
    setLoadingServices(true);
    try {
      // Max 3 services requested
      const res = await getAllServicesAPI(1, 3, '', true, userCity, userState);
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
    // 1. Fetch Dashboard Stats
    getCustomerDashboardStatsAPI()
      .then((res) => {
        if (res?.data) {
          setStatsData(res.data);
        }
      })
      .catch(console.error);

    // 2. Fetch User Profile & Location for Services
    getMeAPI()
      .then(async (res) => {
        const userObj = res?.data || res;
        if (userObj) {
          setProfile(userObj);
        }

        const extractAddressList = (resObj: any) => {
          if (!resObj) return [];
          if (Array.isArray(resObj)) return resObj;
          if (Array.isArray(resObj?.data?.data)) return resObj.data.data;
          if (Array.isArray(resObj?.data?.addresses)) return resObj.data.addresses;
          if (Array.isArray(resObj?.data)) return resObj.data;
          if (Array.isArray(resObj?.addresses)) return resObj.addresses;
          return [];
        };

        const findDefaultAddress = (list: any[]) => {
          if (!Array.isArray(list) || list.length === 0) return null;
          const found = list.find(
            (a: any) =>
              a?.isDefault === true ||
              a?.isdefault === true ||
              a?.is_default === true ||
              String(a?.isDefault).toLowerCase() === 'true' ||
              String(a?.isdefault).toLowerCase() === 'true' ||
              String(a?.is_default).toLowerCase() === 'true' ||
              a?.isDefault === 1 ||
              a?.isdefault === 1 ||
              a?.is_default === 1
          );
          return found || list[0];
        };

        let addresses: any[] = [];
        try {
          const addrRes = await getCustomerAddressesAPI();
          addresses = extractAddressList(addrRes);
        } catch (e) {
          console.error('Failed to fetch customer addresses:', e);
        }

        if (addresses.length === 0 && userObj) {
          addresses = extractAddressList(userObj);
        }

        const defaultAddr = findDefaultAddress(addresses);

        let city = defaultAddr?.city || userObj?.city || userObj?.address?.city || '';
        let state = defaultAddr?.state || userObj?.state || userObj?.address?.state || '';

        const finalCity = city || 'Noida';
        const finalState = state || 'Uttar Pradesh';
        setUserLocation({ city: finalCity, state: finalState });
        fetchServicesData(finalCity, finalState);
      })
      .catch(() => {
        fetchServicesData('Noida', 'Uttar Pradesh');
      });

    // 3. Fetch Recent Bookings
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
      {/* Profile Hero Card */}
      <DashboardHeroProfile profile={profile} />

      {/* Stats Cards */}
      <DashboardStatsGrid statsData={statsData} />

      {/* Recent Bookings Section */}
      <DashboardRecentBookings recentBookings={recentBookings} />

      {/* Sacred Puja Services (Max 3) */}
      <DashboardServicesSection
        services={services}
        loadingServices={loadingServices}
        userLocation={userLocation}
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
