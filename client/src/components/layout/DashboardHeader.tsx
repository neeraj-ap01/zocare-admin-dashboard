import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const pageTitle: Record<string, string> = {
  "/": "Dashboard Overview",
  "/fields": "Field Management",
  "/forms": "Form Management",
  "/team-members": "Team Members",
  "/groups": "Groups",
  "/tags": "Tags",
  "/views": "Views",
};

const pageDescription: Record<string, string> = {
  "/": "Monitor your ticketing system performance and metrics",
  "/fields": "Configure custom fields for your ticketing system",
  "/forms": "Manage ticket submission forms and layouts",
  "/team-members": "Control user access and team member permissions",
  "/groups": "Organize team members into functional groups",
  "/tags": "Create and manage tags for ticket categorization",
  "/views": "Customize data views and reporting dashboards",
};

export function DashboardHeader() {
  const location = useLocation();
  const currentTitle = pageTitle[location.pathname] || "ZoCare Dashboard";
  const currentDescription =
    pageDescription[location.pathname] ||
    "Manage your ticketing system configuration";

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <SidebarTrigger className="lg:hidden" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
              {currentTitle}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
              {currentDescription}
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Search - Hidden on small screens */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 xl:w-64 pl-9 bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Search button for small screens */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-sm font-medium">New form submission</p>
                  <p className="text-xs text-muted-foreground">
                    A new ticket has been created - 2 minutes ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-sm font-medium">Field updated</p>
                  <p className="text-xs text-muted-foreground">
                    Priority field options were modified - 1 hour ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-sm font-medium">New team member</p>
                  <p className="text-xs text-muted-foreground">
                    John Doe was added to the Support team - 3 hours ago
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@zocare.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Action Button - Hidden on small screens */}
          <Button
            size="sm"
            className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Quick Actions
          </Button>
        </div>
      </div>
    </header>
  );
}
