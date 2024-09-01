import { DataTable } from "@/components/data-table";
import { BulkActionType } from "@/components/data-table-bulk-action";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import useInstalled from "@/hooks/use-is-installed";
import useTaskQueue from "@/hooks/use-task-queue";
import useApiMutation from "@/hooks/use-api-mutation";
import { PluginInstallResponse, PluginInstallSchema } from "@/hooks/use-install";
import { __ } from "@/lib/i18n";
import {
	DataTableFilterableColumn,
	DataTableSearchableColumn,
} from "@/types/data-table";
import { ThemePluginItemType } from "@/types/item";
import { AutoupdatePostSchema } from "@/types/update";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "sonner";
import { getColumns } from "./columns";

const filterableColumns: DataTableFilterableColumn<ThemePluginItemType>[] = [
  {
    id: "type",
    title: __("Type"),
    options: [
      {
        label: __("Themes"),
        value: "wordpress-themes",
      },
      {
        label: __("Plugins"),
        value: "wordpress-plugins",
      },
    ],
  },
];
const searchableColumns: DataTableSearchableColumn<ThemePluginItemType>[] = [
  { id: "title", placeholder: __("Search downloads...") },
];
type UpdateTableProps = {
  data: ThemePluginItemType[];
};
export function UpdatesTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[150px] lg:w-[250px]" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function UpdatesTable({ data }: UpdateTableProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: installPlugin } = useApiMutation<
    PluginInstallResponse,
    PluginInstallSchema
  >("item/install");
  const { mutateAsync: autoupdatePromise } = useApiMutation<
    any,
    AutoupdatePostSchema
  >("update/update-autoupdate");
  const { clearCache } = useInstalled();
  const { addTask } = useTaskQueue();
  const bulkActions: BulkActionType<ThemePluginItemType>[] = [
    {
      id: "update",
      label: __("Update"),
      action: async items => {
        items.forEach(({ original: item }) => {
          addTask(() => {
            return new Promise((resolve, reject) => {
              toast.promise(
                installPlugin({
                  item_id: item.id,
                  method: "update",
                }),
                {
                  description: item.title,
                  loading: __("Updating"),
                  success(data) {
                    resolve(data);
                    return __("Success");
                  },
                  error(err) {
                    reject(err);
                    return err.message ?? __("Error");
                  },
                  finally() {
                    clearCache();
                    table.resetRowSelection();
                  },
                },
              );
            });
          });
        });
      },
    },
    {
      id: "reinstall",
      label: __("Re-Install"),
      action: items => {
        items.forEach(({ original: item }) => {
          addTask(() => {
            return new Promise((resolve, reject) => {
              toast.promise(
                installPlugin({
                  item_id: item.id,
                  method: "install",
                }),
                {
                  description: item.title,
                  loading: __("Re-installing"),
                  success() {
                    resolve(item);
                    return __("Re-Install Success");
                  },
                  error(err) {
                    reject(err);
                    return (
                      err.message ?? __("Error Installing")
                    );
                  },
                  finally() {
                    clearCache();
                    table.resetRowSelection();
                  },
                },
              );
            });
          });
        });
      },
    },
    {
      id: "autoupdate",
      label: __("Enable Auto-Update"),
      action: items => {
        items.forEach(({ original: item }) => {
          addTask(() => {
            return new Promise((resolve, reject) => {
              toast.promise(
                autoupdatePromise({
                  type: item.type,
                  slug: item.slug,
                  enabled: true,
                }),
                {
                  description: item.title,
                  loading: __("Enabling Auto Update"),
                  success() {
                    resolve(item);
                    return __("Auto Update Enabled");
                  },
                  error() {
                    reject(item);
                    return __("Error Enabling Auto Update");
                  },
                  finally() {
                    queryClient.invalidateQueries(
                      {
                        queryKey: ["setting/get"],
                      },
                      {},
                    );
                    table.resetRowSelection();
                  },
                },
              );
            });
          });
        });
      },
    },
    {
      id: "disable-autoupdate",
      label: __("Disable Auto-Update"),
      action: items => {
        items.forEach(({ original: item }) => {
          addTask(() => {
            return new Promise((resolve, reject) => {
              toast.promise(
                autoupdatePromise({
                  type: item.type,
                  slug: item.slug,
                  enabled: false,
                }),
                {
                  description: item.title,
                  loading: __("Disabling Auto Update"),
                  success() {
                    resolve(item);
                    return __("Auto Update Disabled");
                  },
                  error() {
                    reject(item);
                    return __("Error Disabling Auto Update");
                  },
                  finally() {
                    queryClient.invalidateQueries({
                      queryKey: ["setting/get"],
                    });
                    table.resetRowSelection();
                  },
                },
              );
            });
          });
        });
      },
    },
  ];
  const columns = useMemo<ColumnDef<ThemePluginItemType, unknown>[]>(
    () => getColumns(),
    [],
  );
  const { table } = useDataTable({
    data: data,
    columns,
  });
  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      bulkActions={bulkActions}
    />
  );
}
