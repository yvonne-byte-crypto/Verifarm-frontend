import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, Banknote } from "lucide-react";

interface Props {
  score: number;
  eligibleAmount: number;
}

function getRecommendation(score: number, amount: number) {
  if (score >= 85) return { period: "3 months", explanation: `Based on strong asset verification and excellent payment history, this farmer can safely handle repayment within 3 months.` };
  if (score >= 70) return { period: "6 months", explanation: `Moderate asset strength suggests a 6-month repayment window for manageable installments.` };
  return { period: "9 months", explanation: `Lower asset score indicates extended repayment period is recommended to reduce default risk.` };
}

const AIRecommendation = ({ score, eligibleAmount }: Props) => {
  const rec = getRecommendation(score, eligibleAmount);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-secondary" />
          <CardTitle className="text-base font-semibold">AI Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Banknote className="h-3 w-3" /> Recommended Amount
            </div>
            <p className="text-lg font-bold text-primary">TZS {eligibleAmount.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" /> Repayment Period
            </div>
            <p className="text-lg font-bold">{rec.period}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{rec.explanation}</p>
      </CardContent>
    </Card>
  );
};

export default AIRecommendation;
