/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, PublicUser, UserProfile, UserRole } from '../types';
import { apiClient, SEED_CREDENTIALS } from '../services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile;
  publicUser: PublicUser | null;
  role: UserRole;
  login: (identifier: string, password?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    displayName: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    cityId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  activeAddress: Address;
  setActiveAddress: (address: Address) => void;
  activeOrderCount: number;
  courierIsAvailable: boolean;
  setCourierIsAvailable: (available: boolean) => void;
  notificationsCount: number;
}

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Casa',
    street: 'Av. San Martín',
    number: '450',
    apartment: 'Depto 2B',
    city: 'Ciudad de Perico',
    instructions: 'Tocar timbre 2B (frente a la plaza principal)',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Oficina / Trabajo',
    street: 'Av. Italia',
    number: '120',
    city: 'Ciudad de Perico',
    instructions: 'Dejar en recepción de administración',
    isDefault: false,
  },
];

const mockAvatars: Record<UserRole, string> = {
  customer:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCosYlW8-jm61Y00m1Ah7_zn7VtGFVkOZYMy92FaPU93yL1DR9EUWOdYwc2Uk1LCNyQGKyi2d9DEYB_MTI8c7CigLnPaAbUXk_X6uk3A99As0DMCFGJqecqOKmm8883FgDGjnZCz40a4iH957-MYmPWsFpTiqprYrBmtP1-xJblNVHW56hQwCjlx8vrQREv8DMhDb8leFh53h4nQgc9Whg_XQNfBBXzqMJXpG6RLxFlUwJf5_zDYb8uDw',
  merchant:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkyT7lLmF9ZsL-SMNaUrRVgfPAF-OPX9-ezHFrEH9oXJ_ge_PpsoJ6tgQ-Mg97tTmkRMd7FAeMHIil2b8ugt5b46USLUPhNW-tPLdmLTUsX4iQ6tBvz9jYYm5bfJFdSSnjZKAGP-zL7DL84iCgBRMd9aqDlukbbt6U30xfrLr7ZnVsYJ-IcLwv4sZPqKoCck39uOOEqXpUjqwZXOg2XfBjZv-jdSiNUwbascsVniXY5ZMDnhxF8qy_0w',
  courier:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAf7yMcI7lxZ_bJ4uc-5n9xel2DXjVTBoDr-vpWUN8qja69UPTiz3AUwJYMkKSPQfrvakQ1qdOQ8mgMxjbCd83Zj2t4oglRHagtnTcd5GiCx0P_D5BcFJ3PyiJ68z6EpSFjQP7e6eGmz4-DdwdiU3-MbjPY6DAyghTL1XK7LqQ8phrRPoAztsd5L8O_1Qi3PnbAZ9eg5TQa4HMayJXd0bijgTNme8gS3VC5RQpIHpcL324LxJZxYxo8eg',
  admin:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFdhWXKS7rIJdiT8VTzvo9PI7kE1XX9hB8NRxDXHhIUT_wDZNGZ8h02dA0SGp_-bFnE5mUbfU5hTekef3-gH0jaD2uYVCSEYxsa2C0ooz35vuqndM-XLtnJ9BGDq-3i2RM2p5ZBi4oaoYCP8-H1dJ7wb9BuYETEH5vLs0QstZhrjmIX9zF6VwqvGh0Dip7si7LA_KnHSQXqkeduq_hdyRFBsLUieJ-Yya3UV4gwU4sx3aE4ATHFb_G1Q',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('foodielocal_token'));
  const [publicUser, setPublicUser] = useState<PublicUser | null>(() => {
    const saved = localStorage.getItem('foodielocal_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeAddress, setActiveAddress] = useState<Address>(defaultAddresses[0]);
  const [courierIsAvailable, setCourierIsAvailable] = useState<boolean>(true);
  const [activeOrderCount] = useState<number>(1);
  const [notificationsCount] = useState<number>(1);

  // Re-verify session on mount
  useEffect(() => {
    let isMounted = true;
    if (token) {
      apiClient.me().then((res) => {
        if (!isMounted) return;
        if (res.authenticated && res.user) {
          setPublicUser(res.user);
        } else if (!res.authenticated) {
          // Token expired or invalid
          setToken(null);
          setPublicUser(null);
          localStorage.removeItem('foodielocal_token');
          localStorage.removeItem('foodielocal_user');
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const isAuthenticated = Boolean(token && publicUser);
  const role: UserRole = publicUser?.role || 'customer';

  const user: UserProfile = {
    id: publicUser?.id || 'usr_guest',
    name: publicUser?.displayName || 'Usuario Invitado',
    email: publicUser?.email || 'invitado@deliverylocal.com',
    phone: publicUser?.phone || '+54 9 388 555-0000',
    role,
    avatarUrl: publicUser?.photoUrl || mockAvatars[role],
    merchantId: publicUser?.merchantId,
    courierId: publicUser?.courierId,
  };

  const login = async (identifier: string, password?: string, roleChoice?: string) => {
    const res = await apiClient.login({
      identifier,
      password,
      role: roleChoice,
    });

    if (res.success && res.user) {
      const activeTok = res.session?.token || localStorage.getItem('foodielocal_token') || 'dl_tok_active';
      setToken(activeTok);
      setPublicUser(res.user);
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'Credenciales inválidas. Por favor, verifica el usuario o contraseña.',
    };
  };

  const register = async (data: {
    displayName: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
    cityId?: string;
  }) => {
    const res = await apiClient.register({
      ...data,
      role: data.role || 'customer',
    });

    if (res.success && res.user) {
      const activeTok = res.session?.token || localStorage.getItem('foodielocal_token') || 'dl_tok_reg';
      setToken(activeTok);
      setPublicUser(res.user);
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'Error al registrar la cuenta.',
    };
  };

  const logout = async () => {
    await apiClient.logout();
    setToken(null);
    setPublicUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        publicUser,
        role,
        login,
        register,
        logout,
        activeAddress,
        setActiveAddress,
        activeOrderCount,
        courierIsAvailable,
        setCourierIsAvailable,
        notificationsCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
