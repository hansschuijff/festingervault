import { AppPageShell } from "@/components/body/page-shell";
import Paging from "@/components/paging";
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
import { decodeEntities } from "@wordpress/html-entities";

export default function CollectionDetail({}) {
	const { cid, page = 1 } = useParams("/collection/:cid/:page?");
	const { data } = useApiFetch<
		BookmarkCollectionType,
		BookmarkCollectionDetailSchema
	>("collection/detail", {
		id: Number(cid),
	});
	const {
		data: items,
		isLoading,
		isFetching,
	} = useApiFetch<
		CollectionResponse<BookmarkCollectionItemType>,
		BookmarkCollectionDetailSchema
	>("collection/items", {
		id: Number(cid),
		page: Number(page),
	});

	return (
		<AppPageShell
			title={data && decodeEntities(data.title)}
			description={data && decodeEntities(data.summary)}
			isLoading={isLoading}
			isFetching={isFetching}
		>
			{items && items.data.length > 0 ? (
				<>
					<div className="grid gap-5 sm:grid-cols-3">
						{items.data.map(item => (
							<PostGridItem item={item.post} key={item.id} />
						))}
					</div>
					{items.meta && (
						<Paging
							currentPage={Number(page)}
							totalPages={items.meta?.last_page}
							urlGenerator={(_page: number) => `/collection/${cid}/${_page}`}
						/>
					)}
				</>
			) : (
				<div className="text-sm italic text-muted-foreground">
					{__("No Items Found")}
				</div>
			)}
		</AppPageShell>
	);
}
