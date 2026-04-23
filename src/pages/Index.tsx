import { useState } from "react";
import MobileFrame from "@/components/MobileFrame";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import EligibilityScreen from "@/components/screens/EligibilityScreen";
import ApplyScreen from "@/components/screens/ApplyScreen";
import ConfirmLoanScreen from "@/components/screens/ConfirmLoanScreen";
import SuccessScreen from "@/components/screens/SuccessScreen";
import WithdrawScreen from "@/components/screens/WithdrawScreen";
import BalanceScreen from "@/components/screens/BalanceScreen";

export type Screen =
  | "welcome"
  | "eligibility"
  | "apply"
  | "confirm"
  | "success"
  | "withdraw"
  | "withdraw-success"
  | "balance";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [loanAmount, setLoanAmount] = useState(0);

  const goHome = () => setScreen("welcome");

  return (
    <MobileFrame>
      {screen === "welcome" && <WelcomeScreen onNavigate={setScreen} />}
      {screen === "eligibility" && <EligibilityScreen onBack={goHome} />}
      {screen === "apply" && (
        <ApplyScreen
          onBack={goHome}
          onConfirm={(amount) => {
            setLoanAmount(amount);
            setScreen("confirm");
          }}
        />
      )}
      {screen === "confirm" && (
        <ConfirmLoanScreen
          amount={loanAmount}
          onBack={() => setScreen("apply")}
          onConfirm={() => setScreen("success")}
        />
      )}
      {screen === "success" && <SuccessScreen amount={loanAmount} onDone={goHome} />}
      {screen === "withdraw" && (
        <WithdrawScreen
          onBack={goHome}
          onSuccess={() => setScreen("withdraw-success")}
        />
      )}
      {screen === "withdraw-success" && (
        <SuccessScreen amount={0} isWithdraw onDone={goHome} />
      )}
      {screen === "balance" && <BalanceScreen onBack={goHome} />}
    </MobileFrame>
  );
};

export default Index;
