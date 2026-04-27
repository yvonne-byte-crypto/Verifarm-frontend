import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Shield, Building2, UserCheck,
  LayoutDashboard, Users, Landmark, ArrowRightLeft,
  ShieldCheck, ClipboardCheck, UserCog, CheckCircle2, XCircle,
} from "lucide-react";

const ROLES = [
  {
    role: "admin",
    label: "Super Admin",
    icon: Shield,
    color: "bg-primary/10 text-primary border-primary/30",
    description: "Full access to all platform features. Manages lender approvals, agents, and system configuration.",
    permissions: [
      { label: "Dashboard & analytics", granted: true },
      { label: "All farmers (platform-wide)", granted: true },
      { label: "All loans (platform-wide)", granted: true },
      { label: "Disbursements", granted: true },
      { label: "Verification queue", granted: true },
      { label: "Agent registration", granted: true },
      { label: "Trust & transparency", granted: true },
      { label: "Lender account management", granted: true },
      { label: "Approve / reject lenders", granted: true },
      { label: "Permissions & roles", granted: true },
    ],
  },
  {
    role: "lender",
    label: "Lender / Bank",
    icon: Building2,
    color: "bg-secondary/10 text-secondary border-secondary/30",
    description: "Sees only their own institution's loan portfolio and associated farmers. Cannot access other lenders' data.",
    permissions: [
      { label: "Dashboard & analytics", granted: true },
      { label: "Own farmers (institution-scoped)", granted: true },
      { label: "Own loans (institution-scoped)", granted: true },
      { label: "Disbursements", granted: true },
      { label: "Verification queue", granted: false },
      { label: "Agent registration", granted: false },
      { label: "Trust & transparency", granted: true },
      { label: "Lender account management", granted: false },
      { label: "Approve / reject lenders", granted: false },
      { label: "Permissions & roles", granted: false },
    ],
  },
  {
    role: "agent",
    label: "Field Agent",
    icon: UserCheck,
    color: "bg-muted text-foreground border-border",
    description: "Field officers who perform farm verifications. Only see the verification queue relevant to their assignments.",
    permissions: [
      { label: "Dashboard & analytics", granted: false },
      { label: "Farmers", granted: false },
      { label: "Loans", granted: false },
      { label: "Disbursements", granted: false },
      { label: "Verification queue", granted: true },
      { label: "Agent registration", granted: false },
      { label: "Trust & transparency", granted: false },
      { label: "Lender account management", granted: false },
      { label: "Approve / reject lenders", granted: false },
      { label: "Permissions & roles", granted: false },
    ],
  },
];

const NAV_FEATURES = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Farmers" },
  { icon: Landmark, label: "Loans" },
  { icon: ArrowRightLeft, label: "Disbursements" },
  { icon: ClipboardCheck, label: "Verification Queue" },
  { icon: UserCog, label: "Agent Registration" },
  { icon: ShieldCheck, label: "Trust & Transparency" },
  { icon: Building2, label: "Lender Accounts" },
];

export default function Permissions() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Permissions & Roles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of access control across all user roles in the VeriFarm platform.
        </p>
      </div>

      {/* Your current role callout */}
      {user && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Your current role</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              You are signed in as{" "}
              <span className="font-medium text-foreground">{user.name}</span> with the{" "}
              <span className="font-medium text-primary capitalize">{user.role}</span> role.
              {user.role === "lender" && user.institution && (
                <> Your data is scoped to <span className="font-medium text-foreground">{user.institution}</span>.</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Role cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {ROLES.map(({ role, label, icon: Icon, color, description, permissions }) => {
          const isCurrentRole = user?.role === role;
          return (
            <Card
              key={role}
              className={`border shadow-sm ${isCurrentRole ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-base">{label}</CardTitle>
                  </div>
                  {isCurrentRole && (
                    <Badge className="text-[10px] shrink-0">Your role</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">{description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {permissions.map(({ label: pLabel, granted }) => (
                    <li key={pLabel} className="flex items-center gap-2.5 text-xs">
                      {granted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={granted ? "text-foreground" : "text-muted-foreground/60"}>
                        {pLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature access matrix */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Feature access matrix</h2>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Feature</th>
                  {ROLES.map((r) => (
                    <th key={r.role} className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ROLES[0].permissions.map((p, i) => (
                  <tr key={p.label} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-medium">{p.label}</td>
                    {ROLES.map((r) => (
                      <td key={r.role} className="px-4 py-2.5 text-center">
                        {r.permissions[i].granted ? (
                          <CheckCircle2 className="h-4 w-4 text-primary mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
