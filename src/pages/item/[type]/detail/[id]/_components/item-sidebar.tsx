import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostItemType } from "@/types/item";
import millify from "millify";
import CountUp from "react-countup";
import VirusTotalScan from "./item-virus-total";
import ItemDetail from "./item-detail";
import ChangelogPreview from "./changelog-preview";
import { useParams } from "@/router";

type Props = {
  item: PostItemType;
};
export default function ItemSidebar({ item }: Props) {
	const params=useParams("/item/:type/detail/:id/:tab?")
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardContent className="grid grid-cols-2 divide-x text-center">
          <div className="p-2">
            <div className="text-2xl font-semibold">
              <CountUp
                start={0}
                end={item.download_count}
                duration={2.75}
                formattingFn={num => millify(num)}
              />
            </div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </div>
          <div className="p-2">
            <div className="text-2xl">
              <CountUp
                start={0}
                end={item.install_count}
                duration={2.75}
                formattingFn={num => millify(num)}
              />
            </div>
            <div className="text-sm text-muted-foreground">Installs</div>
          </div>
        </CardContent>
      </Card>
      <VirusTotalScan item={item} />
			<ItemDetail item={item}/>
			{item.media_count>0 && params.tab!="changelog" && <ChangelogPreview item={item} />}
    </div>
  );
}
