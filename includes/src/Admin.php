<?php
namespace FestingerVault;

class Admin {
    /**
     * @var mixed
     */
    private static $instance = null;

    /**
     * @var mixed
     */
    /**
     * @param array $dependencies
     */
    private $page = null;

    /**
     * @var mixed
     *
     */
    function __construct() {
        add_action('admin_menu', [$this, 'admin_menu'], PHP_INT_MAX);
        add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts'], PHP_INT_MAX);
        add_action("admin_init", [$this, 'admin_init']);
        add_filter("dependencies/vault-main", [$this, 'added_dependencies']);
    }

    function added_dependencies($dependencies = []) {
        return array_merge($dependencies, [
            "wp-api-fetch",
            "wp-i18n",
            "wp-html-entities",
            "moment",
        ]);
    }

    /**
     * @param $screen
     */
    function admin_enqueue_scripts($screen) {
        if ($screen == $this->page) {
            $this->enqueue_scripts();

        }
    }

    function admin_init() {
        if ($this->is_current()) {
            $this->enqueue_scripts();
            $this->render_page();
            die;
        }
    }

    function admin_menu() {
        $this->page = \add_menu_page(
            Constants::ADMIN_PAGE_TITLE,
            Constants::ADMIN_MENU_TITLE,
            "manage_options",
            Constants::ADMIN_PAGE_ID,
            [$this, 'render_page'],
            "",
            1,
        );
        // $admin_page_hooks["festingervault"] = 'festingervault';
    }

    function enqueue_scripts() {
        $assets = new ViteAssets(Plugin::p_dir("build"), Plugin::p_url("build"));
        $assets->enqueue("src/index.tsx", [
            "handle" => "vault-main",
        ]);
        wp_set_script_translations('vault-main', Constants::TEXTDOMAIN);
        wp_localize_script("vault-main", "vault", [
            "logo" => Plugin::p_url("public/assets/logo-%s.png"),
        ]);
    }

    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function is_current() {
        return (!empty($_GET['page']) && Constants::ADMIN_PAGE_ID === $_GET['page']);
    }

    function render_page() {
        global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow,
        $update_title, $total_update_count, $parent_file, $typenow;
        require __DIR__ . '/view/admin.php';
    }
}
