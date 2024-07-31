<?php
/*
 * Plugin Name:							FestingerVault
 * Plugin URI:							https://festingervault.com
 * Description:							FestingerVault Plugin
 * Version:								1.0.0-b.1
 * Requires at Least:					5.2
 * Requires PHP:						7.2
 * Author:								FestingerVault
 * Author URI:							https://festingervault.com/
 * License:								GPL-2.0+
 * License URI:							https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:							https://festingervault.com
 * Text Domain:							festingervault
 */

if (!defined('ABSPATH')) {
    die();
}

if (file_exists(__DIR__ . "/includes/lib/autoload.php")) {
    require_once __DIR__ . "/includes/lib/autoload.php";
    \FestingerVault\Plugin::get_instance();
    \FestingerVault\Plugin::set_main_file(__FILE__);
}
if(file_exists(__DIR__ . "/includes/lib/woocommerce/action-scheduler/action-scheduler.php")){
    require_once __DIR__ . "/includes/lib/woocommerce/action-scheduler/action-scheduler.php";
}
