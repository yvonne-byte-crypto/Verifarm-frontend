import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield, Building2, UserCheck, CheckCircle2, XCircle, Info,
} from "lucide-react";

const ROLES = [
  {
    role: "admin",
    label: "Super Admin",
    icon: Shield,
    color: "bg-primary/10 text-primary border-primary/30",
    description: "Full access to all platform features. Sole authority over field agent management — lenders cannot hire, approve, or manage agents.",
    permissions: [
      { label: "Dashboard & analytics", granted: true },
      { label: "All farmers (platform-wide)", granted: true },
      { label: "All loans (platform-wide)", granted: true },
      { label: "Disbursements", granted: true },
      { label: "Verification queue", granted: true },
      { label: "Approve / manage field agents", granted: true, adminOnly: true },
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
    description: "Sees only their own institution's loan portfolio and farmer profiles. Cannot access other institutions' data or manage field agents.",
    permissions: [
      { label: "Dashboard & analytics", granted: true },
      { label: "Own farmers (institution-scoped)", granted: true },
      { label: "Own loans (institution-scoped)", granted: true },
      { label: "Disbursements", granted: true },
      { label: "Verification queue", granted: false },
      { label: "Approve / manage field agents", granted: false, adminOnly: true },
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
    description: "Field officers verified and managed exclusively by VeriFarm Super Admin. Access is limited to the verification queue for their assigned region.",
    permissions: [
      { label: "Dashboard & analytics", granted: false },
      { label: "Farmers", granted: false },
      { label: "Loans", granted: false },
      { label: "Disbursements", granted: false },
      { label: "Verification queue", granted: true },
      { label: "Approve / manage field agents", granted: false, adminOnly: true },
      { label: "Trust & transparency", granted: false },
      { label: "Lender account management", granted: false },
      { label: "Approve / reject lenders", granted: false },
      { label: "Permissions & roles", granted: false },
    ],
  },
];

const ADMIN_ONLY_TOOLTIP =
  "Field agents are managed exclusively by VeriFarm Super Admin — not by individual lenders. This is part of the oracle integrity guarantee: VeriFarm personally vets every agent to ensure farm verification data cannot be manipulated by any single lending institution.";

export default function Permissions() {
  const { user } = useAuth();

  return (
    <TooltipProvider>
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
                {user.role === "agent" && (
                  <> Your access is limited to your verification queue.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Oracle integrity callout */}
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 px-5 py-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="h-4 w-4 text-secondary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-secondary">Oracle integrity guarantee</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Field agents are managed <strong>exclusively by VeriFarm Super Admin</strong> — individual lenders cannot hire, approve, or influence agents. This separation ensures that farm verification data feeding the on-chain oracle cannot be manipulated by any single lending institution. VeriFarm personally vets every field agent's identity, regional credentials, and national ID before activation.
            </p>
          </div>
        </div>

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
                        <Icon className="h-4 w-4" />
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
                    {permissions.map(({ label: pLabel, granted, adminOnly }) => (
                      <li key={pLabel} className="flex items-center gap-2.5 text-xs">
                        {granted ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={granted ? "text-foreground" : "text-muted-foreground/60"}>
                          {pLabel}
                        </span>
                        {adminOnly && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="ml-auto shrink-0">
                                <Info className="h-3 w-3 text-secondary" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-[260px] text-xs leading-relaxed">
                              {ADMIN_ONLY_TOOLTIP}
                            </TooltipContent>
                          </Tooltip>
                        )}
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
                    <tr key={p.label} className={`hover:bg-muted/30 transition-colors ${p.adminOnly ? "bg-secondary/5" : ""}`}>
                      <td className="px-4 py-2.5 text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          {p.label}
                          {p.adminOnly && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button">
                                  <Info className="h-3 w-3 text-secondary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[260px] text-xs leading-relaxed">
                                {ADMIN_ONLY_TOOLTIP}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </span>
                      </td>
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
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3 w-3 text-secondary shrink-0" />
            Rows highlighted in amber are managed exclusively by Super Admin as part of the VeriFarm oracle integrity guarantee.
          </p>
        </section>
      </div>
    </TooltipProvider>
  );
}
