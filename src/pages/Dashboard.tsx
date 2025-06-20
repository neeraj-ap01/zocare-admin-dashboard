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
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useNavigate } from "react-router-dom";

const statsCards = [
  {
    title: "Total Fields",
    value: "24",
    change: "+3 this month",
    trend: "up",
    icon: FormInput,
    href: "/fields",
  },
  {
    title: "Active Forms",
    value: "8",
    change: "+2 this week",
    trend: "up",
    icon: Building2,
    href: "/forms",
  },
  {
    title: "Team Members",
    value: "156",
    change: "+12 this month",
    trend: "up",
    icon: UserCheck,
    href: "/team-members",
  },
  {
    title: "Active Groups",
    value: "18",
    change: "No change",
    trend: "neutral",
    icon: Users,
    href: "/groups",
  },
];

const recentActivity = [
  {
    id: "1",
    action: "Field created",
    description: "Priority field was created by John Doe",
    time: "2 minutes ago",
    type: "field",
  },
  {
    id: "2",
    action: "Form updated",
    description: "Support Ticket Form was modified",
    time: "15 minutes ago",
    type: "form",
  },
  {
    id: "3",
    action: "User added",
    description: "Sarah Wilson joined the Support team",
    time: "1 hour ago",
    type: "user",
  },
  {
    id: "4",
    action: "Tag created",
    description: "New 'Critical' tag was added",
    time: "2 hours ago",
    type: "tag",
  },
];

const quickActions = [
  {
    title: "Create New Field",
    description: "Add a new reusable field for forms",
    icon: FormInput,
    href: "/fields",
    action: "create",
  },
  {
    title: "Design Form",
    description: "Build a new form using existing fields",
    icon: Building2,
    href: "/forms",
    action: "create",
  },
  {
    title: "Invite User",
    description: "Add a new team member to the system",
    icon: UserCheck,
    href: "/team-members",
    action: "invite",
  },
  {
    title: "Create View",
    description: "Set up a custom ticket list view",
    icon: Eye,
    href: "/views",
    action: "create",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor your ticketing system configuration and activity"
        badge={{ text: "Live", variant: "secondary" }}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{stat.change}</span>
                {stat.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-zocare-success" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-2 h-2 rounded-full bg-zocare mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(action.href)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-md bg-zocare/10 flex items-center justify-center">
                      <action.icon className="h-4 w-4 text-zocare" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-zocare-success/10">
              <div>
                <p className="text-sm font-medium">API Status</p>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-zocare-success/20 text-zocare-success"
              >
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-zocare/10">
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">
                  Connection stable
                </p>
              </div>
              <Badge variant="secondary" className="bg-zocare/20 text-zocare">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="outline">Recent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
