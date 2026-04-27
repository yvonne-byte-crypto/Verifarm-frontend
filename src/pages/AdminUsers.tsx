import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllLenders, approveLender, rejectLender } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import { sendAccountApproved } from "@/lib/email";
import { Building2, CheckCircle2, XCircle, Clock, MapPin, FileText, UserCheck } from "lucide-react";

const statusBadge = (status: AuthUser["status"]) => {
  if (status === "active")
    return <Badge className="bg-primary/15 text-primary border-primary/30 border">Approved</Badge>;
  if (status === "pending")
    return <Badge className="bg-secondary/15 text-secondary border-secondary/30 border">Pending</Badge>;
  return <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/30 border">Rejected</Badge>;
};

const AdminUsers = () => {
  const [lenders, setLenders] = useState<AuthUser[]>(() => getAllLenders());

  const refresh = () => setLenders(getAllLenders());

  const approve = async (id: string) => {
    const user = approveLender(id);
    refresh();
    if (user) {
      await sendAccountApproved({ to_email: user.email, to_name: user.name, role: user.role });
    }
  };

  const reject = (id: string) => {
    rejectLender(id);
    refresh();
  };

  const pending = lenders.filter((l) => l.status === "pending");
  const others = lenders.filter((l) => l.status !== "pending");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">User Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject lender and field agent access requests
        </p>
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-secondary" />
            <h2 className="text-sm font-semibold">Pending approval ({pending.length})</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pending.map((lender) => (
              <Card key={lender.id} className="border border-secondary/30 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm truncate">{lender.institution}</CardTitle>
                        <p className="text-xs text-muted-foreground truncate">{lender.email}</p>
                      </div>
                    </div>
                    {statusBadge(lender.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {lender.country}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      Licence: {lender.licenceNumber}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => approve(lender.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => reject(lender.id)}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All lenders */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">All institutions ({lenders.length})</h2>
        </div>
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Institution</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Country</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Licence</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lenders.map((lender) => (
                  <tr key={lender.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{lender.institution}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{lender.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{lender.country}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden lg:table-cell">{lender.licenceNumber}</td>
                    <td className="px-4 py-3">{statusBadge(lender.status)}</td>
                    <td className="px-4 py-3 text-right">
                      {lender.status === "pending" && (
                        <div className="inline-flex gap-2">
                          <Button size="sm" className="h-7 text-xs px-3" onClick={() => approve(lender.id)}>
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-3 text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => reject(lender.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {lender.status !== "pending" && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {lenders.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No lender accounts yet</p>
          <p className="text-sm mt-1">New registrations will appear here for review.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
