import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, AlertCircle, Clock, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QueueItem {
  id: string;
  farmer: string;
  phone: string;
  submittedAt: string;
  dateSubmitted: string;
  farmSize: string;
  landAcres: string;
  livestock: string;
  region: string;
}

const initialQueue: QueueItem[] = [
  { id: "VQ-001", farmer: "Amina Juma", phone: "+255 712 345 678", submittedAt: "2 hrs ago", dateSubmitted: "Apr 18, 2026", farmSize: "4–6 acres", landAcres: "5", livestock: "12 cattle, 8 goats", region: "Arusha" },
  { id: "VQ-002", farmer: "Baraka Mwenda", phone: "+255 754 321 987", submittedAt: "5 hrs ago", dateSubmitted: "Apr 18, 2026", farmSize: "7+ acres", landAcres: "9", livestock: "20 cattle", region: "Dar es Salaam" },
  { id: "VQ-003", farmer: "Chiku Lema", phone: "+255 689 456 123", submittedAt: "1 day ago", dateSubmitted: "Apr 17, 2026", farmSize: "1–3 acres", landAcres: "3", livestock: "30 chickens", region: "Mwanza" },
  { id: "VQ-004", farmer: "Daudi Kileo", phone: "+255 621 789 456", submittedAt: "1 day ago", dateSubmitted: "Apr 17, 2026", farmSize: "4–6 acres", landAcres: "4", livestock: "8 cattle, 15 goats", region: "Tanga" },
  { id: "VQ-005", farmer: "Ester Nkya", phone: "+255 745 654 321", submittedAt: "2 days ago", dateSubmitted: "Apr 16, 2026", farmSize: "1–3 acres", landAcres: "2", livestock: "5 goats, 20 chickens", region: "Iringa" },
];

const VerificationQueue = () => {
  const [queue, setQueue] = useState(initialQueue);

  const handleVerify = (id: string, farmer: string) => {
    setQueue((q) => q.filter((i) => i.id !== id));
    toast({ title: "Verified ✓", description: `${farmer}'s farm data confirmed.` });
  };

  const handleRequestMore = (farmer: string) => {
    toast({ title: "Request sent", description: `Asked ${farmer} for more documentation.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verification Queue</h1>
          <p className="text-sm text-muted-foreground">
            Farmers awaiting field-agent verification
          </p>
        </div>
        <Badge variant="outline" className="text-xs">{queue.length} pending</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {queue.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">{item.farmer}</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{item.id}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Clock className="h-3 w-3" /> {item.submittedAt}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-muted rounded-lg p-2">
                  <p className="text-muted-foreground">Land</p>
                  <p className="font-semibold mt-0.5">{item.landAcres} acres</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="text-muted-foreground">Livestock</p>
                  <p className="font-semibold mt-0.5 truncate">{item.livestock}</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-semibold mt-0.5">{item.dateSubmitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-mono">{item.phone}</span>
                <span className="ml-auto flex items-center gap-1"><MapPin className="h-3 w-3" />{item.region}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1 gap-1.5 bg-primary hover:bg-primary/90" onClick={() => handleVerify(item.id, item.farmer)}>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Verify
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5 border-secondary text-secondary hover:bg-secondary/10" onClick={() => handleRequestMore(item.farmer)}>
                  <AlertCircle className="h-4 w-4" aria-hidden="true" /> Request More Data
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {queue.length === 0 && (
          <Card className="border-0 shadow-sm md:col-span-2">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-2" />
              All caught up — no pending verifications.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerificationQueue;
