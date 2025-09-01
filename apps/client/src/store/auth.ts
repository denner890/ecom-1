import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'user' | 'admin';
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
        const { user, error } = await firebaseAuth.signInWithEmail(email, password);
        
        if (user) {
          const token = await firebaseAuth.getIdToken();
          const authUser: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
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
          return { success: false, error: error || 'Login failed' };
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        const { user, error } = await firebaseAuth.signInWithGoogle();
        
        if (user) {
          const token = await firebaseAuth.getIdToken();
          const authUser: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
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
          return { success: false, error: error || 'Google login failed' };
        }
      },

      register: async (email: string, password: string) => {
        set({ isLoading: true });
        const { user, error } = await firebaseAuth.signUpWithEmail(email, password);
        
        if (user) {
          const token = await firebaseAuth.getIdToken();
          const authUser: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
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
          return { success: false, error: error || 'Registration failed' };
        }
      },

      logout: async () => {
        await firebaseAuth.signOut();
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null,
          isLoading: false 
        });
      },

      initializeAuth: () => {
        set({ isLoading: true });
        
        const unsubscribe = firebaseAuth.onAuthStateChanged(async (user: User | null) => {
          if (user) {
            const token = await firebaseAuth.getIdToken();
            const authUser: AuthUser = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            };
            
            set({ 
              user: authUser, 
              isAuthenticated: true, 
              token,
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              token: null,
              isLoading: false 
            });
          }
        });

        // Return unsubscribe function for cleanup
        return unsubscribe;
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