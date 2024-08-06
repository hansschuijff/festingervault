import InstallButton from "@/components/install-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import useInstall from "@/hooks/useInstall";
import Paging from "@/pages/_components/Paging";
import { useParams } from "@/router";
import { PostChangelogCollectionResponse, PostItemType } from "@/types/item";
import cn from "@/utils/cn";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

type Props = {
  item: PostItemType;
};
const pageSchema = z.number().gte(1);
export default function ItemChangeLog({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const [searchParams, setSearchParams] = useSearchParams();
  const { isInstalled } = useInstall(item);
  const page = pageSchema.parse(Number(searchParams?.get("page") ?? 1));
  const { data, isError, isLoading, isFetching } =
    useApiFetch<PostChangelogCollectionResponse>("item/changelog", {
      item_id: params.id,
      page,
    });
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Changelog</CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">
          {data?.data ? (
            <div className="flex flex-col gap-4">
              <div className="divide-y">
                <div className="flex flex-row items-center justify-between gap-4 p-4 first:pt-0 last:pb-0">
                  <div className="flex-1 font-bold">Version</div>
                  <div className="font-bold">Date</div>
                  <div className="w-9"></div>
                </div>
                {data?.data?.map(media => (
                  <div
                    className="flex flex-row items-center justify-between gap-4 p-4 first:pt-0 last:pb-0"
                    key={media.id}
                  >
                    <div className="flex flex-1 flex-row items-center gap-2">
                      <span className="text-xl">{media.version}</span>
                      {isInstalled &&
                        isInstalled.installed_version === media.version && (
                          <Badge variant="info" size="sm">
                            Installed
                          </Badge>
                        )}
                    </div>
                    <div className="text-muted-foreground">
                      {moment.unix(media.updated).format("D MMM, YYYY")}
                    </div>
                    <div>
                      <InstallButton
                        item={item}
                        media={media}
                        size="icon"
                        variant="outline"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {data?.meta && (
                <Paging
                  currentPage={page}
                  totalPages={Number(data?.meta?.last_page)}
                  urlGenerator={(_page: number) =>
                    `/item/${params.type}/detail/${params.id}/${params.tab}?page=${_page}`
                  }
                />
              )}{" "}
            </div>
          ) : isLoading || isFetching ? (
            <div className="">Loading...</div>
          ) : (
            <div className="">No Items Found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
