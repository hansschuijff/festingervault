import version_compare from "@/lib/version_compare";
import { CollectionResponse } from "@/types/api";
import { TThemePluginItem } from "@/types/item";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import useApiFetch from "./use-api-fetch";

export default function useInstalled() {
  const { data, isFetched, isLoading } =
    useApiFetch<CollectionResponse<TThemePluginItem>>(`update/list`);
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
			queryKey: ["license/detail"],
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
