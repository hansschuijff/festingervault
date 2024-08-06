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
export default function HistoryItems({ data }: Props) {
  const params = useParams("/history/:page?");
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <table className="table-auto">
            <thead>
              <tr className="text-left font-semibold">
                <th className="w-full border-b pb-4 pr-4">Title</th>
                <th className="w-full border-b pb-4 pr-4">Type</th>
                <th className="border-b px-4 pb-4">Date</th>
                <th className="max-w-11 border-b pb-4 pl-4">Version</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map(item => (
                <tr key={item.id}>
                  <td className="w-full whitespace-nowrap border-b py-4 pr-0 text-muted-foreground">
                    <Link
                      to="/item/:type/detail/:id/:tab?"
                      params={{ id: item.item.id, type: item.item.type }}
                      className="flex flex-col gap-2"
                    >
                      <span>{decodeEntities(item.item.title)}</span>
                      {item.type === "download_additional" && (
                        <span className="text-xs">{item.media?.title}</span>
                      )}
                    </Link>
                  </td>
                  <td className="border-b py-4">
                    <Badge variant="bronze" className="uppercase">
                      {item.type?.replace("_"," ")}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap border-b p-4 text-muted-foreground">
                    {moment.unix(item.created).format("DD MMM, YYYY HH:mm a")}
                  </td>
                  <td className="whitespace-nowrap border-b py-4 pl-4 text-muted-foreground">
                    {item?.media?.version ?? item.item.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
