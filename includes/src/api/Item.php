<?php

namespace FestingerVault\api;

use FestingerVault\Helper;
use FestingerVault\Installer;

class Item extends ApiBase
{
	/**
	 * @param \WP_REST_Request $request
	 */
	public function detail(\WP_REST_Request $request)
	{
		$item_id = $request->get_param("id");

		$result = Helper::engine_post("item/detail", [
			"item_id" => $item_id,
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

	public function endpoints()
	{

		return [
			"list"    => [
				'callback' => [$this, 'items'],
			],
			"categories"    => [
				'callback' => [$this, 'categories'],
			],
			"detail"  => [
				'callback' => [$this, 'detail'],
			],
			"stats"  => [
				'callback' => [$this, 'stats'],
			],
			"install" => [
				'callback'            => [$this, 'install'],
				'permission_callback' => [$this, "user_can_install"],
			],

		];
	}

	/**
	 * @param $plugins
	 */
	public function inject_plugin_update_info($plugins)
	{
		$repo_updates = get_site_transient('update_plugins');

		if (!is_object($repo_updates)) {
			$repo_updates = new \stdClass;
		}

		foreach ($plugins as $slug => $plugin) {
			$file_path = $plugin['file_path'];

			if (empty($repo_updates->response[$file_path])) {
				$repo_updates->response[$file_path] = new \stdClass;
			}
			// We only really need to set package, but let's do all we can in case WP changes something.
			$repo_updates->response[$file_path]->slug        = $slug;
			$repo_updates->response[$file_path]->plugin      = $file_path;
			$repo_updates->response[$file_path]->new_version = $plugin['version'];
			$repo_updates->response[$file_path]->package     = $plugin['source'];
		}
		set_site_transient('update_plugins', $repo_updates);
	}

	/**
	 * @param $themes
	 */
	public function inject_theme_update_info($themes)
	{
		$repo_updates = get_site_transient('update_themes');
		if (!is_object($repo_updates)) {
			$repo_updates = new \stdClass;
		}
		foreach ($themes as $slug => $theme) {
			$repo_updates->response[$slug] = [
				"theme"       => $slug,
				"slug"        => $slug,
				"new_version" => $theme['version'],
				"package"     => $theme['source'],
			];
		}
		set_site_transient('update_themes', $repo_updates);
	}

	/**
	 * @param \WP_REST_Request $request
	 */
	public function install(\WP_REST_Request $request)
	{
		$item_id = $request->get_param("item_id");
		$method  = $request->get_param("method");
		$result  = Helper::engine_post("item/detail", [
			"item_id" => $item_id,
		]);
		if (is_wp_error($result)) {
			return new \WP_REST_Response(["message" => "Error getting Item detail"], 400);
		}
		$item_detail = json_decode(wp_remote_retrieve_body($result), true);
		$result      = Helper::engine_post("item/download", [
			"item_id" => $item_id,
			"method"  => $method,
		]);
		if (is_wp_error($result)) {
			return new \WP_REST_Response($result->get_error_message(), 400);
		}
		$download_detail = json_decode(wp_remote_retrieve_body($result), true);
		if ("elementor-template-kits" === $item_detail["type"]) {
			return new \WP_REST_Response($download_detail, 200);
		}
		$installer = new Installer($item_detail, $download_detail, $method);
		$status    = $installer->run();
		if (is_wp_error($status)) {
			return new \WP_REST_Response(['error' => true, 'message' => "Error installing plugin"], 200);
		}
		return new \WP_REST_Response(['success' => true], 200);
	}

	/**
	 * @param \WP_REST_Request $request
	 */
	public function items(\WP_REST_Request $request)
	{
		$type   = $request->get_param("type");
		$page   = $request->get_param("page");
		$keyword   = $request->get_param("keyword");
		$filter   = $request->get_param("filter");
		$sort   = $request->get_param("sort");
		$per_page   = $request->get_param("per_page");
		$result = Helper::engine_post("item/list", [
			"type" => $type,
			"page" => $page,
			"keyword" => $keyword,
			"filter" => $filter,
			"sort" => $sort,
			"per_page" => $per_page,
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
	public function categories(\WP_REST_Request $request)
	{
		$type   = $request->get_param("type");
		$result = Helper::engine_post("item/categories", [
			"type" => $type,
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

	public function stats(\WP_REST_Request $request)
	{
		$result = Helper::engine_post("item/stats");
		if (!is_wp_error($result)) {
			$body = json_decode(wp_remote_retrieve_body($result), true);
			if (isset($body["error"])) {
				return new \WP_REST_Response($body, 400);
			}
			return rest_ensure_response($body);
		}
		return new \WP_REST_Response(["code"=>400,"message" => $result->get_error_message()], 404);
	}

	protected function prefix()
	{
		return "item";
	}
}
