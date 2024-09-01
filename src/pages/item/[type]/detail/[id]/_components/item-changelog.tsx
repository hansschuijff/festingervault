import InstallButton from "@/components/install-button";
import SimpleTable, { SimpleColumnDef } from "@/components/table/simple-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/use-api-fetch";
import useInstall from "@/hooks/use-install";
import { __ } from "@/lib/i18n";
import Paging from "@/pages/_components/paging";
import { useParams } from "@/router";
import {
	PostChangelogCollectionResponse,
	PostItemType,
	PostMediaType,
} from "@/types/item";
import moment from "moment";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

type Props = {
  item: PostItemType;
};
type ItemChangelogTableProps = {
  item: PostItemType;
  data: PostMediaType[];
};
const pageSchema = z.number().gte(1);
function ItemChangelogTable({ item, data }: ItemChangelogTableProps) {
  const { isInstalled } = useInstall(item);
  const columns = useMemo<SimpleColumnDef<PostMediaType>[]>(
    () => [
      {
        id: "version",
        label: __("Version"),
        className: "w-full",
        render({ row }) {
          return (
            <div className="flex flex-row items-center gap-2">
              <span className="text-xl">{row.version}</span>
              {isInstalled && isInstalled.installed_version === row.version && (
                <Badge variant="info" size="sm">
                  {__("Installed")}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "date",
        label: __("Date"),
        className: "whitespace-nowrap text-muted-foreground",
        render({ row }) {
          return moment.unix(row.updated).format("D MMM, YYYY");
        },
      },
      {
        id: "action",
        label: "",
        className: "",
        render({ row }) {
          return (
            <InstallButton
              item={item}
              media={row}
              size="icon"
              variant="outline"
            />
          );
        },
      },
    ],
    [data, item, isInstalled],
  );
  return <SimpleTable columns={columns} data={data} />;
}
export default function ItemChangeLog({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = pageSchema.parse(Number(searchParams?.get("page") ?? 1));
  const { data, isError, isLoading, isFetching } =
    useApiFetch<PostChangelogCollectionResponse>("item/changelog", {
      item_id: params.id,
      page,
    });

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">
          {__("Changelog")}
        </CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">
          {data?.data ? (
            <div className="flex flex-col gap-4">
              <ItemChangelogTable item={item} data={data?.data} />
              {data?.meta && (
                <Paging
                  currentPage={page}
                  totalPages={Number(data?.meta?.last_page)}
                  urlGenerator={(_page: number) =>
                    `/item/${params.type}/detail/${params.id}/${params.tab}?page=${_page}`
                  }
                />
              )}
            </div>
          ) : isLoading || isFetching ? (
            <div className="">{__("Loading...")}</div>
          ) : (
            <div className="">{__("No Items Found")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
