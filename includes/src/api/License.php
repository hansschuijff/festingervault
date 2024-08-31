<?php

namespace FestingerVault\api;

use FestingerVault\{
    Constants,
    Helper
};

class License extends ApiBase {
    /**
     * @param \WP_REST_Request $request
     */
    public function activate_license(\WP_REST_Request $request) {
        $license_key = $request->get_param("license_key");
        $result      = Helper::engine_post("license/activate", [
            "license_key"      => $license_key,
            "site_information" => Helper::get_site_information(),
        ]);
        if (!is_wp_error($result)) {
            update_option(Constants::ACTIVATION_KEY, $result["activation_key"]);
            return ["message" => "Activation Successful"];
        }
        return new \WP_Error(400, "Error Activating License");
    }

    /**
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function deactivate_license(\WP_REST_Request $request) {
        $activation_key = get_option(Constants::ACTIVATION_KEY, null);
        $result         = Helper::engine_post("license/deactivate", [
            "activation_key" => $activation_key,
        ]);
        if (!is_wp_error($result)) {

            if (isset($result["activation_key"])) {
                delete_option(Constants::ACTIVATION_KEY);
            }
            return $result;
        }
        return new \WP_Error(400, "Error deactivating license");
    }

    /**
     * @param \WP_REST_Request $request
     */
    public function detail(\WP_REST_Request $request) {
        return Helper::engine_post("license/activations");

    }

    public function endpoints() {
        return [
            "activate"   => [
                'methods'  => "POST",
                'callback' => [$this, 'activate_license'],
            ],
            "deactivate" => [
                'callback' => [$this, 'deactivate_license'],
            ],
            "detail"     => [
                'callback' => [$this, 'detail'],
            ],
        ];
    }

    protected function prefix() {
        return "license";
    }
}
