import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import moment from "moment";
import { useMemo } from "react";

type Props = {
  title: string;
  terms: PostItemType["terms"];
};
type Row = {
  label: string;
  el: () => React.ReactNode;
  enabled?: boolean;
};
export default function ItemTerms({ title, terms }: Props) {
  return (
    terms.length > 0 && (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          {title}
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap gap-2">
          {terms.map(term => (
            <div key={term.id}>
              <Badge className="text-nowrap" variant="secondary">
                {decodeEntities(term.name)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  );
}
