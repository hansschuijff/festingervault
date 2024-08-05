import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostChangelogCollectionResponse, PostItemType } from "@/types/item";
import { DownloadCloud } from "lucide-react";
import moment from "moment";

type Props = {
  item: PostItemType;
};
export default function ItemChangeLog({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const { data, isError, isLoading, isFetching } =
    useApiFetch<PostChangelogCollectionResponse>("item/changelog", {
      item_id: params.id,
    });
  return (
    data && (
      <div className="flex flex-col gap-5 sm:gap-7">
        <Card>
          <CardHeader className="border-b p-5 sm:p-7">Changelog</CardHeader>
          <CardContent className="p-5 text-sm sm:p-7">
            {data?.data?.length > 0 ? (
              <div className="divide-y">
                {data?.data?.map(item => (
                  <div
                    className="flex flex-row items-center justify-between gap-4 p-4 first:pt-0 last:pb-0"
                    key={item.id}
                  >
                    <div className="space-y-1">
                      <div className="text-xl">{item.version}</div>
                      <div className="text-muted-foreground">{item.slug}</div>
                      <div className="text-muted-foreground">
                        {moment.unix(item.updated).fromNow()}
                      </div>
                    </div>
                    <div>
                      <Button size="iconSmall" variant="outline">
                        <DownloadCloud size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="">No Items Found</div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  );
}
