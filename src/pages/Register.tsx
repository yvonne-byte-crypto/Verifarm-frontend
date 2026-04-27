import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerLender } from "@/lib/auth";
import verifarmLogo from "@/assets/verifarm-logo.png";
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const COUNTRIES = [
  "Tanzania",
  "Kenya",
  "Uganda",
  "Rwanda",
  "Ethiopia",
  "Ghana",
  "Nigeria",
  "Zambia",
  "Malawi",
  "Mozambique",
  "Other",
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    licenceNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.country) {
      setError("Please select a country.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 400));
    const result = registerLender(form);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setDone(true);
    }
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
          <div>
            <h2 className="text-2xl font-bold">Application submitted</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Your account for <span className="font-medium text-foreground">{form.name}</span> is pending review.
              A VeriFarm admin will approve your access within 1–2 business days.
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
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
          <div className="flex items-center gap-3">
            <img src={verifarmLogo} alt="VeriFarm" className="h-10 w-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">VeriFarm</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Apply for lender access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Register your institution to access the VeriFarm lending platform. New accounts are reviewed within 1–2 business days.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Institution name</Label>
            <Input
              id="name"
              placeholder="e.g. KCB Bank Tanzania"
              value={form.name}
              onChange={set("name")}
              className="bg-muted border-0 h-11"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Official email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="lending@yourinstitution.com"
              value={form.email}
              onChange={set("email")}
              className="bg-muted border-0 h-11"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Set a password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                className="bg-muted border-0 h-11 pr-10"
                minLength={8}
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

          <div className="space-y-1.5">
            <Label htmlFor="country">Country of operation</Label>
            <select
              id="country"
              value={form.country}
              onChange={set("country")}
              className="flex h-11 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground border-0 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            >
              <option value="" disabled>Select a country…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="licence">Regulatory licence number</Label>
            <Input
              id="licence"
              placeholder="e.g. BOT-2021-0042"
              value={form.licenceNumber}
              onChange={set("licenceNumber")}
              className="bg-muted border-0 h-11"
              required
            />
            <p className="text-xs text-muted-foreground">
              Issued by your national banking or microfinance regulator.
            </p>
          </div>

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
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
