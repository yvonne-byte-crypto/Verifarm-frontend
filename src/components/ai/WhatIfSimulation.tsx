import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  baseLand: number;
  baseCattle: number;
  baseScore: number;
  onScoreChange: (score: number, eligible: number) => void;
}

function calcScore(land: number, cattle: number): number {
  const landPts = Math.min(land * 5, 30);
  const livestockPts = Math.min(cattle * 2, 30);
  const paymentPts = 25;
  const base = landPts + livestockPts + paymentPts;
  return Math.min(Math.max(Math.round(base + 10 + Math.random() * 2), 40), 99);
}

function calcEligible(score: number, land: number, cattle: number): number {
  const collateral = land * 80000 + cattle * 25000;
  const ltv = score >= 80 ? 0.6 : score >= 60 ? 0.45 : 0.3;
  return Math.round(collateral * ltv / 10000) * 10000;
}

const WhatIfSimulation = ({ baseLand, baseCattle, baseScore, onScoreChange }: Props) => {
  const [land, setLand] = useState(baseLand);
  const [cattle, setCattle] = useState(baseCattle);
  const [simScore, setSimScore] = useState(baseScore);
  const [simEligible, setSimEligible] = useState(0);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const s = calcScore(land, cattle);
    const e = calcEligible(s, land, cattle);
    setSimScore(s);
    setSimEligible(e);
    setChanged(land !== baseLand || cattle !== baseCattle);
    onScoreChange(s, e);
  }, [land, cattle]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">What-If Simulation</CardTitle>
          {changed && <Badge variant="secondary" className="text-[10px]">Modified</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Land (acres)</span>
            <span className="font-semibold">{land}</span>
          </div>
          <Slider value={[land]} onValueChange={([v]) => setLand(v)} min={1} max={30} step={1} />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cattle (head)</span>
            <span className="font-semibold">{cattle}</span>
          </div>
          <Slider value={[cattle]} onValueChange={([v]) => setCattle(v)} min={1} max={50} step={1} />
        </div>

        <div className={`rounded-lg p-4 transition-all duration-300 ${changed ? "bg-primary/5 border border-primary/20" : "bg-muted"}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Updated Score</p>
              <p className={`text-2xl font-bold transition-colors ${simScore >= 80 ? "text-primary" : simScore >= 60 ? "text-secondary" : "text-destructive"}`}>
                {simScore}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Updated Loan</p>
              <p className="text-2xl font-bold">TZS {simEligible.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatIfSimulation;
