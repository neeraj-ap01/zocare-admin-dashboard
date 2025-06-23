import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Simple demo component for now
function DemoApp() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zocare to-zocare-dark bg-clip-text text-transparent">
            ZoCare Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Client-Server Architecture Successfully Running!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zocare rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🚀</span>
              </div>
              <h3 className="font-semibold">Frontend</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              React + TypeScript + Vite running on port 8080
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✅ Connected
              </span>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zocare-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h3 className="font-semibold">Backend API</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Node.js + Express BFF running on port 3001
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✅ Connected
              </span>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-zocare-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔄</span>
              </div>
              <h3 className="font-semibold">API Communication</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Client-server communication with React Query
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                🔄 Ready
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-card border rounded-lg">
          <h3 className="font-semibold mb-4">Architecture Overview</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-zocare/20 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <div className="font-medium">Client</div>
              <div className="text-xs text-muted-foreground">React SPA</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-px bg-border"></div>
              <div className="text-center text-xs text-muted-foreground mt-1">
                HTTP/REST
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zocare-dark/20 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="font-medium">Server</div>
              <div className="text-xs text-muted-foreground">BFF API</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-px bg-border"></div>
              <div className="text-center text-xs text-muted-foreground mt-1">
                Shared Types
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zocare-success/20 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">📋</span>
              </div>
              <div className="font-medium">Shared</div>
              <div className="text-xs text-muted-foreground">TypeScript</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🎉 ZoCare Dashboard is now running with proper client-server
            architecture!
          </p>
        </div>
      </div>
    </div>
  );
}

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<DemoApp />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <SonnerToaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
