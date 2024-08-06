import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Paging from "@/pages/_components/Paging";
import { Link, useParams } from "@/router";
import { HistoryCollectionType, HistoryItemType } from "@/types/history";
import { decodeEntities } from "@wordpress/html-entities";
import moment from "moment";

type Props = {
  data: HistoryCollectionType;
};
export default function HistoryItem({ data }: Props) {
  const params = useParams("/history/:page?");
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="divide-y">
            <div className="flex flex-row items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-1 flex-row items-center justify-between gap-2">
                <span>Title</span>
                <span>Item Date</span>
              </div>
              <div className="flex flex-row gap-2">
                <span>Version</span>
              </div>
            </div>
            {data?.data.map(item => (
              <div
                className="flex flex-row items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                key={item.id}
              >
                <div className="flex flex-1 flex-row items-center gap-2">
                  <Badge variant="bronze" className="uppercase">
                    {decodeEntities(item.type)}
                  </Badge>
                  <Link
                    to="/item/:type/detail/:id/:tab?"
                    params={{ id: item.item.id, type: item.item.type }}
                    className="flex flex-row items-center transition-colors hover:text-muted-foreground"
                  >
                    {item.item.title}
                  </Link>
                </div>
                <span className="text-sm text-muted-foreground">
                  {moment.unix(item.created).format("DD MMM, YYYY HH:mm a")}
                </span>
                <div className="text-sm text-muted-foreground">
                  {item?.media?.version ?? item.item.version}
                </div>
              </div>
            ))}
          </div>
          {data?.meta && (
            <Paging
              currentPage={data?.meta.current_page}
              totalPages={Number(data?.meta?.last_page)}
              urlGenerator={(_page: number) => `/history/${_page}`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
