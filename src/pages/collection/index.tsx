import { AppPageShell } from "@/components/body/page-shell";
import useApiFetch from "@/hooks/use-api-fetch";
import { __ } from "@/lib/i18n";
import { CollectionResponse } from "@/types/api";
import { BookmarkCollectionType } from "@/types/bookmark";
import Collection from "./_components/collection";
import { Button } from "@/components/ui/button";
import AddCollectionButton from "@/components/add-collection-dialog";
import { Plus } from "lucide-react";
import { sprintf } from "@wordpress/i18n";

export default function Component() {
	const { data, isLoading, isFetching } =
		useApiFetch<CollectionResponse<BookmarkCollectionType>>("collection/list");
	return (
		<AppPageShell
			title={__("Collections")}
			isLoading={isLoading}
			isFetching={isFetching}
			breadcrump={[
				{
					label: __("Collection"),
				},
			]}
		>
			<div>
				<AddCollectionButton>
					<Button className="flex gap-2">
						<Plus size={16} /> <span>{__("Add New Collection")}</span>
					</Button>
				</AddCollectionButton>
			</div>
			{data && data.data.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-3">
					{data.data.map(collection => (
						<Collection collection={collection} key={collection.id} />
					))}
				</div>
			) : (
				<div className="text-sm italic text-muted-foreground">
					{__("No Collections Found Found")}
				</div>
			)}
		</AppPageShell>
	);
}
