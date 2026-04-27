import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, MapPin, FileText, Building2, Shield, User, UserCheck } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/30",
  lender: "bg-secondary/10 text-secondary border-secondary/30",
  agent: "bg-accent text-accent-foreground border-border",
};

const RoleIcon = ({ role }: { role: string }) => {
  if (role === "admin") return <Shield className="h-3 w-3" />;
  if (role === "lender") return <Building2 className="h-3 w-3" />;
  return <UserCheck className="h-3 w-3" />;
};

export function ProfileDialog({ open, onOpenChange }: Props) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    setError("");
    await new Promise((r) => setTimeout(r, 300));
    const result = updateProfile(user.id, { name });
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setUser(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            My Profile
          </DialogTitle>
        </DialogHeader>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4 border-b border-border">
          <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {initials || "?"}
          </div>
          <Badge
            variant="outline"
            className={`gap-1 ${roleColors[user.role] ?? ""}`}
          >
            <RoleIcon role={user.role} />
            {user.role === "admin"
              ? "Super Admin"
              : user.role === "lender"
              ? "Lender / Bank"
              : "Field Agent"}
          </Badge>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Editable name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">
              {user.role === "lender" ? "Institution name" : "Display name"}
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted border-0 h-11"
              required
            />
          </div>

          {/* Read-only fields */}
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <div className="flex h-11 items-center rounded-md bg-muted/50 px-3 text-sm text-muted-foreground border border-dashed border-border">
              {user.email}
            </div>
          </div>

          {user.role === "lender" && (
            <>
              {user.country && (
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <div className="flex h-11 items-center gap-2 rounded-md bg-muted/50 px-3 text-sm text-muted-foreground border border-dashed border-border">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {user.country}
                  </div>
                </div>
              )}
              {user.licenceNumber && (
                <div className="space-y-1.5">
                  <Label>Regulatory licence</Label>
                  <div className="flex h-11 items-center gap-2 rounded-md bg-muted/50 px-3 text-sm text-muted-foreground border border-dashed border-border font-mono">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    {user.licenceNumber}
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving || saved}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {saved && <CheckCircle2 className="h-4 w-4 mr-2" />}
              {saved ? "Saved!" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
