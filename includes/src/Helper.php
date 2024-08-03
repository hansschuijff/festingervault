<?php

namespace FestingerVault;

class Helper {
    /**
     * @param string $path
     * @param array $data
     * @return mixed
     */
    public static function engine_post(string $path, $data = []) {
        $data = array_merge($data, [
            "site_information" => self::get_site_information(),
        ]);
        $content_body = json_encode($data);
        //echo $content_body;
        $result = wp_remote_post(
            \trailingslashit(Constants::ENGINE_URL)."api/client/" . trim($path, "/"),
            [
                'sslverify' => defined("WP_DEBUG") && WP_DEBUG == true ? false : true,
                "headers"   => [
                    'Content-Type' => 'application/json',
                    'X-Install-ID' => get_option(Constants::ACTIVATION_KEY, ""),
                ],
                'body'      => $content_body,
            ]
        );
        if (wp_remote_retrieve_response_code($result) !== 200) {
            $body = json_decode(wp_remote_retrieve_body($result));
            return new \WP_Error(400, $body);
        }
        return $result;
    }

    /**
     * @return mixed
     */
    public static function get_item_updates() {
        $installed_themes  = wp_list_pluck(Helper::installed_themes(), "version", "slug");
        $installed_plugins = wp_list_pluck(Helper::installed_plugins(), "version", "slug");

        $response = Helper::engine_post("update/list", [
            "themes"  => $installed_themes,
            "plugins" => $installed_plugins,
        ]);
        if (is_wp_error($response)) {
            return new \WP_Error("Invalid Request");
        }
        $result = json_decode(wp_remote_retrieve_body($response), true);
        $data   = [];
        foreach ($result["data"] as $item) {
            if ("wordpress-themes" == $item["type"] && isset($installed_themes[$item["slug"]])) {
                $item["installed_version"] = $installed_themes[$item["slug"]];
				$item["path"]=$installed_themes["path"];
            }if ("wordpress-plugins" == $item["type"] && isset($installed_plugins[$item["slug"]])) {
                $item["installed_version"] = $installed_plugins[$item["slug"]];
				$item["path"]=$installed_plugins["path"];
			}
			$data[]=$item;
        }
		usort($data,function($a,$b){
			// if(version_compare($a["version"],$a["installed_version"],"gt")){
			// 	return -1;
			// }
			return $a["title"] > $b["title"]?1:-1;
		});
		usort($data,function($a,$b){
			return version_compare($a["version"],$a["installed_version"]) < version_compare($b["version"],$b["installed_version"]);
		});
        return ["data"=>$data];
    }

    /**
     * @return mixed
     */
    public static function get_site_information() {
        global $wpdb;
        $site_url     = get_site_url();
        $admin_email  = get_option('admin_email');
        $table_prefix = $wpdb->prefix;
        $plugin_uuid  = get_option('fv_uuid');

        if (!$plugin_uuid) {
            $plugin_uuid = wp_generate_uuid4();
            update_option('fv_uuid', $plugin_uuid);
        }
        $data = [
            'site_url'     => $site_url,
            'admin_email'  => $admin_email,
            'table_prefix' => $table_prefix,
            'uuid'         => $plugin_uuid,
            'wp_path'      => \ABSPATH,
        ];
        return $data;
    }

    /**
     * @return mixed
     */
    public static function installed_plugins() {
        if (!function_exists("get_plugins")) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $plugins = get_plugins();
        $result  = [];
        foreach ($plugins as $file_path => $plugin) {
            $slug     = Helper::slug_from_path($file_path);
            $result[] = [
                "slug"    => $slug,
                "path"    => $file_path,
                "name"    => $plugin["Name"],
                "version" => $plugin["Version"],
            ];
        }
        return $result;
    }

    /**
     * @return mixed
     */
    public static function installed_themes() {
        if (!function_exists("wp_get_themes")) {
            require_once ABSPATH . 'wp-admin/includes/theme.php';
        }
        $themes = wp_get_themes();
        $result = [];
        foreach ($themes as $slug => $theme) {
            $result[] = [
                "slug"    => $slug,
                "path"    => $slug,
                "name"    => $theme->get("Name"),
                "version" => $theme->get("Version"),
            ];
        }
        return $result;
    }

    /**
     * @param $slug
     * @return mixed
     */
    public static function plugin_slug_to_path($slug) {
        $plugins = self::installed_plugins();
        foreach ($plugins as $plugin) {
            if ($plugin["slug"] === $slug) {
                return $plugin["path"];
            }
        }
        return false;
    }

    /**
     * @param $path
     */
    public static function slug_from_path($path = "") {
        $parts = explode("/", $path);
        return array_shift($parts);
    }
}
