import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-zocare to-zocare-dark rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button asChild className="bg-zocare hover:bg-zocare-dark">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your administrator or check the{" "}
              <Link to="/" className="text-zocare hover:underline">
                main dashboard
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
