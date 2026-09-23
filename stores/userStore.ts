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
      set({ profile: res.data, loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch profile', loading: false });
      return null;
    }
  },
  clearProfile: () => set({ profile: null, error: null, loading: false }),
  setProfile: (data: any) => set({ profile: data })
}));
