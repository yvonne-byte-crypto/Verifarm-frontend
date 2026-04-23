import { Search, FileText, Banknote, Wallet } from "lucide-react";
import MenuButton from "@/components/MenuButton";
import farmHero from "@/assets/farm-hero.png";
import type { Screen } from "@/pages/Index";

interface Props {
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen = ({ onNavigate }: Props) => {
  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-8 text-center">
        <img
          src={farmHero}
          alt="Farm illustration"
          width={120}
          height={120}
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl font-bold text-primary-foreground">
          Agri-Wallet
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Pesa yako, shamba lako
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-3">
        <MenuButton
          icon={<Search size={22} />}
          label="Check Loan Eligibility"
          onClick={() => onNavigate("eligibility")}
        />
        <MenuButton
          icon={<FileText size={22} />}
          label="Apply for Loan"
          onClick={() => onNavigate("apply")}
        />
        <MenuButton
          icon={<Banknote size={22} />}
          label="Withdraw Money"
          onClick={() => onNavigate("withdraw")}
        />
        <MenuButton
          icon={<Wallet size={22} />}
          label="Check Balance"
          onClick={() => onNavigate("balance")}
        />
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by Agri-Wallet • Secure & Trusted
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
