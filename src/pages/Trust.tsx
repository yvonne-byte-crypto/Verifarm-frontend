import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Brain,
  Link2,
  Lock,
  Eye,
  Smartphone,
  Hash,
} from "lucide-react";

const pillars = [
  {
    icon: Brain,
    title: "AI Asset Verification",
    desc: "Machine learning models analyze satellite imagery, sensor data, and livestock health records to produce reliable asset scores.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Link2,
    title: "Blockchain Transparency",
    desc: "Every transaction is recorded on the Solana blockchain, creating an immutable audit trail that cannot be altered.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Lock,
    title: "Smart Contract Security",
    desc: "Automated smart contracts handle collateral locking, loan approval, and disbursement — eliminating human error and bias.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Eye,
    title: "Full Audit Trail",
    desc: "Every action — from asset verification to fund transfer — is logged and visible to authorized stakeholders.",
    color: "bg-destructive/10 text-destructive",
  },
];

const ussdSteps = [
  { step: "1", label: "Dial *123#", desc: "Farmer dials USSD code on basic phone" },
  { step: "2", label: "Check Eligibility", desc: "System shows loan limit based on verified assets" },
  { step: "3", label: "Apply for Loan", desc: "Enter amount and confirm request" },
  { step: "4", label: "Receive Money", desc: "Funds sent instantly to M-Pesa" },
];

const Trust = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trust & Transparency</h1>
        <p className="text-sm text-muted-foreground">
          How Agri-Wallet ensures security, fairness, and accountability
        </p>
      </div>

      {/* Trust Pillars */}
      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map((p) => (
          <Card key={p.title} className="border-0 shadow-sm">
            <CardContent className="p-6 flex gap-4">
              <div className={`rounded-xl p-3 h-fit ${p.color}`}>
                <p.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works Visual */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">End-to-End Process</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {["Asset Data Collected", "AI Scores Generated", "Collateral Locked on Solana", "Loan Auto-Approved", "TZS Sent to Mobile Money"].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground mb-2">
                  {i + 1}
                </div>
                <p className="text-xs font-medium leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* USSD Integration */}
      <Card className="border-0 shadow-sm bg-sidebar text-sidebar-foreground">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-5 w-5 text-sidebar-primary" />
            <h3 className="font-semibold text-sidebar-primary">USSD Farmer Access</h3>
          </div>
          <p className="text-sm text-sidebar-foreground/70 mb-5">
            Farmers with basic phones access the platform by dialing <span className="font-mono font-bold text-sidebar-primary">*123#</span>. 
            No internet or smartphone required.
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {ussdSteps.map((s) => (
              <div key={s.step} className="rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
                    {s.step}
                  </div>
                  <p className="text-sm font-semibold">{s.label}</p>
                </div>
                <p className="text-xs text-sidebar-foreground/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trust;
