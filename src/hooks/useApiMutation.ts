import { siteConfig } from "@/config/site";
import { CollectionResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";

export default function useApiMutation<
  ResponseDataType = {},
  MutationData = {},
>(path: string) {
  const mutation = useMutation({
    mutationFn: async (data: MutationData) => {
      return apiFetch<ResponseDataType>({
        path: `/${siteConfig.slug}/v1/${path}`,
        method: "POST",
        data: data,
      });

    },
  });
  return mutation;
}
