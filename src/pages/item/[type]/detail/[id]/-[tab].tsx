import { AppPageShell } from "@/components/body/page-shell";
import { item_types } from "@/config/item";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { useMemo } from "react";
import ItemDetailHeader, {
  ItemDetailHeaderSkeleton,
} from "./_components/detail-header";
import DetailTabContent from "./_components/detail-tab-content";
import DetailTabHeaders from "./_components/detail-tab-headers";
import ItemChangeLog from "./_components/item-changelog";
import ItemDemoContents from "./_components/item-demo-contents";
import ItemDescription from "./_components/item-description";
import ItemDocumentation from "./_components/item-documentation";
import ItemSidebar from "./_components/item-sidebar";
import { __, sprintf } from "@wordpress/i18n";
type TabRecordType = {
  id: string;
  label: string;
  el?: React.ComponentType;
  enabled?: boolean;
  external?: string;
};
export type DetailTabType = TabRecordType[];
export default function Component() {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const { data, isError, isLoading, isFetching } = useApiFetch<PostItemType>(
    "item/detail",
    {
      item_id: params.id,
    },
  );
  const tabs = useMemo<DetailTabType>(() => {
    if (!data) {
      return [];
    }
    return [
      {
        id: "description",
        label: __("Description", 'festingervault'),
        el: () => <ItemDescription item={data} />,
      },
      {
        id: "changelog",
        label: __("Changelog", 'festingervault'),
        el: () => <ItemChangeLog item={data} />,
        enabled: data.media_count > 0,
      },
      {
        id: "demo-contents",
        label: sprintf(__("Demo Contents [%d]", 'festingervault'),data.additional_content_count),
        el: () => <ItemDemoContents item={data} />,
        enabled: data.additional_content_count > 0,
      },
      {
        id: "documentation",
        label: __("Documentation", 'festingervault'),
        el: () => <ItemDocumentation item={data} />,
        enabled: false,
      },
      {
        id: "support",
        label: __("Support", 'festingervault'),
        external: data.support_url, // TODO: add forum support to engine
        enabled: data?.support_url?.length > 0,
      },
    ].filter(item => item.enabled ?? true);
  }, [data]);
  return (
    <AppPageShell
      title={data?.title ?? __("Item Detail", 'festingervault')}
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
          <div className="wp-full">
            <DetailTabHeaders item={data} tabs={tabs} />
          </div>
          <div className="flex flex-row gap-5 sm:gap-7">
            <div className="flex-1">
              <DetailTabContent item={data} tabs={tabs} />
            </div>
            <div className="w-80">
              <ItemSidebar item={data} />
            </div>
          </div>
        </>
      )}
    </AppPageShell>
  );
}
