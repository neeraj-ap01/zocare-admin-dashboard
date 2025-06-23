import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Import all pages
import Dashboard from "@/pages/Dashboard";
import Fields from "@/pages/Fields";
import Forms from "@/pages/Forms";
import TeamMembers from "@/pages/TeamMembers";
import Groups from "@/pages/Groups";
import Tags from "@/pages/Tags";
import Views from "@/pages/Views";
import NotFound from "@/pages/NotFound";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="fields" element={<Fields />} />
                <Route path="forms" element={<Forms />} />
                <Route path="team-members" element={<TeamMembers />} />
                <Route path="groups" element={<Groups />} />
                <Route path="tags" element={<Tags />} />
                <Route path="views" element={<Views />} />
              </Route>
              {/* Catch-all route for 404 pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <SonnerToaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
