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
    <header className="sticky top-0 z-40 h-12 sm:h-14 md:h-16 lg:h-18 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
          {/* Sidebar trigger - always visible for mobile, tablet, and desktop */}
          <SidebarTrigger className="shrink-0" />

          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-foreground truncate">
              {currentTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate hidden sm:block">
              {currentDescription}
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
          {/* Search - Progressive disclosure based on screen size */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2 lg:left-3 top-1/2 h-3 w-3 lg:h-4 lg:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-32 md:w-40 lg:w-48 xl:w-64 2xl:w-72 pl-7 lg:pl-9 h-8 lg:h-10 text-xs lg:text-sm bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Search button for small screens */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:h-10 lg:w-10 md:hidden"
          >
            <Search className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 lg:h-10 lg:w-10"
              >
                <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 sm:w-72 md:w-80 lg:w-96"
            >
              <DropdownMenuLabel className="font-semibold text-sm lg:text-base">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 lg:p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-xs lg:text-sm font-medium">
                    New form submission
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A new ticket has been created - 2 minutes ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 lg:p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-xs lg:text-sm font-medium">
                    Field updated
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Priority field options were modified - 1 hour ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3 lg:p-4 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-xs lg:text-sm font-medium">
                    New team member
                  </p>
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
                className="relative h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full p-0"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs lg:text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56 lg:w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs lg:text-sm font-medium leading-none">
                    Admin User
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@zocare.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm">
                <User className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm">
                <Settings className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs lg:text-sm text-destructive focus:text-destructive">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Action Button - Progressive disclosure */}
          <Button
            size="sm"
            className="hidden sm:flex h-7 sm:h-8 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs lg:text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <span className="hidden lg:inline">Quick Actions</span>
            <span className="lg:hidden">Actions</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
