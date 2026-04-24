import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowRightLeft,
  ShieldCheck,
  ClipboardCheck,
  UserCheck,
  X,
} from "lucide-react";
import verifarmLogo from "@/assets/verifarm-logo.png";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", badge: undefined },
  { to: "/farmers", icon: Users, label: "Farmers", badge: undefined },
  { to: "/verification", icon: ClipboardCheck, label: "Verification Queue", badge: 5 },
  { to: "/agents", icon: UserCheck, label: "Agent Registration", badge: undefined },
  { to: "/loans", icon: Landmark, label: "Loans", badge: undefined },
  { to: "/disbursements", icon: ArrowRightLeft, label: "Disbursements", badge: undefined },
  { to: "/trust", icon: ShieldCheck, label: "Trust & Transparency", badge: undefined },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <img src={verifarmLogo} alt="VeriFarm" className="h-9 w-9 rounded-lg object-cover" />
        <span className="text-lg font-bold text-sidebar-primary">VeriFarm</span>
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="ml-auto rounded-md p-1 hover:bg-sidebar-accent md:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )
            }
          >
            <link.icon className="h-5 w-5" aria-hidden="true" />
            <span className="flex-1">{link.label}</span>
            {link.badge !== undefined && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USSD info */}
      <div className="mx-3 mb-4 rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
        <p className="text-xs font-semibold text-sidebar-primary mb-1">USSD Access</p>
        <p className="text-xs text-sidebar-foreground/60">
          Farmers dial <span className="font-mono font-bold text-sidebar-foreground">*123#</span> to access loans via basic phones.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
