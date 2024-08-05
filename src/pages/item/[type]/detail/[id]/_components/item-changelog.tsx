import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import { useParams } from "@/router";
import { PostChangelogCollectionResponse, PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
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
                    className="grid grid-cols-4 p-4 first:pt-0 last:pb-0"
                    key={item.id}
                  >
                    <div className="col-span-1">{item.version}</div>
                    <div className="col-span-1">{item.slug}</div>
                    <div className="col-span-1">
                      {moment.unix(item.updated).fromNow()}
                    </div>
                    <div>

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
