<?php

namespace FestingerVault;

class Constants {
    const ACTION_KEY = "festingervault";

    const ACTIVATION_KEY = "vault_activation_key";

    const ADMIN_MENU_TITLE = "FestingerVault";

    const ADMIN_PAGE_ID = "festingervault";

    const ADMIN_PAGE_TITLE = "FestingerVault";

    const DEFAULT_SETTINGS = [
        "autoupdate" => [
            "wordpress-themes"  => [],
            "wordpress-plugins" => [],
        ],
    ];

    const ENGINE_URL = "https://engine.sovit.top";

    const PLUGIN_DOWNLOAD_URL = "https://raw.githubusercontent.com/FestingerVault/festingervault/beta-release/festingervault.zip";

    const PLUGIN_INFO_URL = "https://raw.githubusercontent.com/FestingerVault/festingervault/beta-release/info.json";

    const SCRIPT_HANDLE = "fv-main";

    const SETTING_KEY = "vault_settings";

    const SLUG = "festingervault";

    const TEXTDOMAIN = "festingervault";

    const TYPES = ["theme", "plugin", "kits", "wishlist"];
}
