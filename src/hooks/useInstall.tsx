import { PostItemType, PostMediaType } from "@/types/item";
import version_compare from "@/utils/version_compare";
import { useMemo } from "react";
import useInstalled from "./use-is-installed";
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

export default function useInstall(item: PostItemType, media?:PostMediaType) {
  const isInstallable = useMemo(
    () => ["wordpress-themes", "wordpress-plugins"].includes(item.type),
    [item],
  );

  const { list } = useInstalled();
  const isInstalled = useMemo(
    () => list?.find(i => i.id === item.id),
    [list],
  );
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
    return false;
  }, [isInstalled, list]);

	const isRollBack=useMemo(()=>{
		if(isInstalled && media){
			return (
        version_compare(
          isInstalled.installed_version,
					media.version,
          "gt",
        ) === true
      );
		}
		return false;
	},[isInstalled, media])

  return { isInstalled, isNewerVersion, isInstallable, isRollBack };
}
