<?php

namespace FestingerVault;

class Constants
{
	//const ENGINE_URL = "https://engine.sovit.top/api/client/";
	const ENGINE_URL = "https://engine-dev.festingervault.com/api/client/";
	const API_SLUG = "festingervault";
	const TYPES = ["theme", "plugin", "kits", "wishlist"];
	const ACTIVATION_KEY = "vault_activation_key";
	const SETTING_KEY = "vault_settings";
	const DEFAULT_SETTINGS = [
		"autoupdate" => [
			"wordpress-themes"  => [],
			"wordpress-plugins" => [],
		],
	];
	const ACTION_KEY="festingervault/autoupdate";
}
