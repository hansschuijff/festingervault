import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams } from "@/router";
import { TPostItem } from "@/types/item";

type Props = {
  item: TPostItem;
};
export default function ItemDocumentation({ item }: Props) {
  const params = useParams("/item/:slug/detail/:id/:tab?");
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Documentation</CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">Coming Soon</CardContent>
      </Card>
    </div>
  );
}
