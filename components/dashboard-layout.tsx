'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Menu,
  Microscope,
  Settings,
  Users,
  X,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { signOut } from '@/lib/auth';
import { AICompanion } from '@/components/ai-companion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'educator' | 'researcher';
  userName?: string;
}

export function DashboardLayout({
  children,
  userRole,
  userName = 'User',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const displayName = profile?.name || user?.displayName || userName;

  const getMenuItems = () => {
    const baseItems = [
      { label: 'Dashboard', href: `/dashboard/${userRole}`, icon: BarChart3 },
    ];

    if (userRole === 'student') {
      return [
        ...baseItems,
        { label: 'My Courses', href: `/dashboard/${userRole}/courses`, icon: BookOpen },
        { label: 'Analytics', href: `/dashboard/${userRole}/analytics`, icon: BarChart3 },
        { label: 'Settings', href: `/dashboard/${userRole}/settings`, icon: Settings },
      ];
    }

    if (userRole === 'educator') {
      return [
        ...baseItems,
        { label: 'My Courses', href: `/dashboard/${userRole}/courses`, icon: BookOpen },
        { label: 'My Classes', href: `/dashboard/${userRole}/classes`, icon: Users },
        { label: 'Analytics', href: `/dashboard/${userRole}/analytics`, icon: BarChart3 },
        { label: 'Settings', href: `/dashboard/${userRole}/settings`, icon: Settings },
      ];
    }

    return [
      ...baseItems,
      { label: 'Data Portal', href: `/dashboard/${userRole}/data`, icon: Microscope },
      { label: 'Analytics', href: `/dashboard/${userRole}/analytics`, icon: BarChart3 },
      { label: 'Settings', href: `/dashboard/${userRole}/settings`, icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <span className="font-semibold truncate">Flora</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" />
            )}
            {sidebarOpen && (
              <span className="truncate">{darkMode ? 'Light' : 'Dark'}</span>
            )}
          </button>
          <button
            onClick={async () => { await signOut(); router.push('/'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {displayName}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* AI Companion */}
        <AICompanion role={userRole} />
      </main>
    </div>
  );
}
