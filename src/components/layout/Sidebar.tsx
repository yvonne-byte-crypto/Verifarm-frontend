import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowRightLeft,
  ShieldCheck,
  ClipboardCheck,
  UserCheck,
  Building2,
  X,
} from "lucide-react";
import verifarmLogo from "@/assets/verifarm-logo.png";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth";

const allLinks = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "lender"] as UserRole[], badge: undefined },
  { to: "/farmers", icon: Users, label: "Farmers", roles: ["admin", "lender"] as UserRole[], badge: undefined },
  { to: "/verification", icon: ClipboardCheck, label: "Verification Queue", roles: ["admin", "agent"] as UserRole[], badge: 5 },
  { to: "/agents", icon: UserCheck, label: "Agent Registration", roles: ["admin"] as UserRole[], badge: undefined },
  { to: "/loans", icon: Landmark, label: "Loans", roles: ["admin", "lender"] as UserRole[], badge: undefined },
  { to: "/disbursements", icon: ArrowRightLeft, label: "Disbursements", roles: ["admin", "lender"] as UserRole[], badge: undefined },
  { to: "/trust", icon: ShieldCheck, label: "Trust & Transparency", roles: ["admin", "lender"] as UserRole[], badge: undefined },
  { to: "/users", icon: Building2, label: "Lender Accounts", roles: ["admin"] as UserRole[], badge: undefined },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const role = user?.role ?? "agent";

  const links = allLinks.filter((l) => l.roles.includes(role));

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

      {/* Role badge */}
      {user && (
        <div className="px-4 pt-3 pb-1">
          <span className="inline-flex items-center rounded-full bg-sidebar-accent px-2.5 py-1 text-[10px] font-semibold text-sidebar-primary uppercase tracking-wider">
            {role === "admin" ? "Super Admin" : role === "lender" ? user.institution ?? "Lender" : "Field Agent"}
          </span>
        </div>
      )}

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

      {/* USSD info — only for admin/lender */}
      {role !== "agent" && (
        <div className="mx-3 mb-4 rounded-lg border border-sidebar-border bg-sidebar-accent p-3">
          <p className="text-xs font-semibold text-sidebar-primary mb-1">USSD Access</p>
          <p className="text-xs text-sidebar-foreground/60">
            Farmers dial <span className="font-mono font-bold text-sidebar-foreground">*123#</span> to access loans via basic phones.
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
