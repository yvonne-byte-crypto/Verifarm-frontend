import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

interface Props {
  land: number;
  cattle: number;
  score: number;
}

const LoanEligibilityBreakdown = ({ land, cattle, score }: Props) => {
  const landValue = land * 80000;
  const cattleValue = cattle * 25000;
  const totalCollateral = landValue + cattleValue;
  const ltvRatio = score >= 80 ? 60 : score >= 60 ? 45 : 30;
  const eligibleLoan = Math.round((totalCollateral * ltvRatio) / 100 / 10000) * 10000;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">Loan Eligibility Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Land Value ({land} acres × 80,000)</span>
            <span className="font-medium">TZS {landValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cattle Value ({cattle} head × 25,000)</span>
            <span className="font-medium">TZS {cattleValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
            <span>Total Collateral</span>
            <span>TZS {totalCollateral.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loan-to-Value Ratio</span>
            <span className="font-semibold text-primary">{ltvRatio}%</span>
          </div>
          <Progress value={ltvRatio} className="h-2" />
        </div>

        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Eligible Loan Amount</p>
          <p className="text-3xl font-bold text-primary">TZS {eligibleLoan.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanEligibilityBreakdown;
