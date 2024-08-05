import { ActivationDetailType } from "@/types/license";
import useApiFetch from "./useApiFetch";
type AutoUpdateType = Record<string, boolean>;
type SettingType = {
  autoupdate?: {
    "wordpress-themes"?: AutoUpdateType;
    "wordpress-plugins"?: AutoUpdateType;
    "elementor-template-kits"?: AutoUpdateType;
  };
};
export default function useActivation() {
  const license = useApiFetch<ActivationDetailType>(`license/detail`);

  return license;
}
