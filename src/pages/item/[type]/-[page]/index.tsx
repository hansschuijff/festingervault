import { AppPageShell } from "@/components/body/page-shell";
import FilterBar from "@/components/filter/FilterBar";
import { SortItems } from "@/components/sorting/sort";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { item_types } from "@/config/item";
import useApiFetch from "@/hooks/useApiFetch";
import useFilter, { FilterOption } from "@/hooks/useFilter";
import { cn } from "@/lib/utils";
import Paging from "@/pages/_components/Paging";
import PostGridItem, {
  PostGridItemSkeleton,
} from "@/pages/item/[type]/-[page]/_components/PostGridItem";
import { useParams } from "@/router";
import { ItemTypeEnum, PostItemCollectionResponse } from "@/types/item";
import catsToKeyValuePairs from "@/utils/catsToKeyValuePairs";
import { __, sprintf } from "@wordpress/i18n";
import { SearchX } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

const sort_items: SortItems[] = [
  {
    label: "Updated",
    value: "updated",
  },
  {
    label: "Title",
    value: "title",
  },
  {
    label: "Popularity",
    value: "popularity",
  },
];
const path = "/item/:type/:page?";
const paramsSchema = z.object({
  type: ItemTypeEnum.default("wordpress-themes"),
  page: z.coerce.number().default(1),
});
const filters: FilterOption[] = [
  {
    id: "level",
    label: __("Access"),
    isMulti: true,
    options: [
      {
        label: "Bronze",
        value: "bronze",
      },
      {
        label: "Silver",
        value: "silver",
      },
      {
        label: "Gold",
        value: "gold",
      },
    ],
  },
  {
    id: "add_content",
    label: "Additional Content",
    isMulti: false,
    options: [
      {
        label: "Yes",
        value: "yes",
      },
      {
        label: "No",
        value: "no",
      },
    ],
  },
];
function NoSearchResultFound() {
  const params = paramsSchema.parse(useParams(path));
  return (
    <Card className="col-span-1  md:col-span-3">
      <div className="flex flex-col items-center gap-4 px-4 py-10 sm:px-6">
        <div>
          <SearchX size={48} />
        </div>
        <div className="text-center text-sm italic text-muted-foreground">
          We couldn't find the item you're looking for, you can make a wish
          request
        </div>
        <Button asChild variant="outline">
          <Link to={`/requests?type=${params.type}`}>Add Request</Link>
        </Button>
      </div>
    </Card>
  );
}
export default function Component() {
  const params = paramsSchema.parse(useParams(path));
  const item = item_types[params.type];
  const type = item_types[params.type].slug;
  const page = params.page || 1;
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isFetching: isFetchingCategories,
  } = useApiFetch<string[]>("item/categories", {
    type,
  });
  const categoryFilter: FilterOption[] = useMemo(
    () => [
      {
        id: "category",
        label: "Category",
        isMulti: true,
        options: categories ? catsToKeyValuePairs(categories) : [],
      },
    ],
    [categories, categoriesIsLoading, catsToKeyValuePairs],
  );
  const filter = useFilter({
    options: [...categoryFilter, ...filters],
    path: path,
    sort: sort_items,
  });
  const { data, isLoading, isFetching } =
    useApiFetch<PostItemCollectionResponse>("item/list", {
      type,
      page,
      filter: filter.items,
      sort: filter.sorting,
      keyword: filter.search?.keyword,
    });
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [data]);
  return (
    <AppPageShell
      title={item.label}
      description={item.description}
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
          href: `/item/${type}`,
        },
        {
          label: sprintf(__("Page %d"), params.page.toLocaleString()),
        },
      ]}
    >
      {data && (
        <>
          <FilterBar filter={filter} />

          <div
            className={cn(["grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-7"])}
          >
            {data.data.length > 0 ? (
              data.data.map(item => (
                <PostGridItem key={item.id} item={{ ...item }} />
              ))
            ) : (
              <NoSearchResultFound />
            )}
          </div>
          {data.meta && (
            <Paging
              currentPage={page}
              totalPages={data.meta?.last_page}
              urlGenerator={(_page: number) =>
                `/item/${params.type}/${_page}?${filter?.searchParams}`
              }
            />
          )}
        </>
      )}
    </AppPageShell>
  );
}
