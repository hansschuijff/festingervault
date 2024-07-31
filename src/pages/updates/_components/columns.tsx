import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import useInstall from "@/hooks/useInstall";
import { Link } from "@/router";
import { ThemePluginItemType } from "@/types/item";
import version_compare from "@/utils/version_compare";
import { type ColumnDef } from "@tanstack/react-table";
import { decodeEntities } from "@wordpress/html-entities";
import AutoUpdateSwitcher from "./autoupdate-switch";

export function getColumns(): ColumnDef<ThemePluginItemType>[] {
  return columns;
}
const type_labels = {
  "wordpress-themes": "Theme",
  "wordpress-plugins": "Plugin",
};
export const columns: ColumnDef<ThemePluginItemType>[] = [
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
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <span className="pl-2">Download</span>,
    id: "title",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-4">
          <div>
            <img
              src={row.original.image}
              className="h-12  w-12 rounded-sm object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="font-semibold">
              <div className="line-clamp-1">
                <Link
                  to={`/item/:type/detail/:id`}
                  params={{ id: row.original.id, type: row.original.type }}
                >
                  {decodeEntities(row.original.title)}
                </Link>
              </div>
            </div>
            <div className="text-muted-foreground">
              {type_labels[row.original.type]}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => type_labels[row.original.type],
    filterFn: (row, id, value) => {
      return !!value.includes(row.original.type);
    },
  },

  {
    accessorKey: "version",
    header: "Installed Version",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="capitalize">
          {row.original.installed_version}
        </Badge>
      );
    },
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => {

      return <Badge
        variant={
          version_compare(
            row.original.version,
            row.original.installed_version,
            "le",
          )
            ? "secondary"
            : "success"
        }
        className="capitalize"
      >
        {row.original.version}
      </Badge>
		},
  },
  {
    accessorKey: "autoupdate",
    header: "Auto Update",
    cell: ({ row }) => {
      return <AutoUpdateSwitcher row={row} />;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const { InstallButton } = useInstall(row.original);
      return <InstallButton />;
    },
    enableHiding: false,
  },
];
