import useApiFetch from "./useApiFetch";
type AutoUpdateType = Record<string, boolean>;
type SettingType = {
  autoupdate?: {
    "wordpress-themes"?: AutoUpdateType;
    "wordpress-plugins"?: AutoUpdateType;
    "elementor-template-kits"?: AutoUpdateType;
  };
};
export default function useSetting() {
  const { data: setting, isFetched: settingIsFetched } =
    useApiFetch<SettingType>(`setting/get`);

  return { setting, settingIsFetched };
}
