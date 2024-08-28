<?php

namespace FestingerVault;

use WP_Error;
use Theme_Upgrader;
use Plugin_Upgrader;
use WP_Ajax_Upgrader_Skin;

class Installer {
    /**
     * @var array
     */
    private $download_detail;

    /**
     * @var array
     */
    private $item_detail;

    /**
     * WP_Upgrader
     *
     * @var \Theme_Upgrader|\Plugin_Upgrader
     */
    private $wp_installer;

    /**
     * @param array $item_detail
     * @param array $download_detail
     */
    function __construct($item_detail, $download_detail) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        if (!class_exists('Plugin_Upgrader', false)) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        }
        $this->item_detail     = $item_detail;
        $this->download_detail = $download_detail;
        $skin                  = new WP_Ajax_Upgrader_Skin([]);
        if ("wordpress-themes" == $item_detail["type"]) {
            $this->wp_installer = new Theme_Upgrader($skin);
        } else {
            $this->wp_installer = new Plugin_Upgrader($skin);
        }
    }

    /**
     * Runs installatin or update depending on whether the destination theme/plugin exists or not.
     * @return array|bool|WP_Error
     */
    function run() {
        $destination = false;
        if ("wordpress-plugins" == $this->item_detail["type"]) {
            $destination = trailingslashit(WP_PLUGIN_DIR) . $this->download_detail["slug"];
        } elseif ("wordpress-themes" == $this->item_detail["type"]) {
            $destination = trailingslashit(get_theme_root()) . $this->download_detail["slug"];
        }
        if (false !== $destination) {
            $installed= $this->wp_installer->run([
                "package"                     => $this->download_detail["link"],
                "destination"                 => $destination,
                "abort_if_destination_exists" => false,
            ]);
			if(\is_wp_error($installed)){
				error_log($installed->get_error_message());
				return new WP_Error(400,__("Error while Installing"));
			}
			return $installed;
        }
        return new WP_Error("invalid_destination", "Installation failed");
    }

    /**
     * @param array $download_detail
     */
    function set_download_detail($download_detail) {
        $this->download_detail = $download_detail;
    }

    /**
     * @param array $item_detail
     */
    function set_item_detail($item_detail) {
        $this->item_detail = $item_detail;
    }
}
