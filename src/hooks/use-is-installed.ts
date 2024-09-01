import { CollectionResponse } from "@/types/api";
import { ThemePluginItemType } from "@/types/item";
import version_compare from "@/lib/version_compare";
import { useMemo } from "react";
import useApiFetch from "./use-api-fetch";
import { useQueryClient } from "@tanstack/react-query";

export default function useInstalled() {
  const { data, isFetched, isLoading } =
    useApiFetch<CollectionResponse<ThemePluginItemType>>(`update/list`);
		const queryClient=useQueryClient();
  const updateable = useMemo(
    () =>
      data?.data?.filter(
        item =>
          version_compare(item.version, item.installed_version??"", "gt") === true,
      ),
    [data],
  );
	const clearCache=()=>{
		queryClient.invalidateQueries({
			queryKey: ["update/list"],
		});
		queryClient.invalidateQueries({
			queryKey: ["item/detail"],
		});
		queryClient.invalidateQueries({
			queryKey:["history/list"]
		});
	}
  return { list: data?.data, isLoading, isFetched, updateable, clearCache };
}
