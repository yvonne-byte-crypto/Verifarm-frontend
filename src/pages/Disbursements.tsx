import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  Banknote,
  Coins,
  Smartphone,
  Eye,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const disbursements = [
  { id: "D-001", farmer: "Amina Juma", usdc: "118.50", tzs: "300,000", dest: "M-Pesa", phone: "0712***678", time: "2 min ago", status: "sent", tx: "5Kx9...f3Qp" },
  { id: "D-002", farmer: "Baraka Mwenda", usdc: "197.50", tzs: "500,000", dest: "Airtel Money", phone: "0754***987", time: "1 hr ago", status: "sent", tx: "8Rm4...k2Wn" },
  { id: "D-003", farmer: "Daudi Kileo", usdc: "316.00", tzs: "800,000", dest: "M-Pesa", phone: "0621***456", time: "3 hrs ago", status: "sent", tx: "3Lp7...n9Xm" },
  { id: "D-004", farmer: "Ester Nkya", usdc: "79.00", tzs: "200,000", dest: "M-Pesa", phone: "0745***321", time: "5 hrs ago", status: "pending", tx: "pending..." },
];

const Disbursements = () => {
  const [selectedDisbursement, setSelectedDisbursement] = useState<typeof disbursements[0] | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Disbursements</h1>
        <p className="text-sm text-muted-foreground">Track fund conversion and mobile money transfers</p>
      </div>

      {/* Conversion flow */}
      <Card className="border-0 shadow-sm gradient-card">
        <CardContent className="p-6">
          <p className="text-sm font-semibold mb-4">How Funds Move</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 justify-center">
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 hover:shadow-md transition-shadow">
              <Coins className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Loan in</p>
                <p className="font-bold">USDC</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 hover:shadow-md transition-shadow">
              <Banknote className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Converted to</p>
                <p className="font-bold">TZS (Shillings)</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 hover:shadow-md transition-shadow">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Sent via</p>
                <p className="font-bold">Mobile Money</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disbursement list */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Disbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {disbursements.map((d) => (
              <div
                key={d.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/30 hover:shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                onClick={() => setSelectedDisbursement(d)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {d.farmer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{d.farmer}</p>
                    <p className="text-xs text-muted-foreground">{d.dest} · {d.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">USDC</p>
                    <p className="font-mono font-medium">${d.usdc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TZS</p>
                    <p className="font-mono font-bold">{d.tzs}</p>
                  </div>
                  <Badge variant={d.status === "sent" ? "default" : "secondary"} className="text-[10px]">
                    {d.status === "sent" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {d.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDisbursement} onOpenChange={(v) => !v && setSelectedDisbursement(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disbursement Details</DialogTitle>
          </DialogHeader>
          {selectedDisbursement && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground">
                  {selectedDisbursement.farmer.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{selectedDisbursement.farmer}</p>
                  <p className="text-xs text-muted-foreground">{selectedDisbursement.id} · {selectedDisbursement.time}</p>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">USDC Amount</span>
                  <span className="font-mono font-bold">${selectedDisbursement.usdc}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TZS Amount</span>
                  <span className="font-bold">{selectedDisbursement.tzs} TZS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">{selectedDisbursement.dest}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-mono">{selectedDisbursement.phone}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Solana TX</span>
                  <span className="font-mono text-xs text-primary">{selectedDisbursement.tx}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Transaction secured on Solana blockchain
              </div>

              <Button onClick={() => setSelectedDisbursement(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Disbursements;
