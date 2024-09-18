import { siteConfig } from "@/config/site";
import { useMutation } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";

export default function useApiMutation<
  TResponse = {},
  TData = {},
	TError={}
>(path: string) {
  const mutation = useMutation({
    mutationFn: async (data: TData) => {
      return apiFetch<TResponse>({
        path: `/${siteConfig.slug}/v1/${path}`,
        method: "POST",
        data: data,
      });
    },
		onError:(error:TError)=>{
			return error;
		}
  });
  return mutation;
}
