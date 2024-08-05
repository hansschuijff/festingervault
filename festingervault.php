<?php
/*
 * Plugin Name: Festinger Vault - 25K+ Premium WordPress themes and plugins
 * Plugin URI: https://festingervault.com
 * Description: Imagine going to Themeforest, buying a theme, and logging out. Now, you come to Festinger's, where we offer you 25K+ premium themes and plugins directly available from your WordPress dashboard.
 * Version: 5.0.0-beta.2.3
 * Requires at Least: 5.2
 * Requires PHP: 7.2
 * Author: FestingerVault
 * Author URI: https://festingervault.com/
 * License: GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI: https://festingervault.com
 * Text Domain: festingervault
 */

if (!defined('ABSPATH')) {
    die();
}

if (file_exists(__DIR__ . "/includes/lib/autoload.php")) {
    require_once __DIR__ . "/includes/lib/autoload.php";
    \FestingerVault\Plugin::get_instance();
    \FestingerVault\Plugin::set_main_file(__FILE__);
    \FestingerVault\Upgrade::get_instance(__FILE__);
}
if (file_exists(__DIR__ . "/includes/lib/woocommerce/action-scheduler/action-scheduler.php")) {
    require_once __DIR__ . "/includes/lib/woocommerce/action-scheduler/action-scheduler.php";
}
