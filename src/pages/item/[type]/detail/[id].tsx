import { AppPageShell } from "@/components/body/page-shell";
import { item_types } from "@/config/item";
import useApiFetch from "@/hooks/useApiFetch";
import { PostGridItemSkeleton } from "@/pages/item/_components/PostGridItem";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";

export default function Component() {
  const params = useParams("/item/:type/detail/:id");
  const { data, isLoading, isFetching } = useApiFetch<PostItemType>(
    "item/detail",
    {
      id: params.id,
    },
  );
  return (
    <AppPageShell
      title={data?.title ?? "Item Detail"}
      description=""
      isFetching={isFetching}
      isLoading={isLoading}
      preloader={
        <div className="grid grid-cols-1 md:grid-cols-3">
          <PostGridItemSkeleton />
        </div>
      }
      breadcrump={[
        {
          label: item_types[params.type].label,
          href: `/item/${params.type}`,
        },
        {
          label: decodeEntities(data?.title),
        },
      ]}
    >
      <p>This page would have more info about current items such as:</p>
      <ul className="list-inside list-disc">
        <li>Item descriptions</li>
        <li>Previous Versions</li>
        <li>Additional Contents</li>
        <li>Virus scan info</li>
        <li>Request update features</li>
        <li>Request update features</li>
      </ul>
    </AppPageShell>
  );
}
