import { PostItemType } from "@/pages/item/[type]/-[page]/_components/PostGridItem";
import { CollectionResponse } from "@/types/api";
import useApiFetch from "./useApiFetch";
import version_compare from "@/utils/version_compare";
import { useMemo } from "react";

export default function useInstalled() {
	const { data, isFetched, isLoading } = useApiFetch<
		CollectionResponse<PostItemType>
	>(`update/list`);
	const updateable = useMemo(() => data?.data?.filter(
		item =>
			version_compare(item.version, item.installed_version, "gt") ===
			true,
	), [data]);
	return { list: data?.data, isLoading, isFetched, updateable };

}
