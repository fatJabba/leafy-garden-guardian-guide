
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PlantDetails from "./pages/PlantDetails";
import AddPlant from "./pages/AddPlant";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { useEffect } from "react";

// Protected route component with more robust session checking
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect when we're sure authentication is complete and no user exists
    if (!loading && !user) {
      console.log("Protected route: No user, redirecting to auth", location.pathname);
      navigate("/auth", { replace: true, state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  // Show a loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading and we have a user, render the children
  return user ? <>{children}</> : null;
};

// Check if user is already logged in, redirect to home if they are
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading) {
      // If user is logged in, redirect to home or previous location
      if (user) {
        console.log("Guest route: User exists, redirecting to home");
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate, from]);

  // Show a loading state while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not loading and we don't have a user, render the children
  return !user ? <>{children}</> : null;
};

// Create QueryClient outside of component rendering to prevent recreation on renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetches when window focus changes
      retry: false, // Don't retry failed queries
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<GuestRoute><Auth /></GuestRoute>} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/plant/:id" element={<ProtectedRoute><PlantDetails /></ProtectedRoute>} />
    <Route path="/add-plant" element={<ProtectedRoute><AddPlant /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
