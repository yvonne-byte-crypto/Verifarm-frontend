import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle2, ArrowRight, Info } from "lucide-react";

const farmersData = [
  { id: "F001", name: "Amina Juma", location: "Dodoma", land: 5, cattle: 12, score: 87, eligible: "300,000", status: "verified" },
  { id: "F002", name: "Baraka Mwenda", location: "Arusha", land: 8, cattle: 20, score: 92, eligible: "500,000", status: "verified" },
  { id: "F003", name: "Chiku Lema", location: "Mbeya", land: 3, cattle: 6, score: 72, eligible: "150,000", status: "pending" },
  { id: "F004", name: "Daudi Kileo", location: "Kilimanjaro", land: 12, cattle: 35, score: 95, eligible: "800,000", status: "verified" },
  { id: "F005", name: "Ester Nkya", location: "Morogoro", land: 4, cattle: 8, score: 78, eligible: "200,000", status: "verified" },
  { id: "F006", name: "Farida Hassan", location: "Tanga", land: 6, cattle: 15, score: 84, eligible: "350,000", status: "pending" },
];

const Farmers = () => {
  const [search, setSearch] = useState("");

  const filtered = farmersData.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Farmers</h1>
          <p className="text-sm text-muted-foreground">Manage onboarded farmers and their asset profiles</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sample data notice */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5">
        <Info className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">
          Sample farmer profiles for demonstration — real farmer data populates automatically via on-chain registration through the VeriFarm oracle network.
        </p>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No farmers found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <Link key={f.id} to={`/farmers/${f.id}`}>
            <Card className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground group-hover:scale-110 transition-transform">
                      {f.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{f.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {f.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant={f.status === "verified" ? "default" : "secondary"} className="text-[10px]">
                    {f.status === "verified" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {f.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-lg font-bold">{f.land}</p>
                    <p className="text-[10px] text-muted-foreground">Acres</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2 text-center">
                    <p className="text-lg font-bold">{f.cattle}</p>
                    <p className="text-[10px] text-muted-foreground">Cattle</p>
                  </div>
                  <div className="rounded-lg bg-accent p-2 text-center">
                    <p className="text-lg font-bold text-accent-foreground">{f.score}</p>
                    <p className="text-[10px] text-accent-foreground">AI Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Eligible</span>
                  <span className="text-sm font-bold text-primary">TZS {f.eligible}</span>
                </div>

                <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity justify-center">
                  View Profile <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Farmers;
