import { __ } from "@/lib/i18n";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { DetailTabType } from "../-[tab]";

type Props = {
  item: PostItemType;
  tabs: DetailTabType;
};
export default function DetailTabContent({ item, tabs }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const active = tabs.find(tab => tab.id === params.tab)?.id ?? "description";
  const tab = tabs.find(tab => tab.id === active);
  const Component =
    tab?.el ?? (() => <div>{__("Invalid Tab?")}</div>);
  return <Component />;
}
