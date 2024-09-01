<?php

namespace FestingerVault\api;

use WP_Error;
use WP_REST_Request;

use FestingerVault\{
	Constants,
	Helper
};

class Update extends ApiBase
{

	public function list(WP_REST_Request $request)
	{
		return Helper::get_item_updates();
	}

	public function endpoints()
	{

		return [

			"list" => [
				'callback' => [$this, 'list'],
				'permission_callback' => [$this, "user_can_install"],
			],
			"update-autoupdate" => [
				'callback' => [$this, 'update_autoupdate'],
				'permission_callback' => [$this, "user_can_install"],

			],

		];
	}

	/**
	 * @param WP_REST_Request $request
	 */
	public function update_autoupdate(WP_REST_Request $request)
	{
		$type = $request->get_param("type");
		$slug = $request->get_param("slug");
		$enabled = $request->get_param("enabled");
		if (!in_array($type, ["wordpress-themes", "wordpress-plugins"])) {
			return new WP_Error(400, "Error enabling auto-update");
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
		return [
			"message" => __("Success", 'festingervault'),
		];
	}

}
