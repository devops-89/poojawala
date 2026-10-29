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
    // 1. Consistency check with client sessionStorage
    if (typeof window !== "undefined") {
      const sessionUserStr = sessionStorage.getItem("user");
      if (!sessionUserStr) {
        // If session was cleared (logged out), immediately reset in-memory profile
        if (get().profile) {
          set({ profile: null });
        }
      } else {
        try {
          const sessionUser = JSON.parse(sessionUserStr);
          const currentProfile = get().profile;
          // If in-memory profile has different user identity than current session, sync & force refresh
          if (
            currentProfile &&
            sessionUser &&
            ((sessionUser.id && currentProfile.id && sessionUser.id !== currentProfile.id) ||
              (sessionUser.email && currentProfile.email && sessionUser.email !== currentProfile.email))
          ) {
            set({ profile: sessionUser });
            force = true;
          } else if (!currentProfile && sessionUser) {
            set({ profile: sessionUser });
          }
        } catch (e) {}
      }
    }

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
      const fetchedUser =
        res?.user || res?.data?.user || res?.data?.data || res?.data || res;
      
      const sessionUserStr = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
      let localUser: any = null;
      if (sessionUserStr) {
        try { localUser = JSON.parse(sessionUserStr); } catch (e) {}
      }

      const isValidFetchedUser =
        fetchedUser &&
        typeof fetchedUser === "object" &&
        (fetchedUser.id || fetchedUser.email || fetchedUser.firstName || fetchedUser.name);

      let finalProfile: any = null;
      if (isValidFetchedUser) {
        // Only merge with localUser if both belong to the exact same user
        const isSameUser =
          !localUser ||
          (localUser.id && fetchedUser.id && localUser.id === fetchedUser.id) ||
          (localUser.email && fetchedUser.email && localUser.email === fetchedUser.email);

        finalProfile = isSameUser ? { ...(localUser || {}), ...fetchedUser } : fetchedUser;

        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("user", JSON.stringify(finalProfile));
            if (finalProfile.role) {
              sessionStorage.setItem("role", finalProfile.role);
              sessionStorage.setItem("activeRole", finalProfile.role);
            }
          } catch (e) {}
        }
      } else if (localUser) {
        finalProfile = localUser;
      }

      set({ profile: finalProfile, loading: false });
      return finalProfile;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("activeRole");
          } catch (e) {}
        }
        set({ profile: null, loading: false, error: "Unauthorized" });
        return null;
      }

      try {
        const userStr = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
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
  setProfile: (data: any) => {
    if (typeof window !== "undefined" && data) {
      try {
        sessionStorage.setItem("user", JSON.stringify(data));
        if (data.role) {
          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("activeRole", data.role);
        }
      } catch (e) {}
    }
    set({ profile: data, loading: false });
  }
}));
