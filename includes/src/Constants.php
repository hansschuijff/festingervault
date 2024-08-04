<?php

namespace FestingerVault;

class Constants
{
	const ACTION_KEY = "festingervault";

	const ACTIVATION_KEY = "vault_activation_key";

	const API_SLUG = "festingervault";

	const DEFAULT_SETTINGS = [
		"autoupdate" => [
			"wordpress-themes"  => [],
			"wordpress-plugins" => [],
		],
	];

	const ENGINE_URL = "https://engine.sovit.top";

	const SETTING_KEY = "vault_settings";

	const TYPES = ["theme", "plugin", "kits", "wishlist"];
}
