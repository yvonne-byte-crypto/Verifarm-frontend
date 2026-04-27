import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerLender, registerAgent } from "@/lib/auth";
import { sendApplicationReceived } from "@/lib/email";
import verifarmLogo from "@/assets/verifarm-logo.png";
import {
  Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft,
  Building2, UserCheck, Info, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RegRole = "lender" | "agent";

const COUNTRIES = [
  "Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia",
  "Ghana", "Nigeria", "Zambia", "Malawi", "Mozambique", "Other",
];

const REGIONS = [
  "Dar es Salaam", "Dodoma", "Mwanza", "Arusha", "Mbeya",
  "Morogoro", "Tanga", "Kilimanjaro", "Nairobi", "Mombasa",
  "Kampala", "Kigali", "Addis Ababa", "Other",
];

const PasswordField = ({
  value, onChange, show, onToggle,
}: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void;
}) => (
  <div className="relative">
    <Input
      id="password"
      type={show ? "text" : "password"}
      autoComplete="new-password"
      placeholder="Min. 8 characters"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted border-0 h-11 pr-10"
      minLength={8}
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

const SelectField = ({
  id, value, onChange, options, placeholder,
}: {
  id: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string;
}) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="flex h-11 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground border-0 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    required
  >
    <option value="" disabled>{placeholder}</option>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<RegRole>("lender");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  // Lender form state
  const [lender, setLender] = useState({ name: "", email: "", password: "", country: "", licenceNumber: "" });
  const setL = (k: keyof typeof lender) => (v: string) => setLender((f) => ({ ...f, [k]: v }));

  // Agent form state
  const [agent, setAgent] = useState({ name: "", email: "", password: "", phone: "", nationalId: "", region: "" });
  const setA = (k: keyof typeof agent) => (v: string) => setAgent((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 400));

    if (role === "lender") {
      if (!lender.country) { setError("Please select a country."); setLoading(false); return; }
      const result = registerLender(lender);
      setLoading(false);
      if ("error" in result) { setError(result.error); return; }
      await sendApplicationReceived({ to_email: lender.email, to_name: lender.name, role: "lender" });
      setSubmittedName(lender.name);
    } else {
      if (!agent.region) { setError("Please select a region."); setLoading(false); return; }
      const result = registerAgent(agent);
      setLoading(false);
      if ("error" in result) { setError(result.error); return; }
      await sendApplicationReceived({ to_email: agent.email, to_name: agent.name, role: "agent" });
      setSubmittedName(agent.name);
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Application submitted</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your application for <span className="font-medium text-foreground">{submittedName}</span> is under review.
              {role === "lender"
                ? " We'll verify your regulatory licence number against the national banking registry within 1–2 business days."
                : " A VeriFarm administrator will review your credentials and regional assignment."}
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              You'll receive an email confirmation at the address you provided, and a second email when your account is activated.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate("/login")}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-7 py-8">

        {/* Header */}
        <div className="space-y-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
          <div className="flex items-center gap-3">
            <img src={verifarmLogo} alt="VeriFarm" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">VeriFarm</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Apply for access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose your role below. All applications are reviewed before activation.
            </p>
          </div>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3">
          {([
            {
              id: "lender" as RegRole,
              label: "Lender / Bank",
              icon: Building2,
              desc: "Access your institution's dashboard — loan portfolio, farmer profiles, and disbursements. Data is scoped to your institution only.",
            },
            {
              id: "agent" as RegRole,
              label: "Field Agent",
              icon: UserCheck,
              desc: "Access the verification queue for your assigned region. Submit and manage farm assessments on behalf of VeriFarm.",
            },
          ] as const).map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setRole(id); setError(""); }}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                role === id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center",
                role === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <p className={cn("text-sm font-semibold", role === id && "text-primary")}>{label}</p>
              <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
            </button>
          ))}
        </div>

        {/* Scope note */}
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 flex gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {role === "lender"
              ? "Lender accounts give access to your institution's dashboard only — you cannot view other institutions' data or manage field agents. Field agents are vouched for exclusively by VeriFarm as part of the oracle integrity guarantee."
              : "Field agent accounts give access to the verification queue only. You cannot view loan data, farmer financial profiles, or manage other accounts. All agent credentials are verified by VeriFarm admin before activation."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "lender" ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="inst-name">Institution name</Label>
                <Input id="inst-name" placeholder="e.g. KCB Bank Tanzania"
                  value={lender.name} onChange={(e) => setL("name")(e.target.value)}
                  className="bg-muted border-0 h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Official email address</Label>
                <Input id="email" type="email" autoComplete="email"
                  placeholder="lending@yourinstitution.com"
                  value={lender.email} onChange={(e) => setL("email")(e.target.value)}
                  className="bg-muted border-0 h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Set a password</Label>
                <PasswordField
                  value={lender.password} onChange={setL("password")}
                  show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Country of operation</Label>
                <SelectField id="country" value={lender.country} onChange={setL("country")}
                  options={COUNTRIES} placeholder="Select a country…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="licence">Regulatory licence number</Label>
                <Input id="licence" placeholder="e.g. BOT-2021-0042"
                  value={lender.licenceNumber} onChange={(e) => setL("licenceNumber")(e.target.value)}
                  className="bg-muted border-0 h-11" required />
                <div className="flex gap-2 rounded-lg bg-secondary/10 border border-secondary/20 px-3 py-2 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-xs text-secondary/90">
                    Your licence number will be verified against the national banking registry before approval — 1 to 2 business days.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="agent-name">Full name</Label>
                <Input id="agent-name" placeholder="e.g. Musa Juma"
                  value={agent.name} onChange={(e) => setA("name")(e.target.value)}
                  className="bg-muted border-0 h-11" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+255 7XX XXX XXX"
                    value={agent.phone} onChange={(e) => setA("phone")(e.target.value)}
                    className="bg-muted border-0 h-11" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="national-id">National ID number</Label>
                  <Input id="national-id" placeholder="NIDA / National ID"
                    value={agent.nationalId} onChange={(e) => setA("nationalId")(e.target.value)}
                    className="bg-muted border-0 h-11" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="region">Region of operation</Label>
                <SelectField id="region" value={agent.region} onChange={setA("region")}
                  options={REGIONS} placeholder="Select your primary region…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" autoComplete="email"
                  placeholder="you@email.com"
                  value={agent.email} onChange={(e) => setA("email")(e.target.value)}
                  className="bg-muted border-0 h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Set a password</Label>
                <PasswordField
                  value={agent.password} onChange={setA("password")}
                  show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
              <div className="flex gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Your application will be reviewed by VeriFarm admin before activation. You'll receive an email confirmation once approved.
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Submit application
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
