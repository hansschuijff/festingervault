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
		$item_id = $request->get_param("item_id");

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
			"changelog"  => [
				'callback' => [$this, 'changelog'],
			],
			"install" => [
				'callback'            => [$this, 'install'],
				'permission_callback' => [$this, "user_can_install"],
			],

		];
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
			return new \WP_Error("item_detail","Error getting Item detail");
		}
		$item_detail = json_decode(wp_remote_retrieve_body($result), true);
		$result      = Helper::engine_post("item/download", [
			"item_id" => $item_id,
			"method"  => $method,
		]);
		if (is_wp_error($result)) {
			return new \WP_Error("download_detail","Error getting zip file information");
		}
		$download_detail = json_decode(wp_remote_retrieve_body($result), true);
		if ("elementor-template-kits" === $item_detail["type"] || $method==="download") {
			return new \WP_REST_Response($download_detail, 200);
		}
		$installer = new Installer($item_detail, $download_detail);
		$status    = $installer->run();
		if (is_wp_error($status)) {
			return new \WP_Error("item_install","Error running item installation/update");
		}
		return new \WP_REST_Response(['success' => true]);
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
	public function changelog(\WP_REST_Request $request)
	{
		$page   = $request->get_param("page");
		$item_id = $request->get_param("item_id");
		$result = Helper::engine_post("item/changelog", [
			"item_id" => $item_id,
			"page" => $page
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
