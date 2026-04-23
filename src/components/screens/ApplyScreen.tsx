import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface Props {
  onBack: () => void;
  onConfirm: (amount: number) => void;
}

const presets = [50000, 100000, 200000, 300000];

const ApplyScreen = ({ onBack, onConfirm }: Props) => {
  const [amount, setAmount] = useState("");

  const numericAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const isValid = numericAmount >= 10000 && numericAmount <= 300000;

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      <div className="bg-primary px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-primary-foreground">Apply for Loan</h2>
      </div>

      <div className="flex-1 px-5 py-8 flex flex-col">
        <label className="text-sm font-semibold text-foreground mb-2">
          Enter loan amount (TZS)
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 100,000"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full py-4 px-4 text-2xl font-bold text-center rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none transition-colors"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Min: 10,000 TZS — Max: 300,000 TZS
        </p>

        <div className="grid grid-cols-2 gap-2 mt-6">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className="py-3 rounded-lg border border-border bg-muted text-sm font-semibold text-foreground hover:bg-accent active:scale-[0.98] transition-all"
            >
              {p.toLocaleString()} TZS
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        <button
          onClick={() => isValid && onConfirm(numericAmount)}
          disabled={!isValid}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ApplyScreen;
