
import { PlanProps } from "~/utils/types";
import { Badge } from "~/components/ui/badge";

export default function PlanBadge({ plan }: { plan: PlanProps }) {
  return (
    <Badge
      variant={
        plan === "enterprise"
          ? "violet"
          : plan.startsWith("business")
            ? "sky"
            : plan === "pro"
              ? "blue"
              : "black"
      }
    >
      {plan}
    </Badge>
  );
}
