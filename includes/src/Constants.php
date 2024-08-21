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
	const PLUGIN_INFO_URL="https://raw.githubusercontent.com/FestingerVault/festingervault/beta-release/info.json";
	const PLUGIN_DOWNLOAD_URL="https://raw.githubusercontent.com/FestingerVault/festingervault/beta-release/festingervault.zip";
}
