import { Button, ButtonProps } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useApiFetch from "@/hooks/use-api-fetch";
import useBookmark from "@/hooks/use-bookmark";
import { __ } from "@/lib/i18n";
import { CollectionResponse } from "@/types/api";
import { BookmarkCollectionType } from "@/types/bookmark";
import { TPostItem } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { Check, Star } from "lucide-react";
import { useCallback } from "react";
import AddCollectionButton from "./add-collection-dialog";
type Props = {
	item: TPostItem;
} & ButtonProps;
export default function BookmarkButton({ item, size, variant }: Props) {
	const { addItemToCollection } = useBookmark();
	const {
		data: collections,
		isLoading,
		isFetched,
	} = useApiFetch<CollectionResponse<BookmarkCollectionType>>(
		"collection/list",
	);
	const addItem = useCallback(
		(collection: BookmarkCollectionType) => {
			addItemToCollection(item, collection);
		},
		[item, addItemToCollection],
	);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={item.collections?.length > 0 ? "secondary" : "outline"}
					size={size}
					className="flex items-center gap-2"
				>
					<Star width={16} />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandList>
						<CommandGroup heading={__("List")}>
							{collections && collections.data.length > 0
								? collections.data.map(collection => (
										<CommandItem
											key={collection.id}
											className="flex cursor-pointer flex-row justify-between gap-2"
											onSelect={e => {
												addItem(collection);
											}}
										>
											<span>{decodeEntities(collection.title)}</span>
											{item.collections?.includes(collection.id) ? (
												<Check size={16} />
											) : null}
										</CommandItem>
									))
								: null}
						</CommandGroup>
						<CommandSeparator />
						<CommandItem>
							<AddCollectionButton />
						</CommandItem>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
