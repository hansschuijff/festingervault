<?php

namespace FestingerVault;

class Upgrade
{
	/**
	 * @var mixed
	 */
	public $cache_allowed;

	/**
	 * @var mixed
	 */
	public $cache_key;

	/**
	 * @var mixed
	 */
	public $plugin_slug;

	/**
	 * @var mixed
	 */
	public $version;

	/**
	 * @var mixed
	 */
	private static $instance = null;
	private static $file;


	function __construct($file)
	{
		if (defined('WP_DEBUG') && WP_DEBUG === true) {
			add_filter('https_ssl_verify', '__return_false');
			add_filter('https_local_ssl_verify', '__return_false');
			add_filter('http_request_host_is_external', '__return_true');
		}
		if (!function_exists('get_plugin_data')) {
			require_once(ABSPATH . 'wp-admin/includes/plugin.php');
		}
		self::$file = $file;
		$plugin_info = get_plugin_data($file);
		$this->plugin_slug   = dirname(plugin_basename($file));
		$this->version       = $plugin_info['Version'];
		$this->cache_key     = 'vault_updater';
		$this->cache_allowed = false;

		add_filter('plugins_api', [$this, 'info'], 20, 3);
		add_filter('site_transient_update_plugins', [$this, 'update']);
		add_action('upgrader_process_complete', [$this, 'purge'], 10, 2);
	}

	public static function get_instance($file)
	{
		if (is_null(self::$instance)) {
			self::$instance = new self($file);
		}
		return self::$instance;
	}

	/**
	 * @param $response
	 * @param $action
	 * @param $args
	 * @return mixed
	 */
	function info($response, $action, $args)
	{
		if (($action == 'query_plugins' || $action == 'plugin_information') &&
			isset($args->slug) && $args->slug === $this->plugin_slug
		) {

			// get updates
			$remote = $this->request();
			if (!$remote) {
				return $response;
			}

			$response = $remote;
		}
		return $response;
	}

	/**
	 * @param $upgrader
	 * @param $options
	 */
	public function purge($upgrader, $options)
	{

		if ($this->cache_allowed && 'update' === $options['action'] && 'plugin' === $options['type']) {
			// just clean the cache when new plugin version is installed
			delete_transient($this->cache_key);
		}
	}

	/**
	 * @return mixed
	 */
	public function request()
	{
		$urlBase = "https://github.com/FestingerVault/festingervault/raw/beta-release/";

		$remote = get_transient($this->cache_key);

		if (false === $remote || !$this->cache_allowed) {

			$remote = wp_remote_get(
				//'https://raw.githubusercontent.com/FestingerVault/festingervault/beta-release/info.json',
				$urlBase . "info.json",
				[
					'timeout' => 10,
					'headers' => [
						'Accept' => 'application/json',
					],
				]
			);

			if (is_wp_error($remote) || 200 !== wp_remote_retrieve_response_code($remote) || empty(wp_remote_retrieve_body($remote))) {
				return false;
			}
			$remote = json_decode(wp_remote_retrieve_body($remote), false);
			$response = new \stdClass();

			$response->name           = $remote->name;
			$response->slug           = $remote->slug;
			$response->version        = $remote->version;
			$response->tested         = $remote->tested;
			$response->requires       = $remote->requires;
			$response->author         = $remote->author;
			$response->author_profile = $remote->author_profile;
			$response->homepage       = $remote->homepage;
			$response->requires_php   = $remote->requires_php;
			$response->last_updated   = $remote->last_updated;
			$response->sections = [
				'description'  => $remote->sections->description,
				'installation' => $remote->sections->installation,
				'changelog'    => $remote->sections->changelog
			];
			$response->banners = [
				'low'  => $remote->banners->low,
				'high' => $remote->banners->high,
			];
			$response->icons = [
				"1x" => $remote->icon,
			];
			$response->download_link     = $urlBase . "festingervault.zip";
			$response->plugin         = plugin_basename(self::$file);
			set_transient($this->cache_key, $remote, 2 * HOUR_IN_SECONDS);
			return $response;
		}
		return false;
	}

	/**
	 * @param $transient
	 * @return mixed
	 */
	public function update($transient)
	{

		if (empty($transient->checked)) {
			return $transient;
		}

		$remote = $this->request();
		if ($remote && version_compare($this->version, $remote->version, '<')) {
			$response              = $this->request();
			$response->new_version   = $response->version;
			$response->package     = $response->download_link;
			$transient->response[$response->plugin] = $response;
		}
		return $transient;
	}
}
