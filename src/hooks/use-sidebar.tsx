import { Badge } from "@/components/ui/badge";
import useInstalled from "@/hooks/use-is-installed";
import { __ } from "@/lib/i18n";
import {
	ArrowLeft,
	Drum,
	Grid2x2,
	Heart,
	HomeIcon,
	Library,
	LifeBuoy,
	List,
	Palette,
	Radio,
	Repeat,
	Settings,
	ShieldCheck,
	ToyBrick,
} from "lucide-react";
import React from "react";

/**
 * This file contains the configuration for the navigation items in the sidebar
 * to add a new navigation item, you can add a new object to the navigation array
 * 1 id: a unique id for the navigation, add it to the navIds object
 * 2 label: the label for the navigation (it's a category label)
 * 3 showLabel: if true, the label will be shown in the sidebar (it's a category label)
 * 4 items: an array of navigation items
 *   - label: the label for the navigation item
 *   - icon: the icon for the navigation item
 *   - href: the href for the navigation item
 *   - subMenu: an array of subMenu items
 *     > label: the label for the subMenu item
 *     > href: the href for the subMenu item
 *     > icon: the icon for the subMenu item
 *
 * @use specific navigation items in the sidebar, you can use the filterNavItems function
 */

type IconProps = React.HTMLAttributes<SVGElement>;

type NavItemBase = {
	label: string;
	icon: React.ComponentType<IconProps>;
	disabled?: boolean;
	useNotice?: React.ComponentType | (() => React.ReactNode);
	as?: "link" | "a";
	external?: boolean;
};

type NavItemWithHref = NavItemBase & {
	href: string;
	subMenu?: never;
};

type NavItemWithSubMenu = NavItemBase & {
	href?: never;
	subMenu: {
		label: string;
		href: string;
		icon: React.ComponentType<IconProps>;
		external?: boolean;
		disabled?: boolean;
	}[];
};

export type NavItem = NavItemWithHref | NavItemWithSubMenu;

export type SidebarNavItems = {
	id: string;
	label: string;
	showLabel?: boolean;
	items: NavItem[];
};

const navIds = {
	discover: "discover",
	library: "library",
	settings: "settings",
};
export default function useSidebar() {
	const { updateable } = useInstalled();
	const items: SidebarNavItems[] = [
		{
			id: "back-dashboard",
			label: __("WP Dashboard"),
			showLabel: false,
			items: [
				{
					label: __("WP Dashboard"),
					icon: ArrowLeft,
					href: "index.php",
					as: "a",
				},
			],
		},
		{
			id: navIds.discover,
			label: __("Discover"),
			showLabel: true,
			items: [
				{
					label: __("Home"),
					icon: HomeIcon,
					href: "/",
				},
				{
					label: __("Browse"),
					icon: Grid2x2,
					href: "/browse",
				},
				{
					label: __("Most Polular"),
					icon: Radio,
					href: "/popular",
				},
			],
		},
		{
			id: navIds.library,
			label: __("Library"),
			showLabel: true,
			items: [
				{
					label: __("Themes"),
					icon: Palette,
					href: "/item/themes",
				},
				{
					label: __("Plugins"),
					icon: ToyBrick,
					href: "/item/plugins",
				},
				{
					label: __("Elementor Kits"),
					icon: Drum,
					href: "/item/template-kits",
				},
				{
					label: __("Requests"),
					icon: Library,
					href: "/requests",
				},
				{
					label: __("Collections"),
					icon: Heart,
					href: "/collection",
				},
				{
					label: __("Updates"),
					icon: Repeat,
					href: "/updates",
					useNotice: () => {
						if (updateable && updateable.length > 0) {
							return (
								<Badge variant="success" size="sm">
									{updateable.length}
								</Badge>
							);
						}
					},
				},
				{
					label: __("History"),
					icon: List,
					href: "/history",
				},
			],
		},
		{
			id: navIds.settings,
			label: __("Settings"),
			showLabel: true,
			items: [
				{
					label: __("License Activation"),
					icon: ShieldCheck,
					href: "/activation",
				},
				{
					label: __("Settings"),
					icon: Settings,
					href: "/settings",
				},
				{
					label: __("Need Help?"),
					icon: LifeBuoy,
					href: "/need-help",
				},
			],
		},
	];
	return { items };
}
