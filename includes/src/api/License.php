<?php

namespace FestingerVault\api;

use FestingerVault\Constants;
use FestingerVault\Helper;

class License extends ApiBase
{
	protected function prefix()
	{
		return "license";
	}
	function endpoints()
	{
		return [
			"activate" => [
				'methods' => "POST",
				'callback' => [$this, 'activate_license'],
			],
			"deactivate" => [
				'callback' => [$this, 'deactivate_license'],
			],
			"detail" => [
				'callback' => [$this, 'detail'],
			]
		];
	}
	function activate_license(\WP_REST_Request $request)
	{
		$license_key = $request->get_param("license_key");
		$result = Helper::engine_post("license/activate", [
			"license_key" => $license_key,
			"site_information" => Helper::get_site_information(),
		]);
		if (!is_wp_error($result)) {
			$body = json_decode(wp_remote_retrieve_body($result), true);
			if (isset($body["error"])) {
				return new \WP_REST_Response($body, 400);
			}
			update_option(Constants::ACTIVATION_KEY, $body["activation_key"]);
			return rest_ensure_response(["message" => "Activation Successful"]);
		}
		return new \WP_REST_Response(["message" => $result->get_error_message()], 400);
	}
	function detail(\WP_REST_Request $request)
	{
		$result = Helper::engine_post("license/activations");
		if (!is_wp_error($result)) {
			$body = json_decode(wp_remote_retrieve_body($result), true);
			if (isset($body["error"])) {
				return new \WP_REST_Response($body, 400);
			}
			$body = json_decode(wp_remote_retrieve_body($result), true);
			return rest_ensure_response($body);
		}
		return new \WP_REST_Response(["message" => $result->get_error_message()], 400);
	}
	function deactivate_license(\WP_REST_Request $request)
	{
		$activation_key = get_option(Constants::ACTIVATION_KEY, null);
		$result = Helper::engine_post("license/deactivate", [
			"activation_key" => $activation_key,
		]);
		if (!is_wp_error($result)) {
			$body = json_decode(wp_remote_retrieve_body($result), true);
			if (isset($body["error"])) {
				return new \WP_REST_Response($body, 400);
			}
			if (isset($body["activation_key"])) {
				delete_option(Constants::ACTIVATION_KEY);
			}
			$body = json_decode(wp_remote_retrieve_body($result), true);
			return rest_ensure_response($body);
		}
		return new \WP_REST_Response(["message" => $result->get_error_message()], 400);
	}
}
