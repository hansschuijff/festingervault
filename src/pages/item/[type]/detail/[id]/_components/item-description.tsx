import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import DemoContentPreview from "./demo-content-preview";

type Props = {
  item: PostItemType;
};
export default function ItemDescription({ item }: Props) {
	const params = useParams("/item/:type/detail/:id/:tab?");
	 return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">{__("Description")}</CardHeader>
        <CardContent className="p-5 sm:p-7 text-sm leading-relaxed font-light">{decodeEntities(item.summary)}</CardContent>
      </Card>
			{item.additional_content_count > 0 && <DemoContentPreview item={item} />}
    </div>
  );
}
