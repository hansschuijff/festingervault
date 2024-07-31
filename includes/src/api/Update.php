<?php

namespace FestingerVault\api;

use FestingerVault\Helper;
use FestingerVault\Constants;

class Update extends ApiBase {
    /**
     * @param \WP_REST_Request $request
     */
    public function list(\WP_REST_Request $request) {
        $items= Helper::get_item_updates();
		if(!is_wp_error($items)){
			return new \WP_REST_Response($items,200);
		}
		return new \WP_REST_Response(["error"=>true,"message"=>"Error retrieving update data"],200);

    }

    public function endpoints() {

        return [

            "list"              => [
                'callback'            => [$this, 'list'],
                'permission_callback' => [$this, "user_can_install"],
            ],
            "update-autoupdate" => [
                'callback'            => [$this, 'update_autoupdate'],
                'permission_callback' => [$this, "user_can_install"],

            ],

        ];
    }

    /**
     * @param \WP_REST_Request $request
     */
    public function update_autoupdate(\WP_REST_Request $request) {
        $type    = $request->get_param("type");
        $slug    = $request->get_param("slug");
        $enabled = $request->get_param("enabled");
        if (!in_array($type, ["wordpress-themes", "wordpress-plugins"])) {
            return new \WP_REST_Response([
                "error"   => true,
                "message" => __("Invalid request", "festingervault"),
            ], 400);
        }
        $setting = get_option(Constants::SETTING_KEY, Constants::DEFAULT_SETTINGS);
        if (!isset($setting["autoupdate"])) {
            $setting["autoupdate"] = [];
        }
        if (!isset($setting["autoupdate"][$type])) {
            $setting["autoupdate"][$type] = [];
        }
        $setting["autoupdate"][$type][$slug] = true == $enabled;

        update_option(Constants::SETTING_KEY, $setting);
        return new \WP_REST_Response([
            "message" => __("Success", "festingervault"),
        ], 200);

    }

    protected function prefix() {
        return "update";
    }
}
