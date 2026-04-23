import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  Beef,
  LandPlot,
  Syringe,
  Droplets,
  Thermometer,
  Activity,
  Banknote,
  Flag,
  FileSearch,
  CheckCircle2,
} from "lucide-react";
import LoanApplicationModal from "@/components/LoanApplicationModal";
import USSDSimulator from "@/components/USSDSimulator";
import LoanLifecycleTimeline from "@/components/LoanLifecycleTimeline";
import AIRiskAssessment from "@/components/ai/AIRiskAssessment";
import AIExplainability from "@/components/ai/AIExplainability";
import AIRecommendation from "@/components/ai/AIRecommendation";
import WhatIfSimulation from "@/components/ai/WhatIfSimulation";
import LoanEligibilityBreakdown from "@/components/ai/LoanEligibilityBreakdown";
import { toast } from "@/hooks/use-toast";

const farmerData: Record<string, any> = {
  // loanStage: 1=Asset Declaration 2=Field Verification 3=AI Scoring 4=Lender Approval 5=Disbursement 6=Repayment
  F001: { name: "Amina Juma",    location: "Dodoma",      phone: "+255 712 345 678", land: 5,  cattle: 12, score: 87, eligible: "300,000", eligibleNum: 300000, status: "verified", loanStage: 5 },
  F002: { name: "Baraka Mwenda", location: "Arusha",      phone: "+255 754 321 987", land: 8,  cattle: 20, score: 92, eligible: "500,000", eligibleNum: 500000, status: "verified", loanStage: 6 },
  F003: { name: "Chiku Lema",    location: "Mbeya",       phone: "+255 689 456 123", land: 3,  cattle: 6,  score: 72, eligible: "150,000", eligibleNum: 150000, status: "pending",  loanStage: 2 },
  F004: { name: "Daudi Kileo",   location: "Kilimanjaro", phone: "+255 621 789 456", land: 12, cattle: 35, score: 95, eligible: "800,000", eligibleNum: 800000, status: "verified", loanStage: 6 },
  F005: { name: "Ester Nkya",    location: "Morogoro",    phone: "+255 745 654 321", land: 4,  cattle: 8,  score: 78, eligible: "200,000", eligibleNum: 200000, status: "verified", loanStage: 4 },
  F006: { name: "Farida Hassan", location: "Tanga",       phone: "+255 678 111 222", land: 6,  cattle: 15, score: 84, eligible: "350,000", eligibleNum: 350000, status: "pending",  loanStage: 3 },
};

const activityLogs = [
  { icon: Syringe, label: "Cattle vaccination", date: "Mar 15, 2026", status: "Completed" },
  { icon: Droplets, label: "Soil moisture test", date: "Mar 10, 2026", status: "Normal" },
  { icon: Thermometer, label: "Temperature reading", date: "Mar 8, 2026", status: "28°C" },
  { icon: Activity, label: "Livestock health check", date: "Mar 5, 2026", status: "Healthy" },
];

const FarmerProfile = () => {
  const { id } = useParams();
  const farmer = farmerData[id || "F001"] || farmerData.F001;
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [simScore, setSimScore] = useState(farmer.score);
  const [simEligible, setSimEligible] = useState(farmer.eligibleNum);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    toast({ title: "✅ Loan Approved", description: `Loan of TZS ${simEligible.toLocaleString()} approved for ${farmer.name}.` });
  };
  const handleRequestData = () => {
    toast({ title: "📋 Data Requested", description: `Additional verification data requested for ${farmer.name}.` });
  };
  const handleFlag = () => {
    toast({ title: "🚩 Flagged for Review", description: `${farmer.name}'s profile has been flagged for manual review.`, variant: "destructive" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/farmers">
        <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-accent active:scale-[0.97] transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Farmers
        </Button>
      </Link>

      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
              {farmer.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{farmer.name}</h1>
                <Badge variant={farmer.status === "verified" ? "default" : "secondary"}>
                  {farmer.status === "verified" && <ShieldCheck className="h-3 w-3 mr-1" />}
                  {farmer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {farmer.location}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {farmer.phone}</span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-muted-foreground mb-1">Eligible Loan</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">TZS {simEligible.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Assessment — hero position */}
      <AIRiskAssessment score={simScore} analyzing={analyzing} />

      {/* Action Buttons */}
      {!analyzing && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleApprove} className="gap-2 font-semibold active:scale-[0.97] transition-transform" size="lg">
            <CheckCircle2 className="h-4 w-4" /> Approve Loan
          </Button>
          <Button onClick={() => setLoanModalOpen(true)} variant="outline" className="gap-2 active:scale-[0.97] transition-transform" size="lg">
            <Banknote className="h-4 w-4" /> Custom Loan Amount
          </Button>
          <Button onClick={handleRequestData} variant="secondary" className="gap-2 active:scale-[0.97] transition-transform">
            <FileSearch className="h-4 w-4" /> Request More Data
          </Button>
          <Button onClick={handleFlag} variant="destructive" className="gap-2 active:scale-[0.97] transition-transform">
            <Flag className="h-4 w-4" /> Flag for Review
          </Button>
        </div>
      )}

      {/* Loan Lifecycle Timeline */}
      {!analyzing && <LoanLifecycleTimeline currentStage={farmer.loanStage} />}

      {/* Explainability */}
      {!analyzing && <AIExplainability score={simScore} land={farmer.land} cattle={farmer.cattle} />}

      {/* Two-column: Recommendation + Eligibility Breakdown */}
      {!analyzing && (
        <div className="grid gap-4 md:grid-cols-2">
          <AIRecommendation score={simScore} eligibleAmount={simEligible} />
          <LoanEligibilityBreakdown land={farmer.land} cattle={farmer.cattle} score={simScore} />
        </div>
      )}

      {/* Two-column: What-If + Assets & Activity */}
      {!analyzing && (
        <div className="grid gap-4 md:grid-cols-2">
          <WhatIfSimulation
            baseLand={farmer.land}
            baseCattle={farmer.cattle}
            baseScore={farmer.score}
            onScoreChange={(s, e) => { setSimScore(s); setSimEligible(e); }}
          />

          <div className="space-y-4">
            {/* Assets */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Agricultural Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <div className="rounded-lg bg-accent p-2"><LandPlot className="h-5 w-5 text-accent-foreground" /></div>
                  <div>
                    <p className="text-sm font-medium">Land</p>
                    <p className="text-xl font-bold">{farmer.land} <span className="text-sm font-normal text-muted-foreground">acres</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <div className="rounded-lg bg-secondary/10 p-2"><Beef className="h-5 w-5 text-secondary" /></div>
                  <div>
                    <p className="text-sm font-medium">Cattle</p>
                    <p className="text-xl font-bold">{farmer.cattle} <span className="text-sm font-normal text-muted-foreground">head</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Logs */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Verification Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activityLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-muted p-1.5"><log.icon className="h-3.5 w-3.5 text-muted-foreground" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{log.label}</p>
                        <p className="text-xs text-muted-foreground">{log.date}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{log.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* USSD Simulator */}
      {!analyzing && <USSDSimulator />}

      <LoanApplicationModal
        open={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        farmerName={farmer.name}
        maxEligible={simEligible}
      />
    </div>
  );
};

export default FarmerProfile;
