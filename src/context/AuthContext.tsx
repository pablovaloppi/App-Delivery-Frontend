/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { Address, UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
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
    street: 'Av. Corrientes',
    number: '1234',
    apartment: 'Piso 4 B',
    city: 'CABA',
    instructions: 'Tocar timbre 4B (interfono directo)',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Oficina / Cowork',
    street: 'Thames',
    number: '1400',
    apartment: 'Piso 3 Depto B',
    city: 'Palermo Soho, CABA',
    instructions: 'Dejar en recepción con seguridad',
    isDefault: false,
  },
];

const mockUsers: Record<UserRole, UserProfile> = {
  customer: {
    id: 'usr-customer-1',
    name: 'Martín Rodríguez',
    email: 'martin.rodriguez@email.com',
    phone: '+54 11 4892-3321',
    role: 'customer',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCosYlW8-jm61Y00m1Ah7_zn7VtGFVkOZYMy92FaPU93yL1DR9EUWOdYwc2Uk1LCNyQGKyi2d9DEYB_MTI8c7CigLnPaAbUXk_X6uk3A99As0DMCFGJqecqOKmm8883FgDGjnZCz40a4iH957-MYmPWsFpTiqprYrBmtP1-xJblNVHW56hQwCjlx8vrQREv8DMhDb8leFh53h4nQgc9Whg_XQNfBBXzqMJXpG6RLxFlUwJf5_zDYb8uDw',
  },
  merchant: {
    id: 'usr-merchant-1',
    name: 'Pizzería Napolitana Gourmet',
    email: 'contacto@pizzerianapolitana.com',
    phone: '+54 11 4778-9000',
    role: 'merchant',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkyT7lLmF9ZsL-SMNaUrRVgfPAF-OPX9-ezHFrEH9oXJ_ge_PpsoJ6tgQ-Mg97tTmkRMd7FAeMHIil2b8ugt5b46USLUPhNW-tPLdmLTUsX4iQ6tBvz9jYYm5bfJFdSSnjZKAGP-zL7DL84iCgBRMd9aqDlukbbt6U30xfrLr7ZnVsYJ-IcLwv4sZPqKoCck39uOOEqXpUjqwZXOg2XfBjZv-jdSiNUwbascsVniXY5ZMDnhxF8qy_0w',
  },
  courier: {
    id: 'usr-courier-1',
    name: 'Carlos Gómez',
    email: 'carlos.gomez@delivery.com',
    phone: '+54 11 5567-8899',
    role: 'courier',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAf7yMcI7lxZ_bJ4uc-5n9xel2DXjVTBoDr-vpWUN8qja69UPTiz3AUwJYMkKSPQfrvakQ1qdOQ8mgMxjbCd83Zj2t4oglRHagtnTcd5GiCx0P_D5BcFJ3PyiJ68z6EpSFjQP7e6eGmz4-DdwdiU3-MbjPY6DAyghTL1XK7LqQ8phrRPoAztsd5L8O_1Qi3PnbAZ9eg5TQa4HMayJXd0bijgTNme8gS3VC5RQpIHpcL324LxJZxYxo8eg',
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Administración FoodieLocal',
    email: 'admin@foodielocal.com',
    role: 'admin',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [activeAddress, setActiveAddress] = useState<Address>(defaultAddresses[0]);
  const [courierIsAvailable, setCourierIsAvailable] = useState<boolean>(true);
  const [activeOrderCount] = useState<number>(1);
  const [notificationsCount] = useState<number>(1);

  const user = mockUsers[role];

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
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
