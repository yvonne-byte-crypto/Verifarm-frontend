import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CloudRain, MapPin, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "info";

interface Alert {
  id: string;
  severity: Severity;
  farmer: string;
  issue: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

const alerts: Alert[] = [
  { id: "A1", severity: "critical", farmer: "Amina Wanjiku — Dodoma", issue: "Payment 18 days overdue · TZS 45,000 outstanding", time: "3 hours ago", icon: AlertCircle },
  { id: "A2", severity: "warning", farmer: "Rift Valley Region", issue: "Drought alert — 34 active loans affected in region", time: "Today 09:14", icon: CloudRain },
  { id: "A3", severity: "warning", farmer: "Jabir Hassan", issue: "Livestock count mismatch: declared 12, verified 8 on site", time: "Yesterday", icon: AlertTriangle },
  { id: "A4", severity: "info", farmer: "GPS Boundary Overlap", issue: "2 farmers with overlapping land claims — review required", time: "2 days ago", icon: MapPin },
];

const severityStyles: Record<Severity, { border: string; bg: string; text: string; label: string }> = {
  critical: { border: "border-l-destructive", bg: "bg-destructive/10", text: "text-destructive", label: "Critical" },
  warning: { border: "border-l-secondary", bg: "bg-secondary/10", text: "text-secondary", label: "Warning" },
  info: { border: "border-l-primary", bg: "bg-primary/10", text: "text-primary", label: "Info" },
};

const EarlyWarningAlerts = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Early Warning Alerts</CardTitle>
          <span className="text-xs text-muted-foreground">{alerts.length} active</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {alerts.map((a) => {
            const s = severityStyles[a.severity];
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-lg border-l-4 bg-muted/30 p-3 hover:bg-muted/50 transition-colors",
                  s.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-md p-1.5 shrink-0", s.bg)}>
                    <Icon className={cn("h-4 w-4", s.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold truncate">{a.farmer}</p>
                      <span className={cn("text-[10px] font-medium uppercase tracking-wide", s.text)}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{a.issue}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarlyWarningAlerts;
