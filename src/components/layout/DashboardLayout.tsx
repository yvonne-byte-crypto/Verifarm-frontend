import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { DemoModeProvider } from "@/context/DemoModeContext";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <DemoModeProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </DemoModeProvider>
  );
};

export default DashboardLayout;
