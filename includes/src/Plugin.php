<?php

namespace FestingerVault;

class Plugin {
    /**
     * Class Constructor
     *
     *
     */
    public $hooks;

    /**
     * @var mixed
     */
    public static $settings;

    /**
     * Plugin main file
     *
     * @var string
     */
    private static $file;

    /**
     * @var mixed
     */
    private static $instance = null;

    public function __construct() {
        Admin::get_instance();
        RestAPI::get_instance();
        AutoUpdate::get_instance();
    }

    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * plugin_dir
     *
     * @param  string $path
     * @return string Full resolved path
     */
    public static function p_dir($path = "") {
        return trailingslashit(dirname(self::$file)) . trim($path, '/');
    }

    /**
     * plugin_url
     *
     * @param  string $path
     * @return string Full resolved url
     */
    public static function p_url($path = "") {
        return plugins_url(trim($path, '/'), self::$file);
    }

    /**
     * @param string $file
     */
    public static function set_main_file($file) {
        self::$file = $file;
    }
}
