import { getMeAPI } from '@/api/authControllers';
import { create } from 'zustand';

interface UserState {
  profile: any | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (force?: boolean) => Promise<any>;
  clearProfile: () => void;
  setProfile: (data: any) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  fetchProfile: async (force = false) => {
    if (!force && get().profile) return get().profile;
    if (get().loading) {
      while (get().loading) {
        await new Promise((res) => setTimeout(res, 50));
      }
      return get().profile;
    }
    
    set({ loading: true, error: null });
    try {
      const res = await getMeAPI();
      const fetchedUser = res?.data?.user || res?.data?.data || res?.data;
      
      const activeRole = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      let localUser: any = null;
      if (activeRole) {
        try { localUser = JSON.parse(activeRole); } catch (e) {}
      }

      if (fetchedUser && localUser?.role && fetchedUser.role && fetchedUser.role !== localUser.role) {
        set({ profile: localUser, loading: false });
        return localUser;
      }

      const finalProfile = fetchedUser || localUser;
      set({ profile: finalProfile, loading: false });
      return finalProfile;
    } catch (error: any) {
      try {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          const localUser = JSON.parse(userStr);
          set({ profile: localUser, loading: false });
          return localUser;
        }
      } catch (e) {}
      set({ error: error.message || 'Failed to fetch profile', loading: false });
      return null;
    }
  },
  clearProfile: () => set({ profile: null, error: null, loading: false }),
  setProfile: (data: any) => set({ profile: data })
}));
