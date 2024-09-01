import { ActivationDetailType } from "@/types/license";
import useApiFetch from "./use-api-fetch";

export default function useActivation() {
  const license = useApiFetch<ActivationDetailType>(`license/detail`);

  return license;
}
