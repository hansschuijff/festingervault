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
import { Loader } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useInstalled from "./use-is-installed";
import useApiMutation from "./useApiMutation";
import { PostItemType } from "@/types/item";
export type PluginInstallResponse = {
  message: string;
  link?: string;
};
export type PluginInstallSchema = {
  item_id: number | string;
  method: "install" | "update" | "download" | string;
  path?: string;
};

export default function useInstall(item: PostItemType) {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const isThemePlugin = ["wordpress-themes", "wordpress-plugins"].includes(
    item.type,
  );
  const { isPending: isInstallPending, mutateAsync: installPlugin } =
    useApiMutation<PluginInstallResponse, PluginInstallSchema>("item/install");
  const { list } = useInstalled();
  const isInstalled = useMemo(() => list?.find(i => i.id === item.id), [list]);
  function install_item() {
    setDrawerOpen(false);
    toast.promise(
      installPlugin({
        item_id: item.id,
        method: isInstalled ? "update" : "install",
      }),
      {
        description: decodeEntities(item.title),
        loading: isThemePlugin
          ? isInstalled
            ? "Updating"
            : "Installing"
          : "Downloading",
        success(data) {
          if (data.link && item.type == "elementor-template-kits") {
            window.open(data.link, "_blank");
          }
          queryClient.invalidateQueries({
            queryKey: ["update/list"],
          });
          return __("Successful");
        },
        error(err) {
          return __("Error");
        },
      },
    );
  }
  function InstallButton() {
    return (
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={isInstallPending}
            onClick={e => {
              setDrawerOpen(true);
            }}
          >
            {/* <Download width={14} /> */}
            <span>
              {isThemePlugin
                ? isInstalled
                  ? version_compare(
                      isInstalled.version,
                      isInstalled.installed_version,
                      "gt",
                    ) === true
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
                {`${isInstalled ? __("Update") : "Install"} ${decodeEntities(item.title)}`}
              </DrawerTitle>
              <DrawerDescription className="flex flex-col gap-2 text-center">
                {isThemePlugin
                  ? isInstalled
                    ? sprintf(
                        "Update version from %s to %s",
                        isInstalled.installed_version,
                        isInstalled.version,
                      )
                    : sprintf("Install version %s", item.version)
                  : sprintf("Download version %s", item.version)}
              </DrawerDescription>
              <DrawerDescription className="flex flex-col gap-2 text-center">
                {sprintf(
                  __("%s would consume %d download credit from your account."),
                  isThemePlugin
                    ? isInstalled
                      ? __("Update")
                      : __("Install")
                    : __("Download"),
                  item.owned ? 0 : 1,
                )}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <div className="flex flex-row justify-center gap-4">
                <Button
                  onClick={install_item}
                  variant="default"
                  className="gap-2"
                >
                  <span>
                    {isThemePlugin
                      ? isInstalled
                        ? __("Update")
                        : __("Install")
                      : __("Download")}
                  </span>
                </Button>
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
  return { isInstalled, InstallButton };
}
