import { Button, ButtonProps } from "@/components/ui/button";
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
import useActivation from "@/hooks/use-activation";
import useInstalled from "@/hooks/use-is-installed";
import useApiMutation from "@/hooks/useApiMutation";
import { PluginInstallResponse } from "@/hooks/useInstall";
import { useNavigate, useParams } from "@/router";
import { DemoContentType, PostItemType } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { __, sprintf } from "@wordpress/i18n";
import { CloudDownload, Download, Loader } from "lucide-react";
import { toast } from "sonner";
type AdditionalContentDownloadSchema = {
  item_id: number | string;
  media_id?: number;
};
type Props = {
  item: PostItemType;
  media: DemoContentType;
} & ButtonProps;

export default function AdditionalDownloadButton({
  item,
  media,
  size,
  variant,
}: Props) {
  const navigate = useNavigate();
  const { data: activation } = useActivation();
  const { isPending: isInstallPending, mutateAsync: downloadAdditional } =
    useApiMutation<PluginInstallResponse, AdditionalContentDownloadSchema>(
      "item/download-additional",
    );

  const { clearCache } = useInstalled();
  function download() {
    if (typeof activation?.plan_type == "undefined") {
      toast.error(__("License not activated"));
      navigate("/activation");
      return;
    }
    toast.promise(
      downloadAdditional({
        item_id: item.id,
        media_id: media.id,
      }),
      {
        description: decodeEntities(media.title),
        loading: "Downloading",
        success(data) {
          if (data.link) {
            window.open(data.link, "_blank");
          }
          return __("Successful");
        },
        error(err) {
          return err.message;
        },
        finally() {
          clearCache();
        },
      },
    );
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="flex items-center gap-2"
          disabled={isInstallPending}
        >
          {isInstallPending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <CloudDownload width={16} />
          )}
          {size != "icon" && <span>{"Download"}</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-center leading-normal">
              {decodeEntities(media.title)}
            </DrawerTitle>
            <DrawerDescription
              className="flex flex-col gap-2 text-center"
              asChild
            >
              <div>
                <div>
                  {sprintf(
                    "Download demo content %s of %s",
                    media.title,
                    item.title,
                  )}
                </div>
                <div>
                  {sprintf(
                    __(
                      "%d download credit would be consumed from your account.",
                    ),
                    1,
                  )}
                </div>
                <div className="flex flex-row justify-center divide-x">
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
              <DrawerClose asChild>
                <Button onClick={() => download()} className="gap-2">
                  <Download size={16} />
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
