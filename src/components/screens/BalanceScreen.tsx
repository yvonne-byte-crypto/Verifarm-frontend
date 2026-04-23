import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  onBack: () => void;
}

const BalanceScreen = ({ onBack }: Props) => {
  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-primary-foreground">Account Balance</h2>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <p className="text-4xl font-extrabold text-foreground mb-1">150,000</p>
        <p className="text-lg font-semibold text-muted-foreground mb-8">TZS</p>

        <div className="w-full space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Activity</p>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Loan Received</p>
              <p className="text-xs text-muted-foreground">March 15, 2026</p>
            </div>
            <span className="text-sm font-bold text-primary">+150,000</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <TrendingDown size={18} className="text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Repayment</p>
              <p className="text-xs text-muted-foreground">Feb 28, 2026</p>
            </div>
            <span className="text-sm font-bold text-secondary">-55,000</span>
          </div>
        </div>
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

export default BalanceScreen;
