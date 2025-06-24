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
  ChevronRight,
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
        badge: "12",
      },
      {
        id: "forms",
        label: "Forms",
        icon: Building2,
        path: "/forms",
        badge: "5",
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
        badge: "24",
      },
      {
        id: "groups",
        label: "Groups",
        icon: Users,
        path: "/groups",
        badge: "8",
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
        badge: "45",
      },
      {
        id: "views",
        label: "Views",
        icon: Eye,
        path: "/views",
        badge: "3",
      },
    ],
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(new Set());

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children: any[]) => {
    return children.some((child) => isActiveRoute(child.path));
  };

  const toggleGroup = (groupId: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupId)) {
      newOpenGroups.delete(groupId);
    } else {
      newOpenGroups.add(groupId);
    }
    setOpenGroups(newOpenGroups);
  };

  const handleNavigate = () => {
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Auto-open groups that contain active routes
  React.useEffect(() => {
    const newOpenGroups = new Set(openGroups);
    navigationItems.forEach((item) => {
      if (item.children && isParentActive(item.children)) {
        newOpenGroups.add(item.id);
      }
    });
    setOpenGroups(newOpenGroups);
  }, [location.pathname]);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 sm:p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-sidebar-foreground truncate">
              ZoCare
            </h1>
            <p className="text-xs sm:text-sm text-sidebar-foreground/70 truncate">
              Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 sm:px-4 py-4 sm:py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.children ? (
                    <Collapsible
                      open={openGroups.has(item.id)}
                      onOpenChange={() => toggleGroup(item.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full justify-between gap-2 sm:gap-3 rounded-lg h-9 sm:h-10 px-3",
                            isParentActive(item.children) &&
                              "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                          )}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="text-xs sm:text-sm truncate">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight
                            className={cn(
                              "w-3 h-3 sm:w-4 sm:h-4 transition-transform shrink-0",
                              openGroups.has(item.id) && "rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 sm:mt-2">
                        <SidebarMenuSub className="ml-4 sm:ml-6 space-y-1">
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "w-full justify-between gap-2 rounded-lg h-8 sm:h-9 px-2 sm:px-3",
                                  isActiveRoute(child.path) &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground font-medium border border-sidebar-ring/20",
                                )}
                              >
                                <Link to={child.path} onClick={handleNavigate}>
                                  <div className="flex items-center gap-2 min-w-0">
                                    <child.icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="text-xs sm:text-sm truncate">
                                      {child.label}
                                    </span>
                                  </div>
                                  {child.badge && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs h-4 px-1.5 shrink-0"
                                    >
                                      {child.badge}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full justify-start gap-2 sm:gap-3 rounded-lg h-9 sm:h-10 px-3 mb-1 sm:mb-2",
                        isActiveRoute(item.path) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium border border-sidebar-ring/20",
                      )}
                    >
                      <Link to={item.path} onClick={handleNavigate}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs sm:text-sm truncate">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              admin@zocare.com
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-sidebar-accent transition-colors shrink-0"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-sidebar-foreground/70" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
