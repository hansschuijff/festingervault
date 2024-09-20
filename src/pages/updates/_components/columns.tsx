import InstallButton from "@/components/install-button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/router";
import { TThemePluginItem } from "@/types/item";
import version_compare from "@/lib/version_compare";
import { type ColumnDef } from "@tanstack/react-table";
import { decodeEntities } from "@wordpress/html-entities";
import AutoUpdateSwitcher from "./autoupdate-switch";
import { __ } from "@/lib/i18n";
import { sprintf } from "@wordpress/i18n";
import { TypeToItemType, TypeToSlug } from "@/lib/type-to-slug";

export function getColumns(): ColumnDef<TThemePluginItem>[] {
  return columns;
}
const type_labels = {
  "wordpress-themes": "Theme",
  "wordpress-plugins": "Plugin",
};
export const columns: ColumnDef<TThemePluginItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label={__("Select all")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label={__("Select row")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <span className="pl-2">{__("Download")}</span>,
    id: "title",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-4">
          <div className="aspect-square w-12">
            <img
              src={row.original.thumbnail??row.original.image}
              className="aspect-square h-12 w-12 rounded-sm object-cover"
            />
          </div>
          <div className=" flex-1 space-y-1">
            <div className="font-semibold">
              <div className="line-clamp-1">
                <Link
                  to={`/item/:slug/detail/:id/:tab?`}
                  params={{ id: row.original.id, slug: TypeToSlug(row.original.type) }}
                >
                  {decodeEntities(row.original.title)}
                </Link>
              </div>
            </div>
            <div className="text-muted-foreground">
              {sprintf(__("Path: %s"),row.original.install_dir)}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: __("Type"),
    cell: ({ row }) => type_labels[row.original.type],
    filterFn: (row, id, value) => {
      return !!value.includes(row.original.type);
    },
  },

  {
    accessorKey: "installed_version",
    header: __("Installed Version"),
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="capitalize">
          {row.original.installed_version}
        </Badge>
      );
    },
  },
  {
    accessorKey: "version",
    header: __("Available"),
    cell: ({ row }) => {
      const isNew = version_compare(
        row.original.version,
        row.original.installed_version??"",
        "gt",
      );
      return (
        <Badge variant={isNew ? "success" : "secondary"} className="capitalize">
          {row.original.version}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "autoupdate",
    header: __("Auto Update"),
    cell: ({ row }) => {
      return <AutoUpdateSwitcher row={row} />;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const isNewA = version_compare(
        rowA.original.version,
        rowA.original.installed_version??"",
        "gt",
      );
      return isNewA ? -1 : 1;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <InstallButton item={row.original} size="icon" />;
    },
    enableHiding: false,
    enableSorting: false,
  },
];
