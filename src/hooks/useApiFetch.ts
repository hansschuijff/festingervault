import { siteConfig } from "@/config/site";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";

export default function useApiFetch<
  ResponseDataType,
  PostDataType = Record<string, any>,
>(path: string, data?: PostDataType, enabled = true) {
  const query = useQuery<ResponseDataType, Error>({
    queryKey: [path, data].filter(item => item),
    queryFn: async () => {
      try {
        const response = await apiFetch<ResponseDataType>({
          path: `${siteConfig.slug}/v1/${path}`,
          method: "POST",
          data,
        });
        return response;
      } catch (error) {
        throw new Error(`Failed to fetch data from ${path}: ${error.message}`);
      }
    },
    placeholderData: keepPreviousData,
    enabled,
  });

  return query;
}
