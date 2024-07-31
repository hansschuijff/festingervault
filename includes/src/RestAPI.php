<?php

namespace FestingerVault;

use FestingerVault\api\Item;
use FestingerVault\api\ApiBase;
use FestingerVault\api\License;
use FestingerVault\api\Setting;
use FestingerVault\api\Update;

class RestAPI
{
	/**
	 * @var mixed
	 */
	private static $instance = null;

	function __construct()
	{
		$this->register(new License);
		$this->register(new Item());
		$this->register(new Update());
		$this->register(new Setting());
	}

	public static function get_instance()
	{
		if (is_null(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * @param ApiBase $instance
	 */
	function register(ApiBase $instance)
	{
		$instance->register();
	}
}
