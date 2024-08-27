import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "../sidebar/Sidebar";
import { __ } from "@/lib/i18n";

type Props = {
  sidebarNavIncludeIds?: string[];
  sidebarNavRemoveIds?: string[];
};

export function MobileSidenav({
  sidebarNavIncludeIds,
  sidebarNavRemoveIds,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="iconSmall">
          <MenuIcon className="h-4 w-4" />
          <p className="sr-only">{__("Open menu")}</p>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 pb-20 pt-10">
        <Sidebar
          showLogo={false}
          sidebarNavIncludeIds={sidebarNavIncludeIds}
          sidebarNavRemoveIds={sidebarNavRemoveIds}
        />
      </SheetContent>
    </Sheet>
  );
}
