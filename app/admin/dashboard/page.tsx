'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock,
  Flag,
  UserCheck,
  UserPlus,
  UserX,
  Shield,
  Eye,
  MousePointer,
  Code,
  Star
} from "lucide-react";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    suspended: number;
    newThisWeek: number;
  };
  comments: {
    total: number;
    pending: number;
    flagged: number;
    today: number;
  };
  reviews: {
    total: number;
    pending: number;
    averageRating: number;
    thisWeek: number;
  };
  security: {
    totalEvents: number;
    screenshotAttempts: number;
    rightClicks: number;
    devToolsAttempts: number;
    todayEvents: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(true);

  // Verify admin status on component mount
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        // Check for admin session in localStorage (client-side)
        const adminData = localStorage.getItem('admin');
        const userData = localStorage.getItem('user');
        
        if (!adminData && !userData) {
          // No session data, redirect to admin login
          router.push('/admin');
          return;
        }

        // Verify with server by making an API call
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, redirect to admin login
            router.push('/admin');
            return;
          }
        }

        // If we get here, admin verification passed
        setIsVerifyingAdmin(false);
      } catch (error) {
        console.error('Admin verification error:', error);
        // On error, redirect to admin login
        router.push('/admin');
      }
    };

    verifyAdminAccess();
  }, [router]);

  // Fetch dashboard statistics
  useEffect(() => {
    // Only fetch stats if admin verification passed
    if (isVerifyingAdmin) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();

        if (result.success) {
          setStats(result.statistics);
        } else {
          setError(result.error || 'Failed to fetch statistics');
        }
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isVerifyingAdmin]);

  const dashboardCards = [
    {
      title: "Comments Monitoring",
      description: "Review and moderate user comments and feedback across all content",
      icon: MessageSquare,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900",
      route: "/admin/dashboard/comments",
      stats: [
        { 
          label: "Total Comments", 
          value: loading ? "..." : (stats?.comments.total || 0).toLocaleString(),
          icon: MessageSquare
        },
        { 
          label: "Pending Review", 
          value: loading ? "..." : (stats?.comments.pending || 0).toLocaleString(),
          icon: Clock
        },
        { 
          label: "Posted Today", 
          value: loading ? "..." : (stats?.comments.today || 0).toLocaleString(),
          icon: TrendingUp
        },
        { 
          label: "Flagged", 
          value: loading ? "..." : (stats?.comments.flagged || 0).toLocaleString(),
          icon: Flag
        }
      ]
    },
    {
      title: "Users Management",
      description: "Manage user accounts and monitor user activity",
      icon: Users,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      route: "/admin/dashboard/users",
      stats: [
        { 
          label: "Total Users", 
          value: loading ? "..." : (stats?.users.total || 0).toLocaleString(),
          icon: Users
        },
        { 
          label: "Active Users", 
          value: loading ? "..." : (stats?.users.active || 0).toLocaleString(),
          icon: UserCheck
        },
        { 
          label: "New This Week", 
          value: loading ? "..." : (stats?.users.newThisWeek || 0).toLocaleString(),
          icon: UserPlus
        },
        { 
          label: "Suspended", 
          value: loading ? "..." : (stats?.users.suspended || 0).toLocaleString(),
          icon: UserX
        }
      ]
    },
    {
      title: "Reviews & Ratings",
      description: "Monitor user feedback, ratings, and suggestions for platform improvement",
      icon: Star,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      route: "/admin/dashboard/reviews",
      stats: [
        { 
          label: "Total Reviews", 
          value: loading ? "..." : (stats?.reviews.total || 0).toLocaleString(),
          icon: Star
        },
        { 
          label: "Pending Review", 
          value: loading ? "..." : (stats?.reviews.pending || 0).toLocaleString(),
          icon: Clock
        },
        { 
          label: "This Week", 
          value: loading ? "..." : (stats?.reviews.thisWeek || 0).toLocaleString(),
          icon: TrendingUp
        },
        { 
          label: "Avg Rating", 
          value: loading ? "..." : (stats?.reviews.averageRating || 0).toFixed(1),
          icon: Star
        }
      ]
    },
    {
      title: "Security Monitoring",
      description: "Track and monitor security events, screenshot attempts, and unauthorized access",
      icon: Shield,
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900",
      route: "/admin/dashboard/security",
      stats: [
        { 
          label: "Total Events", 
          value: loading ? "..." : (stats?.security.totalEvents || 0).toLocaleString(),
          icon: Shield
        },
        { 
          label: "Screenshots", 
          value: loading ? "..." : (stats?.security.screenshotAttempts || 0).toLocaleString(),
          icon: Eye
        },
        { 
          label: "Right Clicks", 
          value: loading ? "..." : (stats?.security.rightClicks || 0).toLocaleString(),
          icon: MousePointer
        },
        { 
          label: "Dev Tools", 
          value: loading ? "..." : (stats?.security.devToolsAttempts || 0).toLocaleString(),
          icon: Code
        }
      ]
    }
  ];

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  // Show loading state while verifying admin access
  if (isVerifyingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card dark:bg-[oklch(0.205_0_0)] border border-border">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying admin access...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
      {/* Dashboard Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card 
              key={index} 
              className="bg-card dark:bg-[oklch(0.205_0_0)] border border-border hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleCardClick(card.route)}
            >
              <CardHeader className="border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center`}>
                      {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                      ) : (
                        <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {card.title}
                      </CardTitle>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {card.description}
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {card.stats.map((stat, statIndex) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={statIndex} className="p-3 bg-secondary dark:bg-[oklch(0.185_0_0)] rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <StatIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {stat.label}
                          </span>
                        </div>
                        <p className={`text-lg font-bold text-foreground ${loading ? 'animate-pulse' : ''}`}>
                          {stat.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white hover:bg-primary hover:text-white transition-all duration-200 border-border hover:border-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.route);
                    }}
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="p-4 h-auto flex-col space-y-2"
            onClick={() => router.push('/admin/dashboard/users')}
          >
            <Users className="h-5 w-5" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex-col space-y-2"
            onClick={() => router.push('/admin/dashboard/comments')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Review Comments</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex-col space-y-2"
            onClick={() => router.push('/admin/dashboard/reviews')}
          >
            <Star className="h-5 w-5" />
            <span className="text-sm">View Reviews</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-4 h-auto flex-col space-y-2"
            onClick={() => router.push('/admin/dashboard/security')}
          >
            <Shield className="h-5 w-5" />
            <span className="text-sm">Security Events</span>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading dashboard statistics...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

