import { useCallback } from "react";
import useApiFetch from "./use-api-fetch";
import { useQueryClient } from "@tanstack/react-query";
import useApiMutation from "./use-api-mutation";
import { AutoupdatePostSchema } from "@/types/update";
import { toast } from "sonner";
import { TItemTypeEnum, TPostItem, TThemePluginItem } from "@/types/item";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@/lib/i18n";
type AutoUpdateType = Record<string, boolean>;
type SettingType = {
	"wordpress-themes"?: string[];
	"wordpress-plugins"?: string[];
};
export default function useAutoUpdate() {
	const {
		data: setting,
		isFetched,
		isLoading,
		isFetching,
	} = useApiFetch<SettingType>(`update/setting/get`);
	const queryClient = useQueryClient();

	const clearCache = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["update/setting/get"],
		});
	}, [queryClient]);
	const { isPending: isPendingUpdate, mutateAsync: autoupdatePromise } =
		useApiMutation<any, AutoupdatePostSchema>("update/update-autoupdate");
	const changeStatus = useCallback(
		(item: TThemePluginItem, enabled: boolean = false) =>
			new Promise((resolve, reject) =>
				toast.promise(
					autoupdatePromise({
						type: item.type,
						slug: item.slug,
						enabled: enabled,
					}),
					{
						description: decodeEntities(item.title),
						loading: __("Updating Autoupdate"),
						success(data) {
							clearCache();
							resolve(data);
							return enabled
								? __("Autoupdate Enabled")
								: __("Autoupdate Disabled");
						},
						error: err => {
							reject(err);
							return __("Something went wrong. Try again later");
						},
					},
				),
			),
		[queryClient, autoupdatePromise],
	);
	return {
		setting,
		isFetched,
		isLoading: isLoading || isPendingUpdate,
		isFetching,
		clearCache,
		changeStatus,
	};
}
