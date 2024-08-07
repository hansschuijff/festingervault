import AdditionalDownloadButton from "@/components/additional-download-button";
import SimpleTable, { SimpleColumnDef } from "@/components/table/simple-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useApiFetch from "@/hooks/useApiFetch";
import Paging from "@/pages/_components/Paging";
import { Link, useParams } from "@/router";
import {
  DemoContentCollectionResponse,
  DemoContentType,
  PostItemType,
} from "@/types/item";
import capitalizeHyphenatedWords from "@/utils/capitalizeHyphenatedWords";
import { decodeEntities } from "@wordpress/html-entities";
import { DownloadCloud } from "lucide-react";
import moment from "moment";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { DemoContentTable } from "./item-demo-contents";
type DemoContentTableProps = {
  item: PostItemType;
  data: DemoContentType[];
};
type Props = {
  item: PostItemType;
};
const pageSchema = z.number().gte(1).default(1);

export default function DemoContentPreview({ item }: Props) {
  const params = useParams("/item/:type/detail/:id/:tab?");
  const { data, isError, isLoading, isFetching } =
    useApiFetch<DemoContentCollectionResponse>("item/demo-content", {
      item_id: params.id,
    });
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <Card>
        <CardHeader className="border-b p-5 sm:p-7">Demo Contents</CardHeader>
        <CardContent className="p-5 text-sm sm:p-7">
          {data?.data ? (
            <div className="flex flex-col gap-4">
              <DemoContentTable item={item} data={data?.data.slice(0, 5)} />
            </div>
          ) : isLoading || isFetching ? (
            <div className="">Loading...</div>
          ) : (
            <div className="">No Items Found</div>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t border-border text-center">
          <Link
            to="/item/:type/detail/:id/:tab?"
            params={{ ...params, tab: "demo-contents" }}
            className="border-b border-dashed border-blue-500 text-sm text-blue-500"
          >
            View More
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
