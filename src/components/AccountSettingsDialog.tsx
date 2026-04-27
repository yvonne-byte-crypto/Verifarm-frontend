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
import { changePassword } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Eye, EyeOff, Loader2, Settings, KeyRound } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function AccountSettingsDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setCurrent(""); setNext(""); setConfirm(""); setError(""); setSaved(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    setError("");
    await new Promise((r) => setTimeout(r, 350));
    const result = changePassword(user.id, current, next);
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
      reset();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!user) return null;

  const PasswordInput = ({
    id, value, onChange, show, onToggle, placeholder, autoComplete,
  }: {
    id: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; placeholder: string; autoComplete: string;
  }) => (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="bg-muted border-0 h-11 pr-10"
        required
      />
      <button
        type="button"
        onClick={onToggle}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Account Settings
          </DialogTitle>
        </DialogHeader>

        {/* Account info (read-only) */}
        <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 border border-border">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        {/* Change password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Change password</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current-pw">Current password</Label>
            <PasswordInput
              id="current-pw"
              value={current}
              onChange={setCurrent}
              show={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
              placeholder="Your current password"
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-pw">New password</Label>
            <PasswordInput
              id="new-pw"
              value={next}
              onChange={setNext}
              show={showNext}
              onToggle={() => setShowNext(!showNext)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">Confirm new password</Label>
            <PasswordInput
              id="confirm-pw"
              value={confirm}
              onChange={setConfirm}
              show={showNext}
              onToggle={() => setShowNext(!showNext)}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {saved && (
            <p className="text-sm text-primary bg-primary/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Password updated successfully.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
