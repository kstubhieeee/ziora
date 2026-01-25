"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Menu, X, Shield, BarChart3, Users, MessageSquare, Database, Home, LogOut, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { clearAllSessions } from '@/lib/admin-utils';

interface AdminUser {
  name: string;
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

const AdminNavbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check for admin user data
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');
    
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isAdmin || user.role === 'admin') {
        setAdminUser(user);
      }
    } else if (adminData) {
      setAdminUser(JSON.parse(adminData));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: BarChart3,
      isActive: pathname === '/admin/dashboard'
    },
    { 
      name: 'Users', 
      href: '/admin/dashboard/users', 
      icon: Users,
      isActive: pathname.startsWith('/admin/dashboard/users')
    },
    { 
      name: 'Comments', 
      href: '/admin/dashboard/comments', 
      icon: MessageSquare,
      isActive: pathname.startsWith('/admin/dashboard/comments')
    },
    { 
      name: 'Reviews', 
      href: '/admin/dashboard/reviews', 
      icon: Star,
      isActive: pathname.startsWith('/admin/dashboard/reviews')
    },
    { 
      name: 'Security', 
      href: '/admin/dashboard/security', 
      icon: Shield,
      isActive: pathname.startsWith('/admin/dashboard/security')
    },
   
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Clear ALL sessions using the utility function
      clearAllSessions();
      setAdminUser(null);
      
      // Redirect to admin login page
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local sessions
      clearAllSessions();
      setAdminUser(null);
      router.push('/admin');
    }
  };

  const goToMainSite = () => {
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' : 'bg-background/90 backdrop-blur-sm border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold">Ziora</span>
                <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      link.isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - User menu, theme toggle, mobile menu */}
          <div className="flex items-center space-x-3">
            {/* Main Site Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToMainSite}
              className="hidden md:flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Main Site</span>
            </Button>

            {/* User Dropdown */}
            {adminUser && (
              <DropdownMenu open={showUserDropdown} onOpenChange={setShowUserDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 h-10 px-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{adminUser.name}</p>
                    <p className="text-xs text-muted-foreground">@{adminUser.username}</p>
                    <p className="text-xs text-muted-foreground">{adminUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={goToMainSite} className="cursor-pointer">
                    <Home className="w-4 h-4 mr-2" />
                    <span>Main Site</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      link.isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-border">
                <button
                  onClick={goToMainSite}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                >
                  <Home className="w-5 h-5" />
                  <span>Main Site</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default AdminNavbar; 