<?php

namespace FestingerVault\api;

use FestingerVault\Constants;

class Setting extends ApiBase {
    public function endpoints() {

        return [

            "get"    => [
                'callback'            => [$this, 'get_setting'],
                'permission_callback' => [$this, "user_can_install"],
            ]
        ];
    }

    /**
     * @param \WP_REST_Request $request
     */
    public function get_setting(\WP_REST_Request $request) {
        return get_option(Constants::SETTING_KEY, Constants::DEFAULT_SETTINGS);
    }
}
