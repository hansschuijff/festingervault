import { Icons } from "@/components/ui/icons";
import { MobileSidenav } from "./mobile-sidenav";

export function AppHeader() {
	return (
		<header className="flex h-14 items-center gap-4">
			<MobileSidenav />
			<Icons.logo hideTextOnMobile={false} />
		</header>
	);
}
