import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitle: Record<string, string> = {
  "/": "Dashboard Overview",
  "/fields": "Field Management",
  "/forms": "Form Management",
  "/team-members": "Team Members",
  "/groups": "Groups",
  "/tags": "Tags",
  "/views": "Views",
};

export function DashboardHeader() {
  const location = useLocation();
  const currentTitle = pageTitle[location.pathname] || "ZoCare Dashboard";

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {currentTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your ticketing system configuration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-64 pl-9 bg-muted/50" />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New form submission</p>
                  <p className="text-xs text-muted-foreground">
                    A new ticket has been created - 2 minutes ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Field updated</p>
                  <p className="text-xs text-muted-foreground">
                    Priority field options were modified - 1 hour ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New team member</p>
                  <p className="text-xs text-muted-foreground">
                    John Doe was added to the Support team - 3 hours ago
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="bg-zocare hover:bg-zocare-dark">
            Quick Actions
          </Button>
        </div>
      </div>
    </header>
  );
}
