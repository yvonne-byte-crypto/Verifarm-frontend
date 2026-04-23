import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertTriangle, XCircle, Ruler, History, Heart, CloudRain } from "lucide-react";

interface Props {
  score: number;
  analyzing?: boolean;
}

interface Factor {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
  points: number;
  status: "positive" | "neutral" | "negative";
}

const FACTORS: Factor[] = [
  { icon: Ruler,     label: "Farm Size",          detail: "5 acres — verified",         points: +28, status: "positive" },
  { icon: History,   label: "Repayment History",  detail: "First loan — no history",     points:   0, status: "neutral"  },
  { icon: Heart,     label: "Livestock Health",   detail: "Verified healthy on-site",    points: +32, status: "positive" },
  { icon: CloudRain, label: "Rainfall Index",     detail: "Below average for region",    points:  -8, status: "negative" },
];

const statusStyles = {
  positive: { check: "✓", color: "text-primary",     bg: "bg-primary/10",     pts: "text-primary"     },
  neutral:  { check: "–", color: "text-muted-foreground", bg: "bg-muted",      pts: "text-muted-foreground" },
  negative: { check: "✗", color: "text-destructive",  bg: "bg-destructive/10", pts: "text-destructive"  },
};

function getRisk(score: number) {
  if (score >= 80) return { level: "Low", decision: "Approved", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", icon: ShieldCheck };
  if (score >= 60) return { level: "Medium", decision: "Needs Review", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30", icon: AlertTriangle };
  return { level: "High", decision: "Rejected", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", icon: XCircle };
}

const AIRiskAssessment = ({ score, analyzing }: Props) => {
  const risk = getRisk(score);
  const Icon = risk.icon;

  if (analyzing) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">AI analyzing farmer data…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border shadow-sm ${risk.border}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">AI Risk Assessment</CardTitle>
          <Badge variant="outline" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" /> AI Engine v2.1
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Score circle */}
          <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={score >= 80 ? "hsl(var(--primary))" : score >= 60 ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 327} 327`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className={`absolute text-3xl font-bold ${risk.color}`}>{score}</span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Risk Level:</span>
              <Badge className={`${risk.bg} ${risk.color} border-0 font-bold`}>
                <Icon className="h-3 w-3 mr-1" />
                {risk.level}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Decision:</span>
              <span className={`text-sm font-bold ${risk.color}`}>{risk.decision}</span>
            </div>
            <p className="text-xs text-muted-foreground">Score updated in real-time based on verified farm data, payment history, and risk factors.</p>
          </div>
        </div>

        {/* Score explainability breakdown */}
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Score Breakdown</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FACTORS.map((f) => {
              const s = statusStyles[f.status];
              const FactorIcon = f.icon;
              return (
                <div key={f.label} className={`flex items-start gap-2.5 rounded-lg p-2.5 ${s.bg}`}>
                  <div className="mt-0.5 shrink-0">
                    <FactorIcon className={`h-4 w-4 ${s.color}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold ${s.color}`}>{f.label}</p>
                      <span className={`text-xs font-bold tabular-nums ${s.pts}`}>
                        {f.points > 0 ? `+${f.points}` : f.points === 0 ? "±0" : f.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {f.detail}{" "}
                      <span className={`font-bold ${s.color}`}>{s.check}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRiskAssessment;
