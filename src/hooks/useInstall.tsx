import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import version_compare from "@/utils/version_compare";
import { useQueryClient } from "@tanstack/react-query";
import { decodeEntities } from "@wordpress/html-entities";
import { __, sprintf } from "@wordpress/i18n";
import { CloudDownload, Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useInstalled from "./use-is-installed";
import useApiMutation from "./useApiMutation";
import { PostChangelogType, PostItemType } from "@/types/item";
import useActivation from "./use-activation";
import { useNavigate } from "@/router";
export type PluginInstallResponse = {
  message: string;
  link?: string;
};
export type PluginInstallSchema = {
  item_id: number | string;
  method: "install" | "update" | "download" | string;
  path?: string;
  media_id?: number;
};

export default function useInstall(
  item: PostItemType,
  media?: PostChangelogType,
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isInstallable = useMemo(
    () => ["wordpress-themes", "wordpress-plugins"].includes(item.type),
    [item],
  );
  const { isPending: isInstallPending, mutateAsync: installPlugin } =
    useApiMutation<PluginInstallResponse, PluginInstallSchema>("item/install");
  const { data: activation } = useActivation();
  const { list } = useInstalled();
  const isInstalled = useMemo(() => list?.find(i => i.id === item.id), [list]);
  const isNewerVersion = useMemo(() => {
    if (isInstalled) {
      return (
        version_compare(
          isInstalled.version,
          isInstalled.installed_version,
          "gt",
        ) === true
      );
    }
  }, [isInstalled, list]);
  function install_item(is_download?: boolean) {
    if (typeof activation?.plan_type == "undefined") {
      toast.error(__("License not activated"));
      navigate("/activation");
      return;
    }
    toast.promise(
      installPlugin({
        item_id: item.id,
        method: is_download === true ? "download" : "install",
      }),
      {
        description: decodeEntities(item.title),
        loading:
          is_download === true
            ? "Downloading"
            : isInstalled
              ? isNewerVersion
                ? "Updating"
                : "Re-Installing"
              : "Installing",
        success(data) {
          if (data.link && is_download === true) {
            window.open(data.link, "_blank");
          }
          queryClient.invalidateQueries({
            queryKey: ["update/list"],
          });
          queryClient.invalidateQueries({
            queryKey: ["item/detail"],
          });
          return __("Successful");
        },
        error(err) {
          return err.message;
        },
      },
    );
  }
  function InstallButton() {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={isInstallPending}
          >
            <CloudDownload width={16} />
            <span>
              {isInstallable
                ? isInstalled
                  ? isNewerVersion
                    ? "Update"
                    : "Re-Install"
                  : "Install"
                : "Download"}
            </span>
            {isInstallPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : null}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="text-center">
              <DrawerTitle className="text-center leading-normal">
                {decodeEntities(item.title)}
              </DrawerTitle>
              <DrawerDescription
                className="flex flex-col gap-2 text-center"
                asChild
              >
                <div>
                  <div>
                    {isInstallable
                      ? isInstalled
                        ? isNewerVersion
                          ? sprintf(
                              "Update version from %s to %s",
                              isInstalled.installed_version,
                              isInstalled.version,
                            )
                          : sprintf(
                              __("Re-install version %s"),
                              isInstalled.version,
                            )
                        : sprintf("Install version %s", item.version)
                      : sprintf("Download version %s", item.version)}
                  </div>
                  <div>
                    {sprintf(
                      __(
                        "%d download credit would be consumed from your account.",
                      ),
                      1,
                    )}
                  </div>
                  <div className="flex flex-row justify-center gap-2 divide-x">
                    <div className="px-4">
                      Daily Limit: {activation?.today_limit}
                    </div>
                    <div className="px-4">
                      Used Limit: {activation?.today_limit_used}
                    </div>
                    {activation?.plan_title === "recurring" && (
                      <div className="p-4">
                        Total Limit: {activation?.total_limit}
                      </div>
                    )}
                  </div>
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <div className="flex flex-row justify-center gap-4">
                {isInstallable && (
                  <DrawerClose asChild>
                    <Button
                      onClick={() => install_item(false)}
                      variant="default"
                      className="gap-2"
                    >
                      <span>
                        {isInstalled
                          ? isNewerVersion
                            ? "Update"
                            : "Re-Install"
                          : "Install"}
                      </span>
                    </Button>
                  </DrawerClose>
                )}
                <DrawerClose asChild>
                  <Button
                    onClick={() => install_item(true)}
                    variant="default"
                    className="gap-2"
                  >
                    <span>{__("Download")}</span>
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline">{__("Cancel")}</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  return { isInstalled, isNewerVersion, InstallButton };
}
