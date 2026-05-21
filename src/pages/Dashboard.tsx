import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useChainStatus, useMyFarmer } from "@/hooks/useVerifarm";
import { useOnChainStats } from "@/hooks/useOnChainStats";
import { useDemoMode } from "@/context/DemoModeContext";
import { useLiveApplications } from "@/hooks/useLiveApplications";
import {
  Wallet, ShieldCheck as ChainIcon, AlertTriangle, RefreshCw, FlaskConical,
  Radio, Banknote, Star, Smartphone, Clock,
} from "lucide-react";
import {
  Users, Landmark, TrendingUp, CheckCircle2,
  ArrowUpRight, ArrowDownRight, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import EarlyWarningAlerts from "@/components/EarlyWarningAlerts";

// ── Static data ──────────────────────────────────────────────────────────────

const statsData = [
  { label: "Farmers Onboarded",  value: 2847,          change: "+12.5%", up: true,  icon: Users,        color: "text-primary",     bg: "bg-accent",         link: "/farmers" },
  { label: "Assets Verified",    value: 8420,          change: "+8.2%",  up: true,  icon: CheckCircle2, color: "text-secondary",   bg: "bg-secondary/10",   link: "/trust" },
  { label: "Total Loans Issued", value: 1200000000,    change: "+22.1%", up: true,  icon: Landmark,     color: "text-primary",     bg: "bg-accent",         link: "/loans",     displayPrefix: "TZS " },
  { label: "Active Loans",       value: 1543,          change: "-3.1%",  up: false, icon: TrendingUp,   color: "text-destructive", bg: "bg-destructive/10", link: "/loans" },
];

const quickActions = [
  { label: "Loans pending review",     count: 3, icon: Landmark,     cta: "Review now",   link: "/loans",   urgent: false },
  { label: "Farmers flagged at risk",  count: 2, icon: AlertTriangle, cta: "View farmers", link: "/farmers", urgent: true  },
  { label: "Verifications expiring",   count: 5, icon: CheckCircle2, cta: "View queue",   link: "/trust",   urgent: false },
];

type LoanRange = "1m" | "3m" | "6m";

const loanTrendAll = [
  { month: "Feb", loans: 180 },
  { month: "Mar", loans: 240 },
  { month: "Apr", loans: 310 },
  { month: "May", loans: 420 },
  { month: "Jun", loans: 380 },
  { month: "Jul", loans: 520 },
];

const loanTrendByRange: Record<LoanRange, { month: string; loans: number }[]> = {
  "1m": [
    { month: "Wk 1", loans: 95 },
    { month: "Wk 2", loans: 112 },
    { month: "Wk 3", loans: 103 },
    { month: "Wk 4", loans: 130 },
  ],
  "3m": loanTrendAll.slice(-3),
  "6m": loanTrendAll,
};

const assetBreakdown = [
  { name: "Land",    value: 4200, fill: "hsl(152, 60%, 36%)" },
  { name: "Cattle",  value: 3100, fill: "hsl(35, 92%, 52%)"  },
  { name: "Poultry", value:  820, fill: "hsl(200, 70%, 50%)" },
  { name: "Crops",   value:  300, fill: "hsl(280, 60%, 55%)" },
];

const disbursementData = [
  { month: "Feb", amount: 62 },
  { month: "Mar", amount: 78 },
  { month: "Apr", amount: 95 },
  { month: "May", amount: 130 },
  { month: "Jun", amount: 110 },
  { month: "Jul", amount: 155 },
];

type ActivityType = "all" | "loan" | "verification" | "repayment";

const allActivity = [
  { farmer: "Amina J.",   farmerId: "F001", action: "Loan approved",        amount: "300,000 TZS", time: "2 min ago",  status: "success",      type: "loan"         as ActivityType },
  { farmer: "Baraka M.",  farmerId: "F002", action: "Asset verified",        amount: "—",           time: "15 min ago", status: "verified",     type: "verification" as ActivityType },
  { farmer: "Chiku L.",   farmerId: "F003", action: "Disbursement sent",     amount: "150,000 TZS", time: "1 hr ago",   status: "sent",         type: "loan"         as ActivityType },
  { farmer: "Daudi K.",   farmerId: "F004", action: "Loan requested",        amount: "500,000 TZS", time: "2 hrs ago",  status: "pending",      type: "loan"         as ActivityType },
  { farmer: "Ester N.",   farmerId: "F005", action: "Repayment received",    amount: "110,000 TZS", time: "3 hrs ago",  status: "success",      type: "repayment"    as ActivityType },
  { farmer: "Fatuma W.",  farmerId: "F006", action: "Crop asset verified",   amount: "—",           time: "4 hrs ago",  status: "verified",     type: "verification" as ActivityType },
  { farmer: "George M.",  farmerId: "F007", action: "Repayment received",    amount: "85,000 TZS",  time: "5 hrs ago",  status: "success",      type: "repayment"    as ActivityType },
  { farmer: "Halima S.",  farmerId: "F008", action: "Loan requested",        amount: "200,000 TZS", time: "6 hrs ago",  status: "pending",      type: "loan"         as ActivityType },
  { farmer: "Ibrahim A.", farmerId: "F009", action: "Livestock tagged",      amount: "—",           time: "7 hrs ago",  status: "verified",     type: "verification" as ActivityType },
  { farmer: "Joyce K.",   farmerId: "F010", action: "Repayment overdue",     amount: "75,000 TZS",  time: "8 hrs ago",  status: "overdue",      type: "repayment"    as ActivityType },
];

const ACTIVITY_TABS: { id: ActivityType; label: string }[] = [
  { id: "all",          label: "All"            },
  { id: "loan",         label: "Loans"          },
  { id: "verification", label: "Verifications"  },
  { id: "repayment",    label: "Repayments"     },
];

const loanChartConfig: ChartConfig        = { loans:  { label: "Loans",             color: "hsl(var(--chart-1))" } };
const disbursementChartConfig: ChartConfig = { amount: { label: "Amount (M TZS)",   color: "hsl(var(--chart-2))" } };

// ── Animated counter ─────────────────────────────────────────────────────────

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

function formatStatValue(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString();
}

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ stat, liveValue, isLive, loading }: {
  stat: typeof statsData[0];
  liveValue?: number;
  isLive?: boolean;
  loading?: boolean;
}) => {
  const navigate = useNavigate();
  const displayValue = (isLive && liveValue !== undefined) ? liveValue : stat.value;
  const animated = useAnimatedNumber(displayValue);
  const display = stat.value >= 1e9
    ? `${stat.displayPrefix ?? ""}${formatStatValue(animated)}`
    : formatStatValue(animated);

  return (
    <Card
      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] group"
      onClick={() => navigate(stat.link)}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className={`rounded-lg p-2.5 ${stat.bg} group-hover:scale-110 transition-transform`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5">
            {loading ? (
              <RefreshCw className="h-3 w-3 text-muted-foreground animate-spin" aria-hidden="true" />
            ) : isLive ? (
              <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-1.5 py-0.5">Live</span>
            ) : null}
            <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-primary" : "text-destructive"}`}>
              {stat.up ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
              {stat.change}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-bold truncate">{display}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View details <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
};

const DEMO_STATS = [2847, 8420, 1_200_000_000, 1543];

// ── Page ──────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const chainStatus = useChainStatus();
  const myFarmer = useMyFarmer();
  const onChain = useOnChainStats();
  const { demoMode } = useDemoMode();
  const { events: liveEvents, connected: liveConnected } = useLiveApplications();

  const [loanRange, setLoanRange] = useState<LoanRange>("6m");
  const [activityFilter, setActivityFilter] = useState<ActivityType>("all");
  const [showAllActivity, setShowAllActivity] = useState(false);

  const liveStatValues = [onChain.farmerCount, onChain.assetCount, onChain.totalPrincipalUsdCents, onChain.activeLoans];
  const effectiveValues = demoMode ? DEMO_STATS : liveStatValues;
  const effectiveIsLive = demoMode || onChain.isLive;
  const effectiveLoading = !demoMode && onChain.loading;

  const filteredActivity = activityFilter === "all"
    ? allActivity
    : allActivity.filter((a) => a.type === activityFilter);

  const visibleActivity = showAllActivity ? filteredActivity : filteredActivity.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of VeriFarm oracle network activity — East Africa
          </p>
        </div>
        <Button onClick={() => navigate("/farmers")} className="gap-2 hidden sm:flex">
          <Users className="h-4 w-4" /> View Farmers
        </Button>
      </div>

      {/* Live chain status bar */}
      <div className="rounded-xl border border-border bg-card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm overflow-hidden">
        <div className="flex items-center gap-2">
          {chainStatus.loading ? (
            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
          ) : chainStatus.adminInitialized ? (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-destructive" />
          )}
          <span className="text-xs text-muted-foreground">Devnet</span>
          <span className="font-mono text-[10px] text-muted-foreground hidden md:block">9teMVR4r...x8N</span>
          {chainStatus.adminInitialized && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">Program Live</span>
          )}
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        {connected && publicKey ? (
          <div className="flex items-center gap-2">
            <ChainIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Connected:</span>
            <span className="font-mono text-xs font-medium">
              {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
            </span>
            {myFarmer.exists && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                {myFarmer.fullName} · {myFarmer.status}
              </span>
            )}
            {!myFarmer.loading && !myFarmer.exists && (
              <span className="text-[10px] text-muted-foreground">No farmer account found</span>
            )}
          </div>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            Connect wallet to interact with the program
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {onChain.lastFetched && (
            <span className="text-[10px] text-muted-foreground hidden md:block">
              Updated {onChain.lastFetched.toLocaleTimeString()}
            </span>
          )}
          {chainStatus.error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              RPC error
            </div>
          )}
        </div>
      </div>

      {demoMode && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <FlaskConical className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-primary/80 leading-relaxed">
            <span className="font-semibold text-primary">You are viewing verified sample data</span> — all profiles reflect real VeriFarm verification standards. Toggle Demo Mode off in the top bar to view live on-chain data.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.link)}
            className={cn(
              "group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all hover:shadow-md active:scale-[0.98]",
              action.urgent
                ? "border-destructive/25 bg-destructive/5 hover:bg-destructive/10"
                : "border-border bg-card hover:border-primary/30 hover:bg-primary/5"
            )}
          >
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
              action.urgent ? "bg-destructive/10" : "bg-accent"
            )}>
              <action.icon className={cn("h-4 w-4", action.urgent ? "text-destructive" : "text-primary")} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground leading-snug">{action.label}</p>
              <p className={cn("text-lg font-bold leading-tight", action.urgent ? "text-destructive" : "text-foreground")}>
                {action.count}
              </p>
            </div>
            <span className={cn(
              "text-xs font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
              action.urgent ? "text-destructive" : "text-primary"
            )}>
              {action.cta} <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, i) => (
          <StatCard
            key={stat.label}
            stat={stat}
            liveValue={effectiveValues[i]}
            isLive={effectiveIsLive}
            loading={effectiveLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3 min-w-0">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base font-semibold">Loan Issuance Trend</CardTitle>
              {/* Range tabs */}
              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted p-0.5">
                {(["1m", "3m", "6m"] as LoanRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setLoanRange(r)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                      loanRange === r
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={loanChartConfig} className="h-[220px] sm:h-[260px] w-full">
              <AreaChart data={loanTrendByRange[loanRange]}>
                <defs>
                  <linearGradient id="loanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="hsl(152, 60%, 36%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 60%, 36%)" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="loans" stroke="hsl(152, 60%, 36%)" strokeWidth={2} fill="url(#loanGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Asset Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center overflow-hidden">
            <ChartContainer config={{}} className="h-[200px] w-full">
              <PieChart>
                <Pie data={assetBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {assetBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {assetBreakdown.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: a.fill }} />
                  <span className="text-muted-foreground">{a.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Monthly Disbursements (M TZS)</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/disbursements")}>
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={disbursementChartConfig} className="h-[200px] sm:h-[220px] w-full">
              <BarChart data={disbursementData}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="hsl(35, 92%, 52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity with filter tabs */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/loans")}>
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-0.5 mt-1">
              {ACTIVITY_TABS.map((tab) => {
                const count = tab.id === "all" ? allActivity.length : allActivity.filter((a) => a.type === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActivityFilter(tab.id); setShowAllActivity(false); }}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                      activityFilter === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {tab.label}
                    <span className={cn(
                      "rounded-full px-1 text-[10px] font-semibold",
                      activityFilter === tab.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {visibleActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                  <Clock className="h-8 w-8 opacity-30" aria-hidden="true" />
                  <p className="text-sm">No activity of this type yet</p>
                </div>
              ) : (
                visibleActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 px-2 rounded-lg border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors active:scale-[0.99]"
                    onClick={() => navigate(`/farmers/${item.farmerId}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {item.farmer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.farmer}</p>
                        <p className="text-xs text-muted-foreground">{item.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        item.status === "overdue" && "text-destructive"
                      )}>
                        {item.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredActivity.length > 5 && (
              <button
                onClick={() => setShowAllActivity((v) => !v)}
                className="mt-3 w-full text-xs text-primary hover:underline text-center py-1"
              >
                {showAllActivity ? "Show less" : `Show ${filteredActivity.length - 5} more`}
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live USSD Activity Feed */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Live USSD Activity</CardTitle>
              <div className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                liveConnected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <Radio className="h-3 w-3" aria-hidden="true" />
                {liveConnected ? "Live" : "Connecting…"}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Farmer activity via *384#</span>
          </div>
        </CardHeader>
        <CardContent>
          {liveEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <Smartphone className="h-8 w-8 opacity-30" aria-hidden="true" />
              <p className="text-sm">Waiting for USSD activity…</p>
              <p className="text-xs opacity-70">Events appear here in real time when farmers dial in</p>
            </div>
          ) : (
            <div className="space-y-2">
              {liveEvents.map((ev, i) => {
                const isNew = i === 0;
                const Icon = ev.type === "repayment" ? Banknote : ev.type === "score_update" ? Star : Smartphone;
                const iconBg = ev.type === "repayment" ? "bg-primary/10" : ev.type === "score_update" ? "bg-secondary/10" : "bg-accent";
                const iconColor = ev.type === "repayment" ? "text-primary" : ev.type === "score_update" ? "text-secondary" : "text-accent-foreground";
                const label = ev.type === "loan_application"
                  ? `Loan application — TZS ${ev.amount?.toLocaleString()}`
                  : ev.type === "repayment"
                  ? `Repayment initiated — TZS ${ev.amount?.toLocaleString()}`
                  : `AI score updated — ${ev.score}/100`;

                return (
                  <div key={`${ev.ts}-${i}`} className={cn(
                    "flex items-center gap-3 rounded-lg border border-border p-3 transition-all",
                    isNew && "border-primary/30 bg-primary/5 animate-fade-in"
                  )}>
                    <div className={cn("rounded-lg p-2 shrink-0", iconBg)}>
                      <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.phone} · {ev.reference ?? ""} · {ev.lang.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {isNew && <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-1.5 py-0.5">NEW</span>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(ev.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <EarlyWarningAlerts />
    </div>
  );
};

export default Dashboard;
