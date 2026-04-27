import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/components/WalletProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Farmers from "@/pages/Farmers";
import FarmerProfile from "@/pages/FarmerProfile";
import Loans from "@/pages/Loans";
import Disbursements from "@/pages/Disbursements";
import Trust from "@/pages/Trust";
import VerificationQueue from "@/pages/VerificationQueue";
import AgentRegister from "@/pages/AgentRegister";
import AdminUsers from "@/pages/AdminUsers";
import Permissions from "@/pages/Permissions";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/farmers" element={<Farmers />} />
                <Route path="/farmers/:id" element={<FarmerProfile />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/disbursements" element={<Disbursements />} />
                <Route path="/verification" element={<VerificationQueue />} />
                <Route path="/agents" element={<AgentRegister />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/permissions" element={<Permissions />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </WalletProvider>
  </AuthProvider>
);

export default App;
