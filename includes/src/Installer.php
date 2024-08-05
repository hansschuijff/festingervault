<?php

namespace FestingerVault;

class Installer
{
	/**
	 * @var mixed
	 */
	private $download_detail;

	/**
	 * @var mixed
	 */
	private $item_detail;


	/**
	 * WP_Upgrader
	 *
	 * @var \Theme_Upgrader|\Plugin_Upgrader
	 */
	/**
	 * @return mixed
	 */
	private $wp_installer;

	/**
	 * @param $item_detail
	 * @param $download_detail
	 * @param $mode
	 */
	function __construct($item_detail, $download_detail)
	{
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
		require_once ABSPATH . 'wp-admin/includes/misc.php';
		if (!class_exists('Plugin_Upgrader', false)) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		}
		$this->item_detail     = $item_detail;
		$this->download_detail = $download_detail;
		$skin                  = new \WP_Ajax_Upgrader_Skin([]);
		if ("wordpress-themes" == $item_detail["type"]) {
			$this->wp_installer = new \Theme_Upgrader($skin);
		} else {
			$this->wp_installer = new \Plugin_Upgrader($skin);
		}
	}
	/**
	 * Runs installatin or update depending on whether the destination theme/plugin exists or not.
	 * @return array|bool|\WP_Error
	 */
	function run()
	{
		$destination = false;
		if ("wordpress-plugins" == $this->item_detail["type"]) {
			$destination = trailingslashit(WP_PLUGIN_DIR) . $this->download_detail["slug"];
		} elseif ("wordpress-themes" == $this->item_detail["type"]) {
			$destination = trailingslashit(get_theme_root()) . $this->download_detail["slug"];
		}
		if ($destination !== false) {
			return $this->wp_installer->run([
				"package" => $this->download_detail["link"],
				"destination" => $destination,
				"abort_if_destination_exists" => false,
			]);
		}
		return new \WP_Error("invalid_destination", "Installation failed");
	}

	/**
	 * @param $download_detail
	 */
	function set_download_detail($download_detail)
	{
		$this->download_detail = $download_detail;
	}

	/**
	 * @param $item_detail
	 */
	function set_item_detail($item_detail)
	{
		$this->item_detail = $item_detail;
	}
}
