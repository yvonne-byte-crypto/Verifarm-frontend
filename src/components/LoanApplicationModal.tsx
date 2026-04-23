import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Send,
  Loader2,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "amount" | "verifying" | "contract" | "approved" | "disbursed";

interface Props {
  open: boolean;
  onClose: () => void;
  farmerName: string;
  maxEligible: number;
}

const steps: { key: Step; label: string; icon: any }[] = [
  { key: "amount", label: "Enter Amount", icon: Send },
  { key: "verifying", label: "Verify Assets", icon: ShieldCheck },
  { key: "contract", label: "Smart Contract", icon: Zap },
  { key: "approved", label: "Approved", icon: CheckCircle2 },
  { key: "disbursed", label: "Funds Sent", icon: Smartphone },
];

const LoanApplicationModal = ({ open, onClose, farmerName, maxEligible }: Props) => {
  const [currentStep, setCurrentStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const numericAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const isValidAmount = numericAmount >= 10000 && numericAmount <= maxEligible;

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  useEffect(() => {
    if (!open) {
      // Reset on close
      setTimeout(() => {
        setCurrentStep("amount");
        setAmount("");
        setLoadingProgress(0);
      }, 300);
    }
  }, [open]);

  const simulateStep = (
    step: Step,
    text: string,
    duration: number,
    nextStep: Step
  ) => {
    setCurrentStep(step);
    setLoadingText(text);
    setLoadingProgress(0);

    const interval = 50;
    const increments = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / increments;
      setLoadingProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => setCurrentStep(nextStep), 300);
      }
    }, interval);
  };

  const handleApply = () => {
    if (!isValidAmount) return;

    simulateStep("verifying", "Verifying agricultural assets with AI...", 2500, "contract");

    setTimeout(() => {
      simulateStep("contract", "Executing Solana smart contract...", 2000, "approved");
    }, 3000);

    setTimeout(() => {
      setCurrentStep("approved");
      setTimeout(() => setCurrentStep("disbursed"), 1500);
    }, 5500);
  };

  const presets = [50000, 100000, 200000, maxEligible].filter(
    (v, i, arr) => arr.indexOf(v) === i && v <= maxEligible
  );

  const formatNum = (n: number) => n.toLocaleString();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Apply for Loan — {farmerName}</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-4">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all duration-300 shrink-0",
                  i <= currentStepIndex
                    ? "bg-primary text-primary-foreground scale-100"
                    : "bg-muted text-muted-foreground scale-90"
                )}
              >
                {i < currentStepIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1 rounded transition-colors duration-500",
                    i < currentStepIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-6 px-1">
          {steps.map((step, i) => (
            <p
              key={step.key}
              className={cn(
                "text-[10px] text-center flex-1 transition-colors",
                i <= currentStepIndex ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {step.label}
            </p>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[200px] flex flex-col items-center justify-center">
          {currentStep === "amount" && (
            <div className="w-full space-y-4 animate-fade-in">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Loan Amount (TZS)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 100,000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  className="text-xl font-bold text-center h-14"
                />
                <p className="text-xs text-muted-foreground mt-1.5 text-center">
                  Max eligible: {formatNum(maxEligible)} TZS
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className={cn(
                      "py-2.5 rounded-lg border text-sm font-semibold transition-all active:scale-[0.97]",
                      numericAmount === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-foreground hover:bg-accent"
                    )}
                  >
                    {formatNum(p)} TZS
                  </button>
                ))}
              </div>

              <Button
                onClick={handleApply}
                disabled={!isValidAmount}
                className="w-full h-12 text-base font-bold"
              >
                Apply for Loan <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {(currentStep === "verifying" || currentStep === "contract") && (
            <div className="flex flex-col items-center gap-4 animate-fade-in py-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-base mb-1">
                  {currentStep === "verifying"
                    ? "Step 2: Verifying Assets"
                    : "Step 3: Smart Contract"}
                </p>
                <p className="text-sm text-muted-foreground">{loadingText}</p>
              </div>
              <div className="w-full max-w-xs">
                <Progress value={loadingProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {Math.round(loadingProgress)}%
                </p>
              </div>
            </div>
          )}

          {currentStep === "approved" && (
            <div className="flex flex-col items-center gap-3 animate-scale-in py-4">
              <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Loan Approved!</h3>
              <p className="text-sm text-muted-foreground">
                {formatNum(numericAmount)} TZS approved for {farmerName}
              </p>
              <p className="text-xs text-muted-foreground">Preparing disbursement...</p>
            </div>
          )}

          {currentStep === "disbursed" && (
            <div className="flex flex-col items-center gap-4 animate-fade-in py-4 w-full">
              <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center animate-scale-in">
                <Send className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Funds Sent!</h3>

              <div className="w-full bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">{formatNum(numericAmount)} TZS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">USDC equivalent</span>
                  <span className="font-mono font-medium">
                    ${(numericAmount / 2531).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5" /> M-Pesa
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repay in</span>
                  <span className="font-medium">30 days</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total repayment (10% interest)</span>
                  <span className="font-bold text-primary">
                    {formatNum(Math.round(numericAmount * 1.1))} TZS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secured by Solana smart contract
              </div>

              <Button onClick={onClose} className="w-full h-11 mt-2">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationModal;
