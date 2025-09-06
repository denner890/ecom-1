import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import { firebaseAuth } from '@/lib/firebase';

interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role?: 'user' | 'admin';
  provider?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.login({ email, password });
          
          if (response.ok) {
            const { user, token } = response.data;
            const authUser: AuthUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
              role: user.role,
              provider: user.provider,
            };
            
            set({ 
              user: authUser, 
              isAuthenticated: true, 
              token,
              isLoading: false 
            });
            
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: response.message || 'Login failed' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        
        try {
          const { user, error } = await firebaseAuth.signInWithGoogle();
          
          if (user) {
            const firebaseToken = await firebaseAuth.getIdToken();
            const response = await authApi.loginWithFirebase(firebaseToken);
            
            if (response.ok) {
              const { user: backendUser, token } = response.data;
              const authUser: AuthUser = {
                id: backendUser.id,
                email: backendUser.email,
                name: backendUser.name,
                avatar: backendUser.avatar,
                role: backendUser.role,
                provider: backendUser.provider,
              };
              
              set({ 
                user: authUser, 
                isAuthenticated: true, 
                token,
                isLoading: false 
              });
              
              return { success: true };
            } else {
              set({ isLoading: false });
              return { success: false, error: response.message || 'Google login failed' };
            }
          } else {
            set({ isLoading: false });
            return { success: false, error: error || 'Google login failed' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Google login failed' };
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.register({ name: email.split('@')[0], email, password });
          
          if (response.ok) {
            const { user, token } = response.data;
            const authUser: AuthUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: user.avatar,
              role: user.role,
              provider: user.provider,
            };
            
            set({ 
              user: authUser, 
              isAuthenticated: true, 
              token,
              isLoading: false 
            });
            
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: response.message || 'Registration failed' };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
      },

      logout: async () => {
        try {
          await firebaseAuth.signOut();
        } catch (e) {
          // Ignore Firebase signout errors for local users
        }
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null,
          isLoading: false 
        });
      },

      initializeAuth: async () => {
        const state = get();
        if (state.token && state.user) {
          try {
            const response = await authApi.getProfile();
            if (response.ok) {
              const user = response.data.user;
              set({
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  avatar: user.avatar,
                  role: user.role,
                  provider: user.provider,
                },
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // Token is invalid, clear auth state
              set({
                user: null,
                isAuthenticated: false,
                token: null,
                isLoading: false,
              });
            }
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              token: null,
              isLoading: false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);