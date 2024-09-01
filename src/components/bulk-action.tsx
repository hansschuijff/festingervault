import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import useBulk from "@/hooks/use-bulk";
import { decodeEntities } from "@wordpress/html-entities";
import { __, _x } from "@/lib/i18n";
import { sprintf } from "@wordpress/i18n";
import { Alert } from "./ui/alert";
export default function BulkAction() {
	const { items, removeItem, install } = useBulk();
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size={items && items.length > 0 ? "default" : "icon"}
					className="gap-2"
				>
					<ShoppingBag size={16} />
					{items.length > 0 && <span>{items.length}</span>}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{__("Bulk Cart")}</SheetTitle>
					<SheetDescription>{__("Your items")}</SheetDescription>
				</SheetHeader>
				<div className="my-4 flex flex-col gap-4">
					{items.length>0?items.map(item => (
						<div key={item.id} className="flex flex-row gap-2">
							<div className="h-14 w-14">
								<img
									src={item.image}
									className=" aspect-square h-14 w-14 object-contain"
								/>
							</div>
							<div className="flex flex-1 flex-col gap-1 text-sm">
								<h3>{decodeEntities(item.title)}</h3>
								<div className="text-xs text-muted-foreground">
									{sprintf(__("Version: %s"), item.version)}
								</div>
							</div>
							<div>
								<Button
									variant="destructive"
									size="iconSmall"
									onClick={() => {
										removeItem(item.id);
									}}
								>
									<X size={16} />
								</Button>
							</div>
						</div>
					)):<Alert className="text-muted-foreground">{__("No items found in bulk cart")}</Alert>}
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button disabled={items.length===0} onClick={install}>{__("Install")}</Button>
					</SheetClose>
					<SheetClose asChild>
						<Button disabled={items.length===0}>Download</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
