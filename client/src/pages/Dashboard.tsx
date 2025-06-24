import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  Building2,
  Users,
  UserCheck,
  Tag,
  Eye,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Total Fields",
    value: "24",
    change: "+3 this month",
    trend: "up",
    icon: FormInput,
    href: "/fields",
    color: "primary",
  },
  {
    title: "Active Forms",
    value: "8",
    change: "+2 this week",
    trend: "up",
    icon: Building2,
    href: "/forms",
    color: "success",
  },
  {
    title: "Team Members",
    value: "156",
    change: "+12 this month",
    trend: "up",
    icon: UserCheck,
    href: "/team-members",
    color: "warning",
  },
  {
    title: "Active Groups",
    value: "18",
    change: "No change",
    trend: "neutral",
    icon: Users,
    href: "/groups",
    color: "muted",
  },
];

const recentActivity = [
  {
    id: "1",
    action: "Field created",
    description: "Priority field was created by John Doe",
    time: "2 minutes ago",
    type: "field",
    icon: FormInput,
  },
  {
    id: "2",
    action: "Form updated",
    description: "Support Ticket Form was modified",
    time: "15 minutes ago",
    type: "form",
    icon: Building2,
  },
  {
    id: "3",
    action: "User added",
    description: "Sarah Wilson joined the Support team",
    time: "1 hour ago",
    type: "user",
    icon: UserCheck,
  },
  {
    id: "4",
    action: "Tag created",
    description: "New 'Critical' tag was added",
    time: "2 hours ago",
    type: "tag",
    icon: Tag,
  },
  {
    id: "5",
    action: "View created",
    description: "Marketing team view was configured",
    time: "3 hours ago",
    type: "view",
    icon: Eye,
  },
];

const quickActions = [
  {
    title: "Create New Field",
    description: "Add a new reusable field for forms",
    icon: FormInput,
    href: "/fields",
    action: "create",
    color: "primary",
  },
  {
    title: "Design Form",
    description: "Build a new form using existing fields",
    icon: Building2,
    href: "/forms",
    action: "create",
    color: "success",
  },
  {
    title: "Invite User",
    description: "Add a new team member to the system",
    icon: UserCheck,
    href: "/team-members",
    action: "invite",
    color: "warning",
  },
  {
    title: "Create View",
    description: "Set up a custom ticket list view",
    icon: Eye,
    href: "/views",
    action: "create",
    color: "muted",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor your ticketing system configuration and activity"
        badge={{ text: "Live", variant: "secondary" }}
        actions={
          <Button
            onClick={() => navigate("/fields")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Quick Create</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-border bg-card hover:bg-accent/5"
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={cn(
                  "p-2 rounded-lg",
                  stat.color === "primary" && "bg-primary/10 text-primary",
                  stat.color === "success" && "bg-green-100 text-green-600",
                  stat.color === "warning" && "bg-yellow-100 text-yellow-600",
                  stat.color === "muted" && "bg-muted text-muted-foreground",
                )}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl sm:text-3xl font-bold text-card-foreground mb-1">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <span>{stat.change}</span>
                {stat.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-muted">
                  <activity.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(action.href)}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    action.color === "primary" && "bg-primary/10 text-primary",
                    action.color === "success" && "bg-green-100 text-green-600",
                    action.color === "warning" &&
                      "bg-yellow-100 text-yellow-600",
                    action.color === "muted" &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                API Status
              </span>
              <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Database
              </span>
              <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Cache
              </span>
              <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700">
                Degraded
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
