import { Switch } from "@/components/ui/switch";
import useApiMutation from "@/hooks/useApiMutation";
import useSetting from "@/hooks/useSetting";
import { __ } from "@/lib/i18n";
import { ThemePluginItemType } from "@/types/item";
import { AutoupdatePostSchema } from "@/types/update";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { decodeEntities } from "@wordpress/html-entities";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  row: Row<ThemePluginItemType>;
};

export default function AutoUpdateSwitcher({ row }: Props) {
  const queryClient = useQueryClient();
  const { setting, settingIsFetched } = useSetting();
  const {
    isPending: isPendingAutoUpdateRequest,
    mutateAsync: autoupdatePromise,
  } = useApiMutation<any, AutoupdatePostSchema>("update/update-autoupdate");
  const [checked, setChecked] = useState<boolean>(false);
  const update_autoupdate = useCallback(
    (enabled: boolean) => {
      toast.promise(
        autoupdatePromise({
          type: row.original.type,
          slug: row.original.slug,
          enabled: enabled,
        }),
        {
          description: decodeEntities(row.original.title),
          loading: __("Updating Autoupdate"),
          success() {
            setChecked(enabled);
            queryClient.invalidateQueries({
              queryKey: ["setting/get"],
            });
            return enabled
              ? __("Autoupdate Enabled")
              : __("Autoupdate Disabled");
          },
          error: "Something went wrong. Try again later",
        },
      );
    },
    [row, queryClient, setChecked],
  );
  useEffect(() => {
    if (setting && setting.autoupdate[row.original.type][row.original.slug]) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [setting, settingIsFetched, setChecked, row]);
  return (
    <Switch
      checked={checked}
      onCheckedChange={update_autoupdate}
      disabled={isPendingAutoUpdateRequest}
    />
  );
}
