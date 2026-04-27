import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllApplications, approveUser, rejectUser, getIdPhoto, type AuthUser,
} from "@/lib/auth";
import { sendAccountApproved, sendApplicationRejected } from "@/lib/email";
import {
  CheckCircle2, XCircle, Globe, Camera, Clock, Building2, UserCheck,
  Eye, EyeOff, ShieldAlert, LogOut, AlertCircle, Loader2, RefreshCw,
} from "lucide-react";

const SESSION_KEY = "vf_admin_portal_auth";
const ADMIN_PASSWORD = "VF-Admin-2026";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Incorrect password.");
      setPw("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-sm border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Admin Portal</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Restricted access — VeriFarm staff only</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-pw">Admin password</Label>
              <div className="relative">
                <Input
                  id="admin-pw"
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  className="bg-muted border-0 h-11 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full h-11">Enter Admin Portal</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function IdMethodBadge({ method }: { method?: string }) {
  if (method === "world_id") {
    return (
      <Badge variant="outline" className="gap-1 text-xs border-primary/30 text-primary bg-primary/5">
        <Globe className="h-3 w-3" /> World ID
      </Badge>
    );
  }
  if (method === "national_id_photo") {
    return (
      <Badge variant="outline" className="gap-1 text-xs border-secondary/30 text-secondary bg-secondary/5">
        <Camera className="h-3 w-3" /> National ID Photo
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>
  );
}

export default function AdminPortal() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [applications, setApplications] = useState<AuthUser[]>([]);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (unlocked) loadApplications();
  }, [unlocked]);

  const loadApplications = () => {
    const pending = getAllApplications().filter((u) => u.status === "pending");
    setApplications(pending);
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = async (user: AuthUser) => {
    setBusyId(user.id);
    const updated = approveUser(user.id);
    if (updated) {
      await sendAccountApproved({ to_email: user.email, to_name: user.name, role: user.role }).catch(() => {});
      showToast("success", `${user.name} approved and notified by email.`);
    }
    setBusyId(null);
    loadApplications();
  };

  const handleReject = async (user: AuthUser) => {
    if (!rejectReason.trim()) return;
    setBusyId(user.id);
    const updated = rejectUser(user.id);
    if (updated) {
      await sendApplicationRejected({ to_email: user.email, to_name: user.name, role: user.role, reason: rejectReason.trim() }).catch(() => {});
      showToast("success", `${user.name}'s application rejected.`);
    }
    setRejectingId(null);
    setRejectReason("");
    setBusyId(null);
    loadApplications();
  };

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h1 className="text-base font-bold">VeriFarm Admin Portal</h1>
            <p className="text-xs text-muted-foreground">Pending registration reviews</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={loadApplications}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false); }}
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-destructive text-destructive-foreground"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-border bg-card px-5 py-3 flex items-center gap-3">
            <Clock className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pending review</p>
              <p className="text-lg font-bold">{applications.length}</p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary/30 mb-3" />
            <p className="font-medium">All caught up</p>
            <p className="text-sm text-muted-foreground mt-1">No pending applications at the moment.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Applicant</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Licence / ID method</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Country / Region</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Applied</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((app) => {
                    const photo = app.role === "agent" && app.idMethod === "national_id_photo" ? getIdPhoto(app.id) : null;
                    const isRejecting = rejectingId === app.id;
                    const isBusy = busyId === app.id;
                    return (
                      <>
                        <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                app.role === "lender" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                              }`}>
                                {app.role === "lender" ? <Building2 className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                              </div>
                              <div>
                                <p className="font-medium text-xs">{app.name}</p>
                                {app.institution && <p className="text-xs text-muted-foreground">{app.institution}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-xs capitalize ${
                              app.role === "lender" ? "border-secondary/30 text-secondary" : "border-primary/30 text-primary"
                            }`}>
                              {app.role === "lender" ? "Lender" : "Field Agent"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{app.email}</td>
                          <td className="px-4 py-3">
                            {app.role === "lender" ? (
                              <div className="space-y-1">
                                <p className="text-xs font-mono">{app.licenceNumber ?? "—"}</p>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <IdMethodBadge method={app.idMethod} />
                                {app.nationalIdNumber && (
                                  <p className="text-xs font-mono text-muted-foreground">{app.nationalIdNumber}</p>
                                )}
                                {photo && (
                                  <img
                                    src={photo}
                                    alt="National ID"
                                    className="h-10 w-16 object-cover rounded border border-border cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => window.open(photo, "_blank")}
                                    title="Click to view full size"
                                  />
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{app.country ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {app.registeredAt
                              ? new Date(app.registeredAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                className="h-8 px-3 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleApprove(app)}
                                disabled={isBusy || isRejecting}
                              >
                                {isBusy && !isRejecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/5"
                                onClick={() => { setRejectingId(isRejecting ? null : app.id); setRejectReason(""); }}
                                disabled={isBusy}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isRejecting && (
                          <tr key={`${app.id}-reject`} className="bg-destructive/5">
                            <td colSpan={7} className="px-4 py-3">
                              <div className="flex items-end gap-3 max-w-xl">
                                <div className="flex-1 space-y-1">
                                  <Label className="text-xs">Rejection reason (sent to applicant)</Label>
                                  <Input
                                    placeholder="e.g. Licence number not found in national banking registry"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="h-9 text-xs"
                                    autoFocus
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-9 px-4 text-xs shrink-0"
                                  onClick={() => handleReject(app)}
                                  disabled={!rejectReason.trim() || isBusy}
                                >
                                  {isBusy ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                  Confirm rejection
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 text-xs"
                                  onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
