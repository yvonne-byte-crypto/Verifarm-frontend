import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Brain } from "lucide-react";

interface Factor {
  label: string;
  points: number;
  max: number;
  positive: boolean;
}

interface Props {
  score: number;
  land: number;
  cattle: number;
}

function computeFactors(land: number, cattle: number, score: number): Factor[] {
  const landPts = Math.min(land * 5, 30);
  const livestockPts = Math.min(cattle * 2, 30);
  const paymentPts = 25;
  const riskPenalty = Math.max(0, 100 - score - landPts - livestockPts - paymentPts);
  return [
    { label: "Land size contribution", points: landPts, max: 30, positive: true },
    { label: "Livestock health & count", points: livestockPts, max: 30, positive: true },
    { label: "Payment history", points: paymentPts, max: 25, positive: true },
    { label: "Risk factors", points: riskPenalty > 0 ? riskPenalty : 2, max: 15, positive: false },
  ];
}

const AIExplainability = ({ score, land, cattle }: Props) => {
  const [open, setOpen] = useState(false);
  const factors = computeFactors(land, cattle, score);

  return (
    <Card className="border-0 shadow-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg" aria-label="How was this score calculated?">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">How was this score calculated?</CardTitle>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-2">
            {factors.map((f) => (
              <div key={f.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className={`font-semibold ${f.positive ? "text-primary" : "text-destructive"}`}>
                    {f.positive ? "+" : "-"}{f.points} pts
                  </span>
                </div>
                <Progress value={(f.points / f.max) * 100} className="h-1.5" aria-label={`${f.label}: ${f.points} of ${f.max} points`} />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold">Final AI Score</span>
              <span className="text-xl font-bold text-primary">{score}</span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AIExplainability;
