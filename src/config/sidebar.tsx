import { Badge } from "@/components/ui/badge";
import useInstalled from "@/hooks/use-is-installed";
import useApiFetch from "@/hooks/useApiFetch";
import { PostItemType } from "@/pages/item/_components/PostGridItem";
import { CollectionResponse } from "@/types/api";
import version_compare from "@/utils/version_compare";
import {
  ArrowLeft,
  Drum,
  Grid2x2,
  Heart,
  HomeIcon,
  Library,
  LifeBuoy,
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
  notice?: React.ComponentType | (() => React.ReactNode);
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

const navigation: SidebarNavItems[] = [
  {
    id: "back-dashboard",
    label: "WP Dashboard",
    showLabel: false,
    items: [
      {
        label: "WP Dashboard",
        icon: ArrowLeft,
        href: "index.php",
        as: "a",
      },
    ],
  },
  {
    id: navIds.discover,
    label: "Discover",
    showLabel: true,
    items: [
      {
        label: "Home",
        icon: HomeIcon,
        href: "/",
      },
      {
        label: "Browse",
        icon: Grid2x2,
        href: "/browse",
      },
      {
        label: "Most Polular",
        icon: Radio,
        href: "/popular",
      },
    ],
  },
  {
    id: navIds.library,
    label: "Library",
    showLabel: true,
    items: [
      {
        label: "Themes",
        icon: Palette,
        href: "/item/wordpress-themes",
      },
      {
        label: "Plugins",
        icon: ToyBrick,
        href: "/item/wordpress-plugins",
      },
      {
        label: "Elementor Kits",
        icon: Drum,
        href: "/item/elementor-template-kits",
      },
      {
        label: "Requests",
        icon: Library,
        href: "/requests",
      },
      {
        label: "Collections",
        icon: Heart,
        href: "/collections",
      },
      {
        label: "Updates",
        icon: Repeat,
        href: "/updates",
        notice: () => {
          const { updateable } = useInstalled();
          if (updateable && updateable.length > 0) {
            return (
              <Badge variant="success" size="sm">
                {updateable.length}
              </Badge>
            );
          }
        },
      },
    ],
  },
  {
    id: navIds.settings,
    label: "Settings",
    showLabel: true,
    items: [
      {
        label: "License Activation",
        icon: ShieldCheck,
        href: "/activation",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
      },
      {
        label: "Need Help?",
        icon: LifeBuoy,
        href: "/need-help",
      },
    ],
  },
];

type FilterNavItemsProps = {
  removeIds?: string[];
  includedIds?: string[];
};

/**
 * @purpose Filters the navigation items for the sidebar.
 * The filterNavItems function filters the navigation items for the sidebar.
 * @param removeIds An array of string identifiers to remove from the navigation items.
 * @param includeIds An array of string identifiers to include in the navigation items.
 *
 * @returns The filtered navigation items for the sidebar.
 * */

export function filteredNavItems({
  removeIds = [],
  includedIds = [],
}: FilterNavItemsProps) {
  let includedItems = sidebarConfig.navigation;

  if (includedIds.length) {
    includedItems = includedItems.filter(item => includedIds.includes(item.id));
  }

  if (removeIds.length) {
    includedItems = includedItems.filter(item => !removeIds.includes(item.id));
  }

  return includedItems;
}

/**
 * The sidebarConfig is an object that contains the configuration for the dashboard
 * @export all the configuration for the sidebar in sidebarConfig
 */

export const sidebarConfig = {
  navIds,
  navigation,
  filteredNavItems,
} as const;
