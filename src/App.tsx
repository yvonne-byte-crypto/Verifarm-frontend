import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider } from "@/components/WalletProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Farmers from "@/pages/Farmers";
import FarmerProfile from "@/pages/FarmerProfile";
import Loans from "@/pages/Loans";
import Disbursements from "@/pages/Disbursements";
import Trust from "@/pages/Trust";
import VerificationQueue from "@/pages/VerificationQueue";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WalletProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmers/:id" element={<FarmerProfile />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/disbursements" element={<Disbursements />} />
            <Route path="/verification" element={<VerificationQueue />} />
            <Route path="/trust" element={<Trust />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </WalletProvider>
);

export default App;
