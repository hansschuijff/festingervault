import { AppPageShell } from "@/components/body/page-shell";
import useApiFetch from "@/hooks/use-api-fetch";
import { __ } from "@/lib/i18n";
import PostGridItem from "@/pages/item/[type]/-[page]/_components/PostGridItem";
import { useParams } from "@/router";
import { CollectionResponse } from "@/types/api";
import {
	BookmarkCollectionDetailSchema,
	BookmarkCollectionItemType,
	BookmarkCollectionType,
} from "@/types/bookmark";

export default function CollectionDetail({}) {
	const { cid } = useParams("/collection/:cid");
	const { data, isLoading } = useApiFetch<
		BookmarkCollectionType,
		BookmarkCollectionDetailSchema
	>("collection/detail", {
		id: Number(cid),
	});
	const { data: items } = useApiFetch<
		CollectionResponse<BookmarkCollectionItemType>,
		BookmarkCollectionDetailSchema
	>("collection/items", {
		id: Number(cid),
	});

	return (
		<AppPageShell title={data && data.title} isLoading={isLoading}>
			{items && items.data.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-3">
					{items.data.map(item => (
						<PostGridItem item={item.post} key={item.id} />
					))}
				</div>
			) : (
				<div className="text-sm italic text-muted-foreground">
					{__("No Items Found")}
				</div>
			)}
		</AppPageShell>
	);
}
