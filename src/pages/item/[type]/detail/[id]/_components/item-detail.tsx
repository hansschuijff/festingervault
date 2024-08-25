import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import moment from "moment";
import { useMemo } from "react";

type Props = {
  item: PostItemType;
};
type Row = {
  label: string;
  el: () => React.ReactNode;
  enabled?: boolean;
};
export default function ItemDetail({ item }: Props) {
  const items = useMemo<Row[]>(
    () => [
      { label: __("Version", 'festingervault'), el: () => item.version },
      { label: __("Slug", 'festingervault'), el: () => item.slug },
      { label: __("Status", 'festingervault'), el: () => "Functional" },
      {
        label: __("Updated", 'festingervault'),
        el: () => moment.unix(item.updated).format("MMM D, YYYY"),
      },
      {
        label: __("Published", 'festingervault'),
        el: () => moment.unix(item.created).format("MMM D, YYYY"),
      },
      {
        label: __("Author", 'festingervault'),
        el: () =>
          item.terms
            .filter(i => i.taxonomy === "item_author")
            .map(i => decodeEntities(i.name))
            .join(", "),
        enabled:
          item.terms.filter(i => i.taxonomy === "item_author").length > 0,
      },
      {
        label: __("Columns", 'festingervault'),
        el: () =>
          item.terms
            .filter(i => i.taxonomy === "columns")
            .map(i => decodeEntities(i.name))
            .join(", "),
        enabled: item.terms.filter(i => i.taxonomy === "columns").length > 0,
      },
      {
        label: __("Gutenberg Optimized", 'festingervault'),
        el: () =>
          item.terms
            .filter(i => i.taxonomy === "gutenberg-optimized")
            .map(i => decodeEntities(i.name))
            .join(", "),
        enabled:
          item.terms.filter(i => i.taxonomy === "gutenberg-optimized").length >
          0,
      },
      {
        label: __("High Resolution", 'festingervault'),
        el: () =>
          item.terms
            .filter(i => i.taxonomy === "high-resolution")
            .map(i => decodeEntities(i.name))
            .join(", "),
        enabled:
          item.terms.filter(i => i.taxonomy === "high-resolution").length > 0,
      },
      {
        label: __("Widget Ready", 'festingervault'),
        el: () =>
          item.terms
            .filter(i => i.taxonomy === "widget-ready")
            .map(i => decodeEntities(i.name))
            .join(", "),
        enabled:
          item.terms.filter(i => i.taxonomy === "widget-ready").length > 0,
      },
      {
        label: __("Access", 'festingervault'),
        el: () => <span className="capitalize">{item.access}</span>,
      },
    ],
    [item],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        {__("Details", 'festingervault')}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(
          ({ label, el: Element, enabled }) =>
            enabled !== false && (
              <div
                key={label}
                className="grid grid-cols-3 gap-3 text-sm font-light"
              >
                <div className="col-span-1 text-muted-foreground">{label}</div>
                <div className="col-span-2">
                  <Element />
                </div>
              </div>
            ),
        )}
      </CardContent>
    </Card>
  );
}
