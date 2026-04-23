import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Search,
  BrainCircuit,
  BadgeCheck,
  Banknote,
  RefreshCw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  { id: 1, label: "Asset Declaration",    sublabel: "Land & livestock submitted",    icon: ClipboardList  },
  { id: 2, label: "Field Verification",   sublabel: "On-site oracle inspection",     icon: Search         },
  { id: 3, label: "AI Scoring",           sublabel: "Risk score calculated",         icon: BrainCircuit   },
  { id: 4, label: "Lender Approval",      sublabel: "Officer reviews & approves",    icon: BadgeCheck     },
  { id: 5, label: "Disbursement",         sublabel: "Funds released to farmer",      icon: Banknote       },
  { id: 6, label: "Repayment Tracking",   sublabel: "Instalments monitored on-chain",icon: RefreshCw      },
];

type StageState = "completed" | "active" | "pending";

function getStageState(stageId: number, currentStage: number): StageState {
  if (stageId < currentStage)  return "completed";
  if (stageId === currentStage) return "active";
  return "pending";
}

const stageStyles: Record<StageState, { dot: string; icon: string; label: string; line: string }> = {
  completed: {
    dot:   "bg-primary border-primary text-primary-foreground",
    icon:  "text-primary",
    label: "text-foreground",
    line:  "bg-primary",
  },
  active: {
    dot:   "bg-secondary border-secondary text-secondary-foreground animate-pulse",
    icon:  "text-secondary",
    label: "text-secondary font-bold",
    line:  "bg-border",
  },
  pending: {
    dot:   "bg-background border-border text-muted-foreground",
    icon:  "text-muted-foreground",
    label: "text-muted-foreground",
    line:  "bg-border",
  },
};

const stageLabels: Record<StageState, string> = {
  completed: "Done",
  active:    "In Progress",
  pending:   "Pending",
};

interface Props {
  currentStage: number; // 1–6
}

const LoanLifecycleTimeline = ({ currentStage }: Props) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Loan Lifecycle</CardTitle>
          <span className="text-xs text-muted-foreground">
            Stage {currentStage} of {STAGES.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${((currentStage - 1) / (STAGES.length - 1)) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Desktop: horizontal stepper */}
        <div className="hidden sm:flex items-start gap-0">
          {STAGES.map((stage, idx) => {
            const state = getStageState(stage.id, currentStage);
            const s = stageStyles[state];
            const StageIcon = stage.icon;
            const isLast = idx === STAGES.length - 1;

            return (
              <div key={stage.id} className="flex flex-1 flex-col items-center">
                {/* Dot + connector line row */}
                <div className="flex w-full items-center">
                  {/* Left line */}
                  <div className={cn("h-0.5 flex-1", idx === 0 ? "bg-transparent" : stageStyles[getStageState(stage.id - 1, currentStage)].line)} />
                  {/* Dot */}
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    s.dot
                  )}>
                    {state === "completed"
                      ? <Check className="h-4 w-4" aria-hidden="true" />
                      : <StageIcon className="h-4 w-4" aria-hidden="true" />}
                  </div>
                  {/* Right line */}
                  <div className={cn("h-0.5 flex-1", isLast ? "bg-transparent" : s.line)} />
                </div>

                {/* Label */}
                <div className="mt-2 text-center px-1">
                  <p className={cn("text-[11px] font-semibold leading-tight", s.label)}>{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{stage.sublabel}</p>
                  <span className={cn(
                    "mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                    state === "completed" && "bg-primary/10 text-primary",
                    state === "active"    && "bg-secondary/15 text-secondary",
                    state === "pending"   && "bg-muted text-muted-foreground",
                  )}>
                    {stageLabels[state]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-0 sm:hidden">
          {STAGES.map((stage, idx) => {
            const state = getStageState(stage.id, currentStage);
            const s = stageStyles[state];
            const StageIcon = stage.icon;
            const isLast = idx === STAGES.length - 1;

            return (
              <div key={stage.id} className="flex gap-3">
                {/* Left column: dot + vertical line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    s.dot
                  )}>
                    {state === "completed"
                      ? <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      : <StageIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                  </div>
                  {!isLast && (
                    <div className={cn("w-0.5 flex-1 min-h-[20px]", s.line)} />
                  )}
                </div>

                {/* Right column: text */}
                <div className={cn("pb-4 flex-1", isLast && "pb-0")}>
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-semibold", s.label)}>{stage.label}</p>
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      state === "completed" && "bg-primary/10 text-primary",
                      state === "active"    && "bg-secondary/15 text-secondary",
                      state === "pending"   && "bg-muted text-muted-foreground",
                    )}>
                      {stageLabels[state]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{stage.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanLifecycleTimeline;
