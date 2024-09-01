import { AppPageShell } from "@/components/body/page-shell";
import FilterBar from "@/components/filter/collection-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { item_types } from "@/config/item";
import useCollection from "@/hooks/use-collection";
import useApiFetch from "@/hooks/use-api-fetch";
import { __ } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import Paging from "@/pages/_components/paging";
import PostGridItem, {
	PostGridItemSkeleton,
} from "@/pages/item/[type]/-[page]/_components/PostGridItem";
import { useParams } from "@/router";
import {
	ItemTypeEnum,
	PostItemCollectionResponse,
	PostItemType,
} from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { sprintf } from "@wordpress/i18n";
import { SearchX } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

const sort_items: ReturnType<typeof useCollection>["sort"] = [
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
		data: terms,
		isLoading: categoriesIsLoading,
		isFetching: isFetchingCategories,
	} = useApiFetch<PostItemType["terms"]>("item/terms", {
		type,
	});
	const filters = useMemo<ReturnType<typeof useCollection>["options"]>(
		() =>
			terms
				? [
						{
							id: "category",
							label: "Category",
							enabled: params.type != "elementor-template-kits",
							onBarView: true,
							isMulti: true,
							options: terms
								?.filter(i => i.taxonomy === "category")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "post_tag",
							label: "Tag",
							isMulti: true,
							options: terms
								?.filter(i => i.taxonomy === "post_tag")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "widget-ready",
							label: "Widget Ready",
							enabled: params.type != "elementor-template-kits",
							isMulti: false,
							options: terms
								?.filter(i => i.taxonomy === "widget-ready")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "compatible-with",
							label: "Compatible With",
							isMulti: false,
							options: terms
								?.filter(i => i.taxonomy === "compatible-with")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "files-included",
							label: "Files Included",
							enabled: params.type != "elementor-template-kits",
							isMulti: false,
							options: terms
								?.filter(i => i.taxonomy === "files-included")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "software-version",
							label: "Software Versions",
							isMulti: false,
							options: terms
								?.filter(i => i.taxonomy === "software-version")
								.sort((a, b) => a.slug.localeCompare(b.slug))
								.map(i => ({ label: decodeEntities(i.name), value: i.slug })),
						},
						{
							id: "level",
							label: __("Access"),
							isMulti: true,
							onBarView: true,
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
							label: __("Additional Content"),
							isMulti: false,
							enabled: params.type != "elementor-template-kits",
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
					]
				: [],
		[terms, categoriesIsLoading, params],
	);
	const collection = useCollection({
		options: filters,
		path: path,
		sort: sort_items,
	});
	const { data, isLoading, isFetching } =
		useApiFetch<PostItemCollectionResponse>("item/list", {
			type,
			page,
			filter: collection.filter,
			sort: collection.sorting,
			keyword: collection.search?.keyword,
			per_page: Number(collection.pagination?.per_page),
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
					<FilterBar collection={collection} />

					<div
						className={cn(["grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-7"])}
					>
						{data.data.length > 0 ? (
							data.data.map(item => <PostGridItem key={item.id} item={item} />)
						) : (
							<NoSearchResultFound />
						)}
					</div>
					{data.meta && (
						<Paging
							currentPage={page}
							totalPages={data.meta?.last_page}
							urlGenerator={(_page: number) =>
								`/item/${params.type}/${_page}?${collection?.searchParams}`
							}
						/>
					)}
				</>
			)}
		</AppPageShell>
	);
}
