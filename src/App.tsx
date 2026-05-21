import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
const DashboardLayout  = lazy(() => import("@/components/layout/DashboardLayout"));
const Login            = lazy(() => import("@/pages/Login"));
const Register         = lazy(() => import("@/pages/Register"));
const Dashboard        = lazy(() => import("@/pages/Dashboard"));
const Farmers          = lazy(() => import("@/pages/Farmers"));
const FarmerProfile    = lazy(() => import("@/pages/FarmerProfile"));
const Loans            = lazy(() => import("@/pages/Loans"));
const Disbursements    = lazy(() => import("@/pages/Disbursements"));
const Trust            = lazy(() => import("@/pages/Trust"));
const VerificationQueue = lazy(() => import("@/pages/VerificationQueue"));
const AgentRegister    = lazy(() => import("@/pages/AgentRegister"));
const AdminUsers       = lazy(() => import("@/pages/AdminUsers"));
const Permissions      = lazy(() => import("@/pages/Permissions"));
const AdminPortal      = lazy(() => import("@/pages/AdminPortal"));
const NotFound         = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

// Minimal skeleton shown while a lazy page chunk loads
const PageLoader = () => (
  <div className="flex h-full min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-portal-x7k2" element={<AdminPortal />} />
                <Route element={<DashboardLayout />}>
                  <Route path="/"           element={<Dashboard />} />
                  <Route path="/farmers"    element={<Farmers />} />
                  <Route path="/farmers/:id" element={<FarmerProfile />} />
                  <Route path="/loans"      element={<Loans />} />
                  <Route path="/disbursements" element={<Disbursements />} />
                  <Route path="/verification" element={<VerificationQueue />} />
                  <Route path="/agents"     element={<AgentRegister />} />
                  <Route path="/trust"      element={<Trust />} />
                  <Route path="/users"      element={<AdminUsers />} />
                  <Route path="/permissions" element={<Permissions />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
