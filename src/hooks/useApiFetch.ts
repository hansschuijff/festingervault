import { siteConfig } from "@/config/site";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";

export default function useApiFetch<
  ResponseDataType,
  PostDataType = Record<string, any>,
>(path: string, data?: PostDataType, enabled = true) {
  const query = useQuery<ResponseDataType, Error>({
    queryKey: [path, data].filter(item => item),
    queryFn:  () =>apiFetch<ResponseDataType>({
			path: `${siteConfig.slug}/v1/${path}`,
			method: "POST",
			data,
		}),
    placeholderData: keepPreviousData,
    enabled,
  });

  return query;
}
