import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";

type Props = {
  item: PostItemType;
};
export default function ItemSupport({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Support</CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">Coming Soon</CardContent>
      </Card>
    </div>
  );
}
