import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  UserCheck,
  Tag,
  Eye,
  FormInput,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: Settings,
    children: [
      {
        id: "fields",
        label: "Fields",
        icon: FormInput,
        path: "/fields",
      },
      {
        id: "forms",
        label: "Forms",
        icon: Building2,
        path: "/forms",
      },
    ],
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    children: [
      {
        id: "team-members",
        label: "Team Members",
        icon: UserCheck,
        path: "/team-members",
      },
      {
        id: "groups",
        label: "Groups",
        icon: Users,
        path: "/groups",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    icon: Tag,
    children: [
      {
        id: "tags",
        label: "Tags",
        icon: Tag,
        path: "/tags",
      },
      {
        id: "views",
        label: "Views",
        icon: Eye,
        path: "/views",
      },
    ],
  },
];

export function DashboardSidebar() {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children: any[]) => {
    return children.some((child) => isActiveRoute(child.path));
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-zocare to-zocare-dark rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              ZoCare
            </h1>
            <p className="text-sm text-sidebar-foreground/70">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.children ? (
                    <div className="space-y-1">
                      <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider mb-2">
                        {item.label}
                      </SidebarGroupLabel>
                      <SidebarMenuSub>
                        {item.children.map((child) => (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "w-full justify-start gap-3 rounded-lg h-10",
                                isActiveRoute(child.path) &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                              )}
                            >
                              <Link to={child.path}>
                                <child.icon className="w-4 h-4" />
                                <span>{child.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </div>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full justify-start gap-3 rounded-lg h-10 mb-2",
                        isActiveRoute(item.path) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      )}
                    >
                      <Link to={item.path}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-zocare text-white text-sm">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              admin@zocare.com
            </p>
          </div>
          <button className="p-1 rounded-md hover:bg-sidebar-accent transition-colors">
            <LogOut className="w-4 h-4 text-sidebar-foreground/70" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
