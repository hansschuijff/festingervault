import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useApiFetch from "@/hooks/useApiFetch";
import { cn } from "@/lib/utils";
import moment from "moment";
import { ClassNameValue } from "tailwind-merge";
import { ActivationDetailType } from "@/types/license";
import { decodeEntities } from "@wordpress/html-entities";

type Props = {
  className?: ClassNameValue;
};
export default function LicenseStatus({ className }: Props) {
  const { data } = useApiFetch<ActivationDetailType>("license/detail", {});
  return (
    <Card className={cn("flex flex-col justify-between gap-6 p-8", className)}>
      <div>
        <h2 className="flex items-center gap-2 text-3xl font-semibold">
          {data?.plan_title}
          <Badge
            variant="outline"
            className="border-green-600 bg-green-600/10 text-green-600"
          >
            {data?.expires > 0
              ? data?.plan_type === "recurring"
                ? "Monthly Plan"
                : "One-Time Plan"
              : "Lifetime Plan"}
          </Badge>
        </h2>
        <div className="text-muted-foreground">
          {decodeEntities(data?.plan_detail)}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="rounded-sm border border-dashed border-muted-foreground p-4">
          <div className="text-lg capitalize">{data?.status ?? "---"}</div>
          <div className="text-sm text-muted-foreground">Status</div>
        </div>
        <div className="rounded-sm border border-dashed border-muted-foreground p-4">
          <div className="text-lg">{data?.today_limit?.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Daily Today</div>
        </div>
        <div className="rounded-sm border border-dashed border-muted-foreground p-4">
          <div className="text-lg">{data?.total_limit?.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">All-Time Limit</div>
        </div>
        <div className="rounded-sm border border-dashed border-muted-foreground p-4">
          <div className="text-lg">Lifetime</div>
          <div className="text-sm text-muted-foreground">Updates</div>
        </div>

        <div className="rounded-sm border border-dashed border-muted-foreground p-4">
          <div className="text-lg">
            {data?.expires > 0
              ? moment.unix(data?.expires).format("DD MM,YYYY")
              : "Never"}
          </div>
          <div className="text-sm text-muted-foreground">Expires</div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <div className="space-x-1">
            <span className="text-muted-foreground">Downloads used:</span>
            <span>
              {data?.today_limit_used} of {data?.today_limit?.toLocaleString()}
            </span>
          </div>
          {data && (
            <Progress
              value={100 * (data.today_limit_used / data.today_limit)}
            />
          )}
        </div>
        <div className="">
          <div>
            <span className="text-muted-foreground">Domains:</span>{" "}
            {data?.activation_count?.toLocaleString()}/
            {data?.activation_limit?.toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}
