import { Card, CardContent } from "@/components/ui/card";
import { Grid } from "@/components/ui/grid";
import useApiFetch from "@/hooks/useApiFetch";
import { cn } from "@/lib/utils";
import { ItemStatsResponse } from "@/types/item";
import {
	Drum,
	Grid2X2,
	LucideIcon,
	Palette,
	ToyBrick
} from "lucide-react";
import millify from "millify";
import React from "react";
import CountUp from "react-countup";
import { ClassNameValue } from "tailwind-merge";

type IconProps = React.HTMLAttributes<SVGElement>;

type Props = {
  className?: ClassNameValue;
  icon: React.ComponentType<IconProps> & LucideIcon;
  title: string;
  count: number;
};
function ItemCard({ className, icon: Icon, title, count }: Props) {
  return (
    <Card className={cn(className)}>
      <CardContent className="relative p-4 sm:p-6">
        <Grid size={25} />
        <div
          className={cn(
            "flex aspect-square flex-col justify-between",
            className,
          )}
        >
          <Icon size="36" />
          <div className="space-y-1">
            <div className="text-2xl">
              <CountUp
                start={0}
                end={count}
                duration={2.75}
                formattingFn={num => millify(num)}
              />
            </div>
            <div className="text-sm text-muted-foreground">{title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ItemStats() {
  const { data } =
    useApiFetch<ItemStatsResponse>("item/stats");
  return (
    <div className="grid grid-cols-2 gap-5 lg:gap-7 md:grid-cols-2">
      <ItemCard
        icon={Grid2X2}
        title="Total Products"
        count={data ? data.total : 0}
      />
      <ItemCard
        icon={Palette}
        title="Total Themes"
        count={data ? data.themes : 0}
      />
      <ItemCard
        icon={ToyBrick}
        title="Total Plugins"
        count={data ? data.plugins : 0}
      />
      <ItemCard icon={Drum} title="Total Kits" count={data ? data.kits : 0} />
    </div>
  );
}
