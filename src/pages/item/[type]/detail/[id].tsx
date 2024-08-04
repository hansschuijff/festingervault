import { AppPageShell } from "@/components/body/page-shell";
import { item_types } from "@/config/item";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import ItemDetailHeader, {
  ItemDetailHeaderSkeleton,
} from "./_components/detail-header";
import ItemDescription from "./_components/item-description";

export default function Component() {
  const params = useParams("/item/:type/detail/:id");
  const { data, isError, isLoading, isFetching } = useApiFetch<PostItemType>(
    "item/detail",
    {
      id: params.id,
    },
  );
  return (
    <AppPageShell
      title={data?.title ?? "Item Detail"}
      description=""
      preloader={<ItemDetailHeaderSkeleton />}
      breadcrump={[
        {
          label: item_types[params.type].label,
          href: `/item/${params.type}`,
        },
        {
          label: decodeEntities(data?.title),
        },
      ]}
      {...{ isError, isFetching, isLoading }}
    >
      {data && (
        <>
          <ItemDetailHeader item={data} />
          <div className="flex flex-row gap-5 sm:gap-7">
            <div className="flex-1">
              <ItemDescription item={data} />
            </div>
            <div className="w-80">Hello</div>
          </div>
        </>
      )}
    </AppPageShell>
  );
}
