import { CollectionResponse } from "@/types/api";
import { ThemePluginItemType } from "@/types/item";
import version_compare from "@/utils/version_compare";
import { useMemo } from "react";
import useApiFetch from "./useApiFetch";

export default function useInstalled() {
	const { data, isFetched, isLoading } = useApiFetch<
		CollectionResponse<ThemePluginItemType>
	>(`update/list`);
	const updateable = useMemo(() => data?.data?.filter(
		item =>
			version_compare(item.version, item.installed_version, "gt") ===
			true,
	), [data]);
	return { list: data?.data, isLoading, isFetched, updateable };

}
