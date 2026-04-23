import { ReactNode } from "react";

interface MenuButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

const MenuButton = ({ icon, label, onClick }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-4 bg-card rounded-lg border border-border hover:bg-accent transition-colors text-left active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground shrink-0">
        {icon}
      </div>
      <span className="text-base font-semibold text-foreground">{label}</span>
    </button>
  );
};

export default MenuButton;
