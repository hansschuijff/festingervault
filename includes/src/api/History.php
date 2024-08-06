<?php

namespace FestingerVault\api;
use FestingerVault\Helper;

class History extends ApiBase {
    /**
     * @param \WP_REST_Request $request
     * @return mixed
     */
    public function list(\WP_REST_Request $request) {
        $page   = $request->get_param("page");
        $result = Helper::engine_post("history/list", [
            "page" => $page,
        ]);
        if (!is_wp_error($result)) {
            $body = json_decode(wp_remote_retrieve_body($result), true);
            if (isset($body["error"])) {
                return new \WP_REST_Response($body, 400);
            }
            return rest_ensure_response($body);
        }
        return new \WP_REST_Response(["message" => $result->get_error_message()], 400);
    }

    public function endpoints() {
        return [
            "list" => [
                'methods'  => "POST",
                'callback' => [$this, 'list'],
            ],

        ];
    }
}
