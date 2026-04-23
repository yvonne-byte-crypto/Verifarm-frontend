import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Send,
  Clock,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const loanSteps = [
  { icon: FileText, label: "Loan Requested", desc: "Farmer submits loan request via USSD or platform" },
  { icon: ShieldCheck, label: "Asset Verified", desc: "AI verifies land and livestock data" },
  { icon: Zap, label: "Smart Contract", desc: "Solana smart contract locks collateral" },
  { icon: CheckCircle2, label: "Loan Approved", desc: "Automated approval based on asset score" },
  { icon: Send, label: "Funds Disbursed", desc: "USDC converted to TZS, sent to M-Pesa" },
];

type RiskLevel = "Low" | "Medium" | "High";

const activeLoans = [
  { id: "LN-001", farmerId: "F001", farmer: "Amina Juma", amount: "300,000", issued: "Mar 1, 2026", due: "Mar 31, 2026", status: "active", progress: 65, currentStep: 5, aiScore: 87 },
  { id: "LN-002", farmerId: "F002", farmer: "Baraka Mwenda", amount: "500,000", issued: "Feb 15, 2026", due: "Mar 15, 2026", status: "overdue", progress: 100, currentStep: 5, aiScore: 48 },
  { id: "LN-003", farmerId: "F004", farmer: "Daudi Kileo", amount: "800,000", issued: "Mar 10, 2026", due: "Apr 10, 2026", status: "active", progress: 30, currentStep: 5, aiScore: 72 },
  { id: "LN-004", farmerId: "F005", farmer: "Ester Nkya", amount: "200,000", issued: "Mar 5, 2026", due: "Apr 5, 2026", status: "active", progress: 45, currentStep: 4, aiScore: 81 },
  { id: "LN-005", farmerId: "F003", farmer: "Chiku Lema", amount: "150,000", issued: "Feb 20, 2026", due: "Mar 20, 2026", status: "repaid", progress: 100, currentStep: 5, aiScore: 92 },
];

const getRisk = (score: number): RiskLevel =>
  score >= 80 ? "Low" : score >= 55 ? "Medium" : "High";

const riskClasses: Record<RiskLevel, string> = {
  Low: "bg-primary/15 text-primary border-primary/30",
  Medium: "bg-secondary/15 text-secondary border-secondary/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
};

const scoreBadgeClass = (score: number) =>
  score >= 80
    ? "bg-primary text-primary-foreground"
    : score >= 55
    ? "bg-secondary text-white"
    : "bg-destructive text-destructive-foreground";

const riskFilterOptions: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Low", label: "Low Risk" },
  { value: "Medium", label: "Medium Risk" },
  { value: "High", label: "High Risk" },
];

const Loans = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(4);
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      activeLoans.filter((l) => {
        const risk = getRisk(l.aiScore);
        return riskFilter === "all" || risk === riskFilter;
      }),
    [riskFilter]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Loan Management</h1>
        <p className="text-sm text-muted-foreground">Track and manage all loan lifecycle stages</p>
      </div>

      {/* Interactive Loan Flow */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Loan Lifecycle — Click to explore</CardTitle>
            <Badge variant="outline" className="text-[10px]">Interactive Demo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0">
            {loanSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 md:flex-1">
                <div
                  className="flex items-center gap-3 md:flex-col md:text-center md:gap-2 flex-1 cursor-pointer group"
                  onClick={() => setActiveStep(i)}
                >
                  <div
                    className={cn(
                      "rounded-xl p-3 shrink-0 transition-all duration-300",
                      i <= activeStep
                        ? "gradient-primary scale-100 shadow-md"
                        : "bg-muted scale-90"
                    )}
                  >
                    <step.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        i <= activeStep ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-semibold transition-colors",
                      i <= activeStep ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground hidden md:block">{step.desc}</p>
                  </div>
                </div>
                {i < loanSteps.length - 1 && (
                  <div className={cn(
                    "h-0.5 w-8 md:w-auto md:flex-1 mx-1 rounded transition-colors duration-500 hidden md:block",
                    i < activeStep ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted rounded-xl animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const StepIcon = loanSteps[activeStep].icon;
                return <StepIcon className="h-4 w-4 text-primary" />;
              })()}
              <p className="font-semibold text-sm">Step {activeStep + 1}: {loanSteps[activeStep].label}</p>
            </div>
            <p className="text-sm text-muted-foreground">{loanSteps[activeStep].desc}</p>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-base font-semibold">All Loans</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {riskFilterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRiskFilter(opt.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    riskFilter === opt.value
                      ? opt.value === "all"
                        ? "bg-foreground text-background border-foreground"
                        : opt.value === "Low"
                        ? "bg-primary text-primary-foreground border-primary"
                        : opt.value === "Medium"
                        ? "bg-secondary text-white border-secondary"
                        : "bg-destructive text-destructive-foreground border-destructive"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">ID</th>
                  <th className="text-left py-3 px-2 font-medium">Farmer</th>
                  <th className="text-left py-3 px-2 font-medium">Amount (TZS)</th>
                  <th className="text-left py-3 px-2 font-medium">AI Score</th>
                  <th className="text-left py-3 px-2 font-medium">Risk Level</th>
                  <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Repayment</th>
                  <th className="text-left py-3 px-2 font-medium hidden sm:table-cell">Due</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                  <th className="text-left py-3 px-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan) => {
                  const risk = getRisk(loan.aiScore);
                  return (
                    <tr
                      key={loan.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/farmers/${loan.farmerId}`)}
                    >
                      <td className="py-3 px-2 font-mono text-xs">{loan.id}</td>
                      <td className="py-3 px-2 font-medium">{loan.farmer}</td>
                      <td className="py-3 px-2">{loan.amount}</td>
                      <td className="py-3 px-2">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold", scoreBadgeClass(loan.aiScore))}>
                          {loan.aiScore}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={cn("text-[10px] border", riskClasses[risk])}>
                          {risk}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={loan.progress} className="h-1.5 w-16" aria-label={`Repayment progress: ${loan.progress}%`} />
                          <span className="text-xs text-muted-foreground" aria-hidden="true">{loan.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 hidden sm:table-cell text-muted-foreground">{loan.due}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={loan.status === "active" ? "default" : loan.status === "repaid" ? "outline" : "destructive"}
                          className="text-[10px]"
                        >
                          {loan.status === "active" && <Clock className="h-3 w-3 mr-1" />}
                          {loan.status === "repaid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {loan.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`View details for loan ${loan.id}`}>
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground text-sm">
                      No loans match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loans;
