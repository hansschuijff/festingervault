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
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
export default function BulkAction() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBag size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bulk Select</SheetTitle>
          <SheetDescription>Bulk install, download or update</SheetDescription>
        </SheetHeader>

        <div className="my-5 text-xs text-muted-foreground">
          Bulk Action list would appear here
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Install</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Download</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
