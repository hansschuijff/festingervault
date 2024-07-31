import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import { cn } from "@/lib/utils";
import { PostItemCollectionResponse } from "@/types/item";
import version_compare from "@/utils/version_compare";
import { __ } from "@wordpress/i18n";
import { useMemo } from "react";
import { ClassNameValue } from "tailwind-merge";
import { StackedBarChart, StackedBarChartDataType } from "./StackedBarChart";

type Props = {
  className?: ClassNameValue;
};

export default function InstallStats({ className }: Props) {
  const { data, isLoading } = useApiFetch<PostItemCollectionResponse>(
    `update/list`,
    {},
  );
  const themes = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return data.data?.filter(item => item.type === "wordpress-themes");
  }, [data]);
  const plugins = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return data.data?.filter(item => item.type === "wordpress-plugins");
  }, [data]);
  const themeUpdateAvailable = useMemo(() => {
    return themes.filter(item =>
      version_compare(item.version, item.installed_version, "gt"),
    );
  }, [themes]);
  const pluginUpdateAvailable = useMemo(() => {
    return plugins.filter(item =>
      version_compare(item.version, item.installed_version, "gt"),
    );
  }, [plugins]);
  const chartData = useMemo<StackedBarChartDataType[]>(
    () => [
      {
        name: "theme",
        label: "Themes",
        value: themes.length,
        color: "hsl(var(--chart-1))",
      },
      {
        name: "plugin",
        label: "Plugins",
        value: plugins.length,
        color: "hsl(var(--chart-2))",
      },
    ],
    [plugins, themes],
  );
  const total = plugins.length + themes.length;
  return (
    <Card className={cn("aspect-auto justify-between ", className)}>
      <CardHeader className="border-b border-border sm:p-4 sm:pb-4">
        <h3 className="text-lg">{__("Installed Assets")}</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 sm:p-4">
        <div className="text-muted-foreground">Installed</div>
        <div className="space-x-2">
          <span className="text-3xl">{total}</span>
          <span className="text-muted-foreground">Items</span>
        </div>
        <StackedBarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
