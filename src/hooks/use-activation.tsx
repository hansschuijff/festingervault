import { ActivationDetailType } from "@/types/license";
import useApiFetch from "./use-api-fetch";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useActivation() {
	const queryClient = useQueryClient();
	const { data, isLoading, isFetching } =
		useApiFetch<ActivationDetailType>(`license/detail`);
	const clearCache = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["license/detail"],
		});
	}, [queryClient]);
	return { data, isLoading, isFetching, clearCache };
}
