import AdditionalDownloadButton from "@/components/additional-download-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import Paging from "@/pages/_components/Paging";
import { useParams } from "@/router";
import { DemoContentCollectionResponse, PostItemType } from "@/types/item";
import capitalizeHyphenatedWords from "@/utils/capitalizeHyphenatedWords";
import { decodeEntities } from "@wordpress/html-entities";
import { DownloadCloud } from "lucide-react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

type Props = {
  item: PostItemType;
};
const pageSchema = z.number().gte(1).default(1);

export default function ItemDemoContents({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = pageSchema.parse(Number(searchParams?.get("page") ?? 1));
  const { data, isError, isLoading, isFetching } =
    useApiFetch<DemoContentCollectionResponse>("item/demo-content", {
      item_id: params.id,
      page,
    });
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Demo Contents</CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">
          {data?.data ? (
            <div className="flex flex-col gap-4">
              <table className="table-auto">
                <thead>
                  <tr className="text-left font-semibold">
                    <th className="w-full border-b pb-4 pr-4">Version</th>
                    <th className="border-b px-4 pb-4">Type</th>
                    <th className="border-b px-4 pb-4">Date</th>
                    <th className="max-w-11 border-b pb-4 pl-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map(ditem => (
                    <tr className="" key={ditem.id}>
                      <td className="border-b py-4 pr-4">{ditem.title}</td>
                      <td className="whitespace-nowrap border-b  p-4">
                        {capitalizeHyphenatedWords(ditem.type)}
                      </td>

                      <td className="whitespace-nowrap border-b p-4 text-muted-foreground">
                        {moment.unix(ditem.updated).format("D MMM, YYYY")}
                      </td>
                      <td className="border-b py-4 pl-4">
                        <AdditionalDownloadButton
                          item={item}
                          media={ditem}
                          size="icon"
                          variant="outline"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <div className="">Loading...</div>
          ) : (
            <div className="">No Items Found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
