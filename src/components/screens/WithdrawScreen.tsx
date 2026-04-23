import { ArrowLeft, Smartphone } from "lucide-react";
import { useState } from "react";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const WithdrawScreen = ({ onBack, onSuccess }: Props) => {
  const [step, setStep] = useState<"form" | "confirming">("form");
  const balance = 150000;

  const handleWithdraw = () => {
    setStep("confirming");
    setTimeout(() => onSuccess(), 1500);
  };

  if (step === "confirming") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />
        <p className="text-lg font-semibold text-foreground">Sending to M-Pesa...</p>
        <p className="text-sm text-muted-foreground mt-1">Please wait</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-primary-foreground">Withdraw Money</h2>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col items-center">
        <Smartphone size={48} className="text-primary mb-4" />
        <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
        <p className="text-3xl font-extrabold text-foreground mb-8">{balance.toLocaleString()} TZS</p>

        <div className="w-full bg-muted rounded-lg p-4">
          <p className="text-sm text-foreground">
            Withdraw <strong>{balance.toLocaleString()} TZS</strong> to M-Pesa account ending in <strong>**89</strong>
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <button
          onClick={handleWithdraw}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform"
        >
          Withdraw to M-Pesa
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border border-border text-foreground font-semibold text-sm active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WithdrawScreen;
