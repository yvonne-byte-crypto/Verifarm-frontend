import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import verifarmLogo from "@/assets/verifarm-logo.png";
import { Eye, EyeOff, FlaskConical, Loader2, Leaf, Shield, Building2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type RoleOption = "admin" | "lender" | "agent";

const ROLES: {
  id: RoleOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: "admin",
    label: "Super Admin",
    icon: Shield,
    description: "Full platform access — manage lenders, agents, loans, and system settings.",
  },
  {
    id: "lender",
    label: "Lender / Bank",
    icon: Building2,
    description: "Access your institution's loan portfolio and farmer profiles.",
  },
  {
    id: "agent",
    label: "Field Agent",
    icon: UserCheck,
    description: "Submit and manage farm verifications in your assigned region.",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleOption>("lender");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    override?: { email: string; password: string }
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const creds = override ?? { email, password };
    await new Promise((r) => setTimeout(r, 350));
    const result = login(creds.email, creds.password);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setUser(result.user);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <img src={verifarmLogo} alt="VeriFarm" className="h-10 w-10 rounded-xl object-cover" />
          <span className="text-xl font-bold text-primary-foreground">VeriFarm</span>
        </div>
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Agricultural micro-lending for East Africa
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Powered by Solana — transparent, instant, borderless.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "2,847", label: "Active Farmers" },
            { value: "TZS 1.2B", label: "Disbursed" },
            { value: "94%", label: "Repayment Rate" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 p-4">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-primary-foreground/60 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <img src={verifarmLogo} alt="VeriFarm" className="h-14 w-14 rounded-2xl object-cover shadow-lg" />
            <h1 className="text-2xl font-bold">VeriFarm</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Select your role to sign in</p>
          </div>

          {/* Role selector */}
          <div className="space-y-2">
            {ROLES.map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedRole(id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                  selectedRole === id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                  selectedRole === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm font-semibold", selectedRole === id ? "text-primary" : "text-foreground")}>
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
                </div>
                <div className={cn(
                  "h-4 w-4 rounded-full border-2 shrink-0 mt-1 ml-auto transition-colors",
                  selectedRole === id ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {selectedRole === id && (
                    <div className="h-full w-full rounded-full flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border-0 h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted border-0 h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Sign in as {ROLES.find((r) => r.id === selectedRole)?.label}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Demo login — bypasses role selection */}
          <Button
            variant="outline"
            className="w-full h-11 border-primary/40 text-primary hover:bg-primary/10"
            onClick={(e) =>
              handleSubmit(e, { email: "admin@verifarm.co.tz", password: "admin123" })
            }
            disabled={loading}
          >
            <FlaskConical className="h-4 w-4 mr-2" />
            Demo Login — Full Admin Access
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New to VeriFarm?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Apply for access
            </Link>
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">© 2026 VeriFarm · Powered by Solana</p>
      </div>
    </div>
  );
};

export default Login;
