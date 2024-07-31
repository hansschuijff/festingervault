<?php
namespace FestingerVault;

class Admin {
    const PAGE_ID = "festingervault";

    /**
     * @var mixed
     */
    private static $instance = null;

    /**
     * @var mixed
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
        add_filter("dependencies/vault-main",[$this,'added_dependencies']);
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
		if($this->is_current()){
        	$this->enqueue_scripts();
			$this->render_page();
			die;
		}
    }

    function admin_menu() {
        $this->page = \add_menu_page(
            "FestingerVault",
            "FestingerVault",
            "manage_options",
            self::PAGE_ID,
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
        wp_set_script_translations('vault-main', 'festingervault');
		wp_localize_script("vault-main","vault",[
			"logo"=>Plugin::p_url("public/assets/logo-%s.png")
		]);
    }

    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function is_current() {
        return (!empty($_GET['page']) && self::PAGE_ID === $_GET['page']);
    }

    function render_page() {
		global $title, $hook_suffix, $current_screen, $wp_locale, $pagenow,
		$update_title, $total_update_count, $parent_file, $typenow;
		  require __DIR__ . '/view/admin.php';
    }
    function added_dependencies($dependencies=[]){
        return array_merge($dependencies,[
            "wp-api-fetch",
            "wp-i18n",
			"wp-html-entities",
			"moment"
        ]);
    }
}
