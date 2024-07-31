import { Icons } from "@/components/ui/icons";
import { MobileSidenav } from "./mobile-sidenav";

type Props = {
    sidebarNavIncludeIds?: string[];
    sidebarNavRemoveIds?: string[];
};

export function AppHeader({
    sidebarNavIncludeIds,
    sidebarNavRemoveIds,
}: Props) {
    return (
        <header className="flex h-14 items-center gap-4">
            <MobileSidenav
                sidebarNavIncludeIds={sidebarNavIncludeIds}
                sidebarNavRemoveIds={sidebarNavRemoveIds}
            />
            <Icons.logo hideTextOnMobile={false} />
        </header>
    );
}
