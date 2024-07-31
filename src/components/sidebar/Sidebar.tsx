import { Icons } from "@/components/ui/icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { sprintf } from "@wordpress/i18n";
import useTheme from "@/hooks/useTheme";
type Props = {
  sidebarNavIncludeIds?: string[];
  sidebarNavRemoveIds?: string[];
  showLogo?: boolean;
};

export function Sidebar({
  sidebarNavIncludeIds,
  sidebarNavRemoveIds,
  showLogo = true,
}: Props) {
  const { effectiveTheme } = useTheme();
  return (
    <aside className="h-full w-full">
      {showLogo && (
        <div className="items-center justify-between py-4">
          <Link to="/" className="z-10">
            <img
              src={sprintf(window.vault.logo, effectiveTheme)}
              className="w-auto"
            />
          </Link>
        </div>
      )}
      <ScrollArea style={{ height: "calc(100vh - 10.5rem)" }}>
        <div className="h-full w-full py-2 pb-10">
          <SidebarNav
            sidebarNavIncludeIds={sidebarNavIncludeIds}
            sidebarNavRemoveIds={sidebarNavRemoveIds}
          />
          <ScrollBar orientation="vertical" />
        </div>
      </ScrollArea>
    </aside>
  );
}

export function SidebarLoading({
  showOrgSwitcher = true,
}: {
  showOrgSwitcher?: boolean;
}) {
  return (
    <aside className={cn("h-full w-full")}>
      <div className={cn(" flex h-16 items-center justify-between")}>
        <Link to="/" className={cn("z-10 transition-transform hover:scale-90")}>
          <Icons.logo
            className="text-xl"
            iconProps={{ className: "w-6 h-6 fill-primary" }}
          />
        </Link>
      </div>

      <div className="py-2">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {showOrgSwitcher && (
        <div className="py-2">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      )}

      <ScrollArea style={{ height: "calc(100vh - 10.5rem)" }}>
        <div className="h-full w-full space-y-2 py-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
          <ScrollBar orientation="vertical" />
        </div>
      </ScrollArea>
    </aside>
  );
}
