import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import useBookmark from "@/hooks/use-bookmark";
import { __ } from "@/lib/i18n";
import { BookmarkCollectionType } from "@/types/bookmark";
import { BookmarkPostCollectionSchema } from "@/zod/bookmark";
import { useCallback, useState } from "react";
import { z, ZodFormattedError } from "zod";
import Errors from "./Error";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
type Props = {
	children?: React.ReactNode;
	collection?:BookmarkCollectionType,
	update?:boolean;
};
export default function AddCollectionButton({ children, collection, update=false }: Props) {
	const { addNewCollection } = useBookmark();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [id, setId] = useState<number>(collection?collection.id:0);
	const [title, setTitle] = useState<string>(collection?collection.title:"");
	const [summary, setSummary] = useState<string>(collection?collection.summary:"");
	const [isPublic, setIsPublic] = useState<boolean>(collection?collection.public:true);
	const [errors,setError]=useState<ZodFormattedError<z.infer<typeof BookmarkPostCollectionSchema>,string>>(null);
	const addList = useCallback(() => {
		const postData = BookmarkPostCollectionSchema.safeParse({
			id,
			title,
			summary,
			public: isPublic,
		});
		if (postData.success) {
			addNewCollection(postData.data, update).then(() => setDialogOpen(false));
		}
		if(postData.error){
			setError(postData.error.format())
		}
	}, [title, summary, isPublic, addNewCollection, setError]);
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild className="cursor-pointer">
				{children ? (
					children
				) : (
					<span className="w-full">{update?__("Update Collection"):__("Add New Collection")}</span>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{update?__("Update Collection"):__("Create New Collection")}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2 flex-col">
						<Input
							placeholder={__("List Title")}
							value={title}
							onChange={e => setTitle(prev => e.target.value)}
						/>
							<Errors errors={errors?.title?._errors} />
							</div>
					<div className="flex flex-col gap-2">
						<Textarea
							placeholder={__("List Description")}
							value={summary}
							className="h-16 max-h-16 resize-none"
							onChange={e => setSummary(prev => e.target.value)}
						/>
						<Errors errors={errors?.summary?._errors} />
					</div>
					<div className="flex items-center gap-2">
						<Switch
							id="is-public"
							checked={isPublic}
							onCheckedChange={setIsPublic}
						/>
						<Label htmlFor="is-public">{__("Public")}</Label>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={addList}>{update?__("Update Collection"):__("Add New Collection")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
