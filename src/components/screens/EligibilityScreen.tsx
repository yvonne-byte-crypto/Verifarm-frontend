import { ArrowLeft, CheckCircle2, Tractor, Beef } from "lucide-react";

interface Props {
  onBack: () => void;
}

const EligibilityScreen = ({ onBack }: Props) => {
  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-primary-foreground">Loan Eligibility</h2>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 size={40} className="text-primary" />
        </div>

        <p className="text-muted-foreground text-sm mb-2">You are eligible for up to</p>
        <p className="text-4xl font-extrabold text-foreground mb-1">300,000</p>
        <p className="text-lg font-semibold text-muted-foreground mb-8">TZS</p>

        <div className="w-full bg-muted rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Verified Assets</p>
          <div className="flex items-center gap-3">
            <Tractor size={20} className="text-primary" />
            <span className="text-sm text-foreground">2 acres farmland — Dodoma</span>
          </div>
          <div className="flex items-center gap-3">
            <Beef size={20} className="text-primary" />
            <span className="text-sm text-foreground">5 cattle — verified</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Based on verified farm data collected by our agents.
        </p>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={onBack}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default EligibilityScreen;
