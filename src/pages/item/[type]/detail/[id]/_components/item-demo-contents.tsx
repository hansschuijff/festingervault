import AdditionalDownloadButton from "@/components/additional-download-button";
import SimpleTable, { SimpleColumnDef } from "@/components/table/simple-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useApiFetch from "@/hooks/use-api-fetch";
import capitalizeHyphenatedWords from "@/lib/capitalizeHyphenatedWords";
import { __ } from "@/lib/i18n";
import Paging from "@/pages/_components/paging";
import { useParams } from "@/router";
import {
	DemoContentCollectionResponse,
	DemoContentType,
	PostItemType,
} from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import moment from "moment";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
type DemoContentTableProps = {
	item: PostItemType;
	data: DemoContentType[];
};
type Props = {
	item: PostItemType;
};
const pageSchema = z.number().gte(1).default(1);
export function DemoContentTable({ item, data }: DemoContentTableProps) {
	const columns = useMemo<SimpleColumnDef<DemoContentType>[]>(
		() => [
			{
				id: "name",
				label: __("Name"),
				className: "w-full",
				render({ row }) {
					return decodeEntities(row.title);
				},
			},
			{
				id: "type",
				label: __("Type"),
				className: "whitespace-nowrap whitespace-nowrap",
				render({ row }) {
					return capitalizeHyphenatedWords(row?.type);
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
						<AdditionalDownloadButton
							item={item}
							media={row}
							size="icon"
							variant="outline"
						/>
					);
				},
			},
		],
		[item],
	);
	return <SimpleTable columns={columns} data={data} />;
}
export default function ItemDemoContents({ item }: Props) {
	const params = useParams("/item/:type/detail/:id/:tab?");
	const [searchParams, setSearchParams] = useSearchParams();
	const page = pageSchema.parse(Number(searchParams?.get("page") ?? 1));
	const { data, isLoading, isFetching } =
		useApiFetch<DemoContentCollectionResponse>("item/demo-content", {
			item_id: params.id,
			page,
		});
	return (
		<div className="flex flex-col gap-5 sm:gap-7">
			<Card>
				<CardHeader className="border-b p-5 sm:p-7">
					{__("Demo Contents")}
				</CardHeader>
				<CardContent className="p-5 text-sm sm:p-7">
					{data?.data ? (
						<div className="flex flex-col gap-4">
							<DemoContentTable item={item} data={data?.data} />
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
