/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TopAppBar } from './TopAppBar';
import { BottomNav, NavTab } from './BottomNav';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  hideNav?: boolean;
  hideTopBar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  title,
  subtitle,
  onBack,
  hideNav = false,
  hideTopBar = false,
}) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center">
      {/* 390px - 430px centered mobile-first viewport shell */}
      <div className="w-full max-w-[430px] min-h-screen bg-[var(--bg)] flex flex-col relative shadow-xl border-x border-[var(--border)]/40">
        {/* Role Switcher Toolbar */}
        <RoleSwitcher />

        {/* Top App Bar Header (only when not on full custom sub-page) */}
        {!hideTopBar && (
          <TopAppBar title={title} subtitle={subtitle} onBack={onBack} showLocation={!hideNav} />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col ${!hideNav ? 'pb-24' : 'pb-6'}`}>
          {children}
        </main>

        {/* Fixed Bottom Navigation (Customer and Courier roles) */}
        {!hideNav && (role === 'customer' || role === 'courier') && (
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
};
