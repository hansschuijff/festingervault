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
			"setting/get" => [
				'callback' => [$this, 'get_setting'],
				'permission_callback' => [$this, "user_can_install"],
			],
			"update-autoupdate" => [
				'callback' => [$this, 'update_autoupdate'],
				'permission_callback' => [$this, "user_can_install"],

			],

		];
	}
	public function get_setting(WP_REST_Request $request)
	{
		$settings = get_option(Constants::AUTOUPDATE_SETTING_KEY, ["wordpress-plugins" => [], "wordpress-themes" => []]);
		return ["wordpress-plugins" => array_values($settings["wordpress-plugins"]), "wordpress-themes" => array_values($settings["wordpress-themes"])];
	}

	/**
	 * @param WP_REST_Request $request
	 */
	public function update_autoupdate(WP_REST_Request $request)
	{
		$types = ["wordpress-themes", "wordpress-plugins"];
		$type = $request->get_param("type");
		$slug = $request->get_param("slug");
		$enabled = $request->get_param("enabled");
		if (!in_array($type, $types)) {
			return new WP_Error(400, "Error enabling auto-update");
		}
		$setting = get_option(Constants::AUTOUPDATE_SETTING_KEY, []);
		if (!isset($setting[$type])) {
			$setting[$type] = [];
		}
		if ($enabled) {
			$setting[$type] = array_unique(array_merge(array_filter($setting[$type], function ($item) {
				return is_string($item);
			}), [$slug]));
		} else {
			$setting[$type] = array_unique(array_filter($setting[$type], function ($item) use ($slug) {
				return $item !== $slug;
			}));
		}
		update_option(Constants::AUTOUPDATE_SETTING_KEY, $setting);
		return [
			"message" => __("Success", 'festingervault'),
		];
	}

}
