import { CheckCircle2, MessageSquare } from "lucide-react";

interface Props {
  amount: number;
  isWithdraw?: boolean;
  onDone: () => void;
}

const SuccessScreen = ({ amount, isWithdraw, onDone }: Props) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6 animate-scale-in">
        <CheckCircle2 size={52} className="text-primary" />
      </div>

      <h2 className="text-2xl font-extrabold text-foreground mb-2">
        {isWithdraw ? "Withdrawal Sent!" : "Loan Approved!"}
      </h2>

      {!isWithdraw && (
        <p className="text-muted-foreground text-center mb-6">
          <strong>{amount.toLocaleString()} TZS</strong> sent to your M-Pesa
        </p>
      )}
      {isWithdraw && (
        <p className="text-muted-foreground text-center mb-6">
          Your funds have been sent to M-Pesa
        </p>
      )}

      {/* SMS-style confirmation */}
      <div className="w-full bg-muted rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <MessageSquare size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">SMS Confirmation</p>
            <p className="text-sm text-foreground">
              {isWithdraw
                ? "Umepokea TZS kwenye M-Pesa yako. Asante kwa kutumia Agri-Wallet."
                : `Umepokea mkopo wa TZS ${amount.toLocaleString()} kwenye M-Pesa yako. Rudisha TZS ${Math.round(amount * 1.1).toLocaleString()} ndani ya siku 30. Asante!`}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform"
      >
        Back to Menu
      </button>
    </div>
  );
};

export default SuccessScreen;
