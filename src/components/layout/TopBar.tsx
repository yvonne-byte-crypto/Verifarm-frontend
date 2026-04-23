import { useState } from "react";
import { Menu, Bell, Search, AlertCircle, CheckCircle2, CloudRain, ClipboardCheck, Banknote, User, Settings, Shield, LogOut, ChevronDown, Wallet, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useDemoMode } from "@/context/DemoModeContext";

interface Notification {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "N1",
    icon: AlertCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    title: "Payment overdue — Amina Wanjiku",
    body: "TZS 45,000 is 18 days overdue. Escalation required.",
    time: "3 hrs ago",
    unread: true,
  },
  {
    id: "N2",
    icon: ClipboardCheck,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "New verification request",
    body: "Chiku Lema submitted farm data from Mwanza for field review.",
    time: "5 hrs ago",
    unread: true,
  },
  {
    id: "N3",
    icon: Banknote,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Loan approved — Daudi Kileo",
    body: "TZS 800,000 approved and disbursed to M-Pesa account.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "N4",
    icon: CloudRain,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    title: "Drought alert — Rift Valley",
    body: "34 active loans in affected region. Consider repayment deferral.",
    time: "Today 09:14",
    unread: false,
  },
  {
    id: "N5",
    icon: CheckCircle2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Repayment received — Ester Nkya",
    body: "TZS 110,000 received on time. Trust score updated to 81.",
    time: "2 days ago",
    unread: false,
  },
];

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar = ({ onMenuToggle }: TopBarProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { demoMode, setDemoMode } = useDemoMode();

  const shortKey = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));

  const markRead = (id: string) =>
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      <div className="relative hidden md:block w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search farmers, loans..."
          className="pl-9 bg-muted border-0"
          aria-label="Search farmers and loans"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[340px] max-w-[calc(100vw-1rem)] p-0 shadow-lg" sideOffset={8}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/60",
                      n.unread ? "bg-primary/5" : ""
                    )}
                  >
                    <div className={cn("rounded-lg p-2 shrink-0 mt-0.5", n.iconBg)}>
                      <Icon className={cn("h-4 w-4", n.iconColor)} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-xs leading-snug", n.unread ? "font-semibold" : "font-medium")}>
                          {n.title}
                        </p>
                        {n.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" aria-label="Unread" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">All notifications shown</p>
            </div>
          </PopoverContent>
        </Popover>

        {/* Demo Mode toggle — visible on all screen sizes */}
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-border bg-muted/50 px-2 sm:px-3 py-1.5">
          <FlaskConical className="h-3.5 w-3.5 text-secondary shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline text-xs font-medium text-muted-foreground whitespace-nowrap">Demo</span>
          <Switch
            id="demo-mode-toggle"
            checked={demoMode}
            onCheckedChange={setDemoMode}
            aria-label="Toggle demo mode"
            className="data-[state=checked]:bg-secondary"
          />
          {demoMode && (
            <span className="text-[10px] font-semibold text-secondary whitespace-nowrap">ON</span>
          )}
        </div>

        {/* Wallet connect — icon-only on mobile, full button on sm+ */}
        {connected ? (
          <button
            onClick={disconnect}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 sm:px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            aria-label="Disconnect wallet"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="hidden sm:inline">{shortKey}</span>
          </button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="flex gap-1.5 text-xs h-8 border-primary/40 text-primary hover:bg-primary/10 px-2 sm:px-3"
            onClick={() => setVisible(true)}
            aria-label="Connect Solana wallet"
          >
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              aria-label="Admin account menu"
            >
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                AW
              </div>
              <span className="hidden text-sm font-medium md:block">Admin</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[260px] p-0 shadow-lg" sideOffset={8}>
            {/* Profile header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-muted/30 rounded-t-lg">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                AW
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Admin Wanjiku</p>
                <p className="text-xs text-muted-foreground truncate">admin@verifarm.co.tz</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  <Shield className="h-2.5 w-2.5" aria-hidden="true" /> Super Admin
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
              {[
                { label: "Loans", value: "1,543" },
                { label: "Farmers", value: "2,847" },
                { label: "Alerts", value: "4" },
              ].map((s) => (
                <div key={s.label} className="py-2.5">
                  <p className="text-sm font-bold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Account Settings" },
                { icon: Shield, label: "Permissions & Roles" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-border py-1.5">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default TopBar;
