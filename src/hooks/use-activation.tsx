import { ActivationDetailType } from "@/types/license";
import useApiFetch from "./useApiFetch";

export default function useActivation() {
  const license = useApiFetch<ActivationDetailType>(`license/detail`);

  return license;
}
