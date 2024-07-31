<?php

namespace FestingerVault;

class Installer {
    /**
     * @var mixed
     */
    private $download_detail;

    /**
     * @var mixed
     */
    private $item_detail;

    /**
     * @var mixed
     */
    private $mode;

    /**
     * @var mixed
     */
    private $type;

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
    function __construct($item_detail, $download_detail, $mode = "install") {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        if (!class_exists('Plugin_Upgrader', false)) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        }
        $this->item_detail     = $item_detail;
        $this->download_detail = $download_detail;
        $this->mode            = $mode;
        $skin                  = new \WP_Ajax_Upgrader_Skin([]);
        if ("wordpress-themes" == $item_detail["type"]) {
            $this->wp_installer = new \Theme_Upgrader($skin);
        } else {
            $this->wp_installer = new \Plugin_Upgrader($skin);
        }
    }

    function run() {
        if ("install" == $this->mode) {
            return $this->install();
        } elseif ("update" == $this->mode) {
            return $this->update();
        }
        return false;
    }

    /**
     * @param $download_detail
     */
    function set_download_detail($download_detail) {
        $this->download_detail = $download_detail;
    }

    /**
     * @param $item_detail
     */
    function set_item_detail($item_detail) {
        $this->item_detail = $item_detail;
    }

    /**
     * @param $plugins
     */
    private function inject_plugin_update_info($plugins) {
        $repo_updates = get_site_transient('update_plugins');

        if (!is_object($repo_updates)) {
            $repo_updates = new \stdClass;
        }

        foreach ($plugins as $slug => $plugin) {
            $file_path = $plugin['file_path'];

            if (empty($repo_updates->response[$file_path])) {
                $repo_updates->response[$file_path] = new \stdClass;
            }
            // We only really need to set package, but let's do all we can in case WP changes something.
            $repo_updates->response[$file_path]->slug        = $slug;
            $repo_updates->response[$file_path]->plugin      = $file_path;
            $repo_updates->response[$file_path]->new_version = $plugin['version'];
            $repo_updates->response[$file_path]->package     = $plugin['source'];
        }
        set_site_transient('update_plugins', $repo_updates);
    }

    /**
     * @param $themes
     */
    private function inject_theme_update_info($themes) {
        $repo_updates = get_site_transient('update_themes');
        if (!is_object($repo_updates)) {
            $repo_updates = new \stdClass;
        }
        foreach ($themes as $slug => $theme) {
            $repo_updates->response[$slug] = [
                "theme"       => $slug,
                "slug"        => $slug,
                "new_version" => $theme['version'],
                "package"     => $theme['source'],
            ];
        }
        set_site_transient('update_themes', $repo_updates);
    }

    /**
     * @return mixed
     */
    private function install() {
        return $this->wp_installer->install($this->download_detail["link"]);
    }

    /**
     * @return mixed
     */
    private function update() {
        $path = $this->download_detail["slug"];
        if ("wordpress-plugins" == $this->item_detail["type"]) {
            $path                                      = Helper::plugin_slug_to_path($this->item_detail["slug"]);
            $to_inject                                 = [];
            $to_inject[$this->download_detail["slug"]] = [
                "source"    => $this->download_detail["link"],
                "file_path" => $path,
                "version"   => $this->download_detail["version"],
                "slug"      => $this->download_detail["slug"],
            ];
            $this->inject_plugin_update_info($to_inject);
        } else {
            $to_inject                                 = [];
            $to_inject[$this->download_detail["slug"]] = [
                "source"  => $this->download_detail["link"],
                "version" => $this->download_detail["version"],
                "slug"    => $this->download_detail["slug"],
            ];
            $this->inject_theme_update_info($to_inject);
        }
        return $this->wp_installer->upgrade($path);
    }
}
