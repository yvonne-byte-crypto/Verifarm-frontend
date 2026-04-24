import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldIdBadgeProps {
  verified: boolean;
  className?: string;
}

const WorldIdBadge = ({ verified, className }: WorldIdBadgeProps) => {
  if (!verified) return null;
  return (
    <Badge
      className={cn(
        "gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold",
        className
      )}
      variant="outline"
    >
      <ShieldCheck className="h-3 w-3" aria-hidden="true" />
      World ID Verified
    </Badge>
  );
};

export default WorldIdBadge;
