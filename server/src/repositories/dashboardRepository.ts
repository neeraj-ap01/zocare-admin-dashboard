import { DashboardStats, RecentActivity } from "../shared/types";
import { mockData, simulateDelay } from "@/data/mockData";

export class DashboardRepository {
  /**
   * Get dashboard statistics
   */
  static async getStats(): Promise<DashboardStats> {
    await simulateDelay();

    // Calculate real-time stats from mock data
    const stats: DashboardStats = {
      totalFields: mockData.fields.length,
      activeForms: mockData.forms.filter((f) => f.isActive).length,
      teamMembers: mockData.users.filter((u) => u.isActive).length,
      activeGroups: mockData.groups.length,
      totalTags: mockData.tags.filter((t) => t.isActive).length,
      customViews: mockData.views.length,
    };

    return stats;
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(
    limit: number = 10,
  ): Promise<RecentActivity[]> {
    await simulateDelay();

    // Return the most recent activities, limited by the specified count
    return mockData.recentActivity
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  }

  /**
   * Add new activity
   */
  static async addActivity(
    activity: Omit<RecentActivity, "id">,
  ): Promise<RecentActivity> {
    await simulateDelay();

    const newActivity: RecentActivity = {
      id: (mockData.recentActivity.length + 1).toString(),
      ...activity,
    };

    mockData.recentActivity.unshift(newActivity);

    // Keep only the last 50 activities
    if (mockData.recentActivity.length > 50) {
      mockData.recentActivity = mockData.recentActivity.slice(0, 50);
    }

    return newActivity;
  }

  /**
   * Get system health status
   */
  static async getHealth() {
    await simulateDelay();

    return {
      status: "healthy" as const,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: "connected" as const,
        cache: "connected" as const,
      },
    };
  }

  /**
   * Get aggregated statistics for charts and reports
   */
  static async getAnalytics() {
    await simulateDelay();

    // Mock analytics data
    const ticketsByPriority = {
      low: 15,
      medium: 25,
      high: 12,
      critical: 3,
    };

    const ticketsByStatus = {
      open: 30,
      inProgress: 15,
      resolved: 45,
      closed: 10,
    };

    const teamPerformance = mockData.users.map((user) => ({
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      ticketsResolved: Math.floor(Math.random() * 20) + 5,
      avgResponseTime: Math.floor(Math.random() * 120) + 30, // minutes
      satisfaction: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
    }));

    const weeklyTrends = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      created: Math.floor(Math.random() * 15) + 5,
      resolved: Math.floor(Math.random() * 12) + 3,
    })).reverse();

    return {
      ticketsByPriority,
      ticketsByStatus,
      teamPerformance,
      weeklyTrends,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get quick action suggestions
   */
  static async getQuickActions() {
    await simulateDelay();

    const actions = [
      {
        id: "create-field",
        title: "Create New Field",
        description: "Add a new reusable field for forms",
        icon: "FormInput",
        href: "/fields",
        priority: 1,
      },
      {
        id: "design-form",
        title: "Design Form",
        description: "Build a new form using existing fields",
        icon: "Building2",
        href: "/forms",
        priority: 2,
      },
      {
        id: "invite-user",
        title: "Invite User",
        description: "Add a new team member to the system",
        icon: "UserCheck",
        href: "/team-members",
        priority: 3,
      },
      {
        id: "create-view",
        title: "Create View",
        description: "Set up a custom ticket list view",
        icon: "Eye",
        href: "/views",
        priority: 4,
      },
    ];

    return actions.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get system notifications
   */
  static async getNotifications() {
    await simulateDelay();

    const notifications = [
      {
        id: "1",
        type: "info",
        title: "System Update",
        message:
          "A new version will be deployed tonight during maintenance window",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
      },
      {
        id: "2",
        type: "warning",
        title: "High Ticket Volume",
        message: "Ticket volume is 30% higher than usual today",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isRead: false,
      },
      {
        id: "3",
        type: "success",
        title: "Backup Completed",
        message: "Daily backup completed successfully",
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        isRead: true,
      },
    ];

    return notifications;
  }
}
