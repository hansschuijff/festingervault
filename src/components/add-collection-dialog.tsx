import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { __ } from "@/lib/i18n";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { BookmarkPostCollectionSchema } from "@/types/bookmark";
import useBookmark from "@/hooks/use-bookmark";
type Props = {
	children?: React.ReactNode;
};
export default function AddCollectionButton({ children }: Props) {
	const { addNewCollection } = useBookmark();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
	const [summary, setSummary] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(true);
	const addList = useCallback(() => {
		const postData = BookmarkPostCollectionSchema.safeParse({
			title: title,
			summary: summary,
			public: isPublic,
		});
		if (postData.success) {
			addNewCollection(postData.data).then(() => setDialogOpen(false));
		}
	}, [title, summary, isPublic, addNewCollection]);
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild className="cursor-pointer">
				{children ? (
					children
				) : (
					<span className="w-full">{__("Add New Collection")}</span>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{__("Create New Collection")}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2">
						<Input
							placeholder={__("List Title")}
							value={title}
							onChange={e => setTitle(prev => e.target.value)}
						/>
					</div>
					<div className="flex gap-2">
						<Textarea
							placeholder={__("List Description")}
							value={summary}
							className="h-16 max-h-16 resize-none"
							onChange={e => setSummary(prev => e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Switch
							id="is-public"
							checked={isPublic}
							onCheckedChange={setIsPublic}
						/>
						<Label htmlFor="is-public">Public</Label>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={addList}>{__("Add New Collection")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
