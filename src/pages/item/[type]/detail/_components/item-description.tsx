import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";

type Props = {
  item: PostItemType;
};
export default function ItemDescription({ item }: Props) {
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b">Description</CardHeader>
        <CardContent className="p-4 sm:p-6 text-sm">{decodeEntities(item.summary)}</CardContent>
      </Card>
    </div>
  );
}
