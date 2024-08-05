import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";

type Props = {
  item: PostItemType;
};
export default function ItemDemoContents({ item }: Props) {
	const params = useParams("/item/:type/detail/:id/:tab?");
	 return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Demo Contents</CardHeader>
        <CardContent className="p-5 sm:p-7 text-sm">Coming Soon</CardContent>
      </Card>
    </div>
  );
}
