import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import useBookmark from "@/hooks/use-bookmark";
import { __, _n } from "@/lib/i18n";
import { Link } from "@/router";
import { BookmarkCollectionType } from "@/types/bookmark";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { decodeEntities } from "@wordpress/html-entities";
import { sprintf } from "@wordpress/i18n";
import { Delete, Globe, Lock, LockIcon, Trash } from "lucide-react";

type Props = {
	collection: BookmarkCollectionType;
};

export default function Collection({ collection }: Props) {
	const { removeCollection } = useBookmark();
	return (
		<div>
			<Card>
				<CardHeader className="border-b">
					<div className="flex flex-row items-center justify-between gap-2">
						<Link to="/collection/:cid" params={{ cid: String(collection.id) }} className="flex flex-row gap-2 items-start ">
							<span className="text-muted-foreground mt-0.5" title={collection.public?__("Public"):__("Private")}>{collection.public?<Globe size={16} />:<LockIcon size={16} />}</span>
							<span className="text-lg leading-none">{decodeEntities(collection.title)}</span>
						</Link>
						{collection.count > 0 && (
							<Badge variant="secondary">{collection.count}</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					{collection.summary && collection.summary.length > 0 ? (
						<p>{decodeEntities(collection.summary)}</p>
					) : (
						<div className="text-xs italic text-muted-foreground">
							{__("No Description")}
						</div>
					)}
				</CardContent>
				<CardFooter className="border-t">
					<div>
						<Button
							variant="secondary"
							onClick={() => {
								if (
									confirm(__("Are you sure you want to remove collection?"))
								) {
									removeCollection(collection);
								}
							}}
							size="sm"
						>
							Delete
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
