import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostItemType } from "@/types/item";
import { __ } from "@wordpress/i18n";
import { ShieldCheck, ShieldEllipsis } from "lucide-react";
import moment from "moment";
import { useMemo } from "react";

type Props = {
  item: PostItemType;
};
export default function ItemDetail({ item }: Props) {
  const items = useMemo(
    () => [
		{ label: "Version", el: () => item.version },
		{ label: "Status", el: () => "Functional"},
		{ label: "Updated", el: () => moment.unix(item.updated).format("MMM D, YYYY")},
		{ label: "Published", el: () => moment.unix(item.created).format("MMM D, YYYY")},
		{ label: "Access", el: () => <span className="capitalize">{item.access}</span>},
	],
    [item],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <h3 className="text-lg">{__("Details")}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(row => (
          <div key={row.label} className="grid grid-cols-3 gap-3 text-sm font-light">
            <div className="col-span-1 text-muted-foreground">{row.label}</div>
            <div className="col-span-2">
              <row.el />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
