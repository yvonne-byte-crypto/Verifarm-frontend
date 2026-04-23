import { ArrowLeft, ShieldCheck } from "lucide-react";

interface Props {
  amount: number;
  onBack: () => void;
  onConfirm: () => void;
}

const ConfirmLoanScreen = ({ amount, onBack, onConfirm }: Props) => {
  const repayment = Math.round(amount * 1.1);

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-primary-foreground">Confirm Loan</h2>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col items-center">
        <ShieldCheck size={48} className="text-primary mb-6" />

        <div className="w-full bg-muted rounded-lg p-5 space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Loan Amount</span>
            <span className="text-sm font-bold text-foreground">{amount.toLocaleString()} TZS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Interest (10%)</span>
            <span className="text-sm font-bold text-foreground">{(repayment - amount).toLocaleString()} TZS</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-foreground">Repay in 30 days</span>
            <span className="text-base font-extrabold text-foreground">{repayment.toLocaleString()} TZS</span>
          </div>
        </div>

        <div className="w-full bg-accent/50 rounded-lg p-4 text-center">
          <p className="text-sm text-accent-foreground">
            Funds will be sent to your <strong>M-Pesa</strong> account ending in <strong>**89</strong>
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform"
        >
          Confirm & Get Loan
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border border-border text-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmLoanScreen;
