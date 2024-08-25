import { DataTable } from "@/components/data-table";
import { BulkActionType } from "@/components/data-table-bulk-action";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import useInstalled from "@/hooks/use-is-installed";
import useTaskQueue from "@/hooks/use-task-queue";
import useApiMutation from "@/hooks/useApiMutation";
import { PluginInstallResponse, PluginInstallSchema } from "@/hooks/useInstall";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/data-table";
import { ThemePluginItemType } from "@/types/item";
import { AutoupdatePostSchema } from "@/types/update";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { __ } from "@wordpress/i18n";
import { useMemo } from "react";
import { toast } from "sonner";
import { getColumns } from "./columns";

const filterableColumns: DataTableFilterableColumn<ThemePluginItemType>[] = [
  {
    id: "type",
    title: "Type",
    options: [
      {
        label: "Themes",
        value: "wordpress-themes",
      },
      {
        label: "Plugins",
        value: "wordpress-plugins",
      },
    ],
  },
];
const searchableColumns: DataTableSearchableColumn<ThemePluginItemType>[] = [
  { id: "title", placeholder: "Search downloads..." },
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
      label: __("Update", 'festingervault'),
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
                  loading: __("Updating", 'festingervault'),
                  success(data) {
                    resolve(data);
                    return __("Success", 'festingervault');
                  },
                  error(err) {
                    reject(err);
                    return err.message ?? __("Error", 'festingervault');
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
      label: __("Re-Install", 'festingervault'),
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
                  loading: __("Re-installing", 'festingervault'),
                  success() {
                    resolve(item);
                    return __("Re-Install Success", 'festingervault');
                  },
                  error(err) {
                    reject(err);
                    return err.message ?? __("Error Installing", 'festingervault');
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
      label: __("Enable Auto-Update", 'festingervault'),
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
                  loading: __("Enabling Auto Update", 'festingervault'),
                  success() {
                    resolve(item);
                    return __("Auto Update Enabled", 'festingervault');
                  },
                  error() {
                    reject(item);
                    return __("Error Enabling Auto Update", 'festingervault');
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
      label: __("Disable Auto-Update", 'festingervault'),
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
                  loading: __("Disabling Auto Update", 'festingervault'),
                  success() {
                    resolve(item);
                    return __("Auto Update Disabled", 'festingervault');
                  },
                  error() {
                    reject(item);
                    return __("Error Disabling Auto Update", 'festingervault');
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
