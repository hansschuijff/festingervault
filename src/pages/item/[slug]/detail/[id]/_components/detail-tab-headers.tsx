import InstallButton from "@/components/install-button";
import { Button } from "@/components/ui/button";
import { __ } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@/router";
import { TPostItem } from "@/types/item";
import { Slot } from "@radix-ui/react-slot";
import { EllipsisVertical, ExternalLink, Heart } from "lucide-react";
import { DetailTabType } from "../-[tab]";
import BookmarkButton from "@/components/bookmark-button";

type Props = {
	item: TPostItem;
	tabs: DetailTabType;
};
export default function DetailTabHeaders({ item, tabs }: Props) {
	const params = useParams("/item/:slug/detail/:id/:tab?");
	const active = tabs.find(tab => tab.id === params.tab)?.id ?? "description";
	return (
		<div className="flex flex-row items-center justify-between border-b-2 border-b-card">
			<div className="flex flex-row">
				{tabs.map(({ id, label, external }) => (
					<Slot
						key={id}
						className={cn(
							"rounded-none border-b-2 border-transparent px-6 py-4 text-sm transition-colors hover:border-b-blue-600",
							id === active && "border-b-blue-800",
						)}
					>
						{external ? (
							<a href={external} target="_blank" rel="noreferrer">
								{__("Support")}
							</a>
						) : (
							<Link
								to="/item/:slug/detail/:id/:tab?"
								params={{
									...params,
									tab: id,
								}}
							>
								{label}
							</Link>
						)}
					</Slot>
				))}
			</div>
			<div className="flex flex-row gap-4">
				<InstallButton item={item} />
				{item.preview && (
					<Button
						asChild
						className="flex gap-2"
						variant="outline"
						size="default"
					>
						<a href={item.preview} target="_blank" rel="noreferrer">
							<span>{__("Live Preview")}</span>
							<ExternalLink size={16} />
						</a>
					</Button>
				)}
				<BookmarkButton item={item}>
					<Button size="icon" variant="outline">
						<Heart size={16} />
					</Button>
				</BookmarkButton>
				<Button size="icon" variant="outline">
					<EllipsisVertical size={16} />
				</Button>
			</div>
		</div>
	);
}
