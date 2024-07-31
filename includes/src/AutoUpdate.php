<?php

namespace FestingerVault;

class AutoUpdate {
    /**
     * @var mixed
     */
    private static $instance = null;

    function __construct() {
        add_action('init', [$this, 'schedule_action']);
        add_action(Constants::ACTION_KEY, [$this, 'auto_update']);
        add_action(Constants::ACTION_KEY, [$this, 'auto_update']);
        add_action(Constants::ACTION_KEY . "/run-update", [$this, 'auto_update_run']);
        add_action(Constants::ACTION_KEY . "/cleanup", [$this, 'cleanup']);
    }

    function auto_update() {
        $settings    = get_option(Constants::SETTING_KEY, Constants::DEFAULT_SETTINGS);
        $engine_data = Helper::get_item_updates();
        if (!is_wp_error($engine_data)) {
            foreach ($engine_data['data'] as $item) {
                if (isset($settings["autoupdate"][$item["type"]][$item["slug"]]) && true === $settings["autoupdate"][$item["type"]][$item["slug"]]) {
                    if (version_compare($item["version"], $item["installed_version"], "gt") === true) {
                        if (function_exists("as_schedule_single_action")) {
                            as_schedule_single_action(time(), Constants::ACTION_KEY . "/run-update", [
                                $item["id"],
                            ], Constants::API_SLUG);
                        }
                    }
                }
            }
        }
    }

    /**
     * @param $item_id
     */
    function auto_update_run($item_id) {
        try {
            $result = Helper::engine_post("item/detail", [
                "item_id" => $item_id,
            ]);
            if (is_wp_error($result)) {
                return false;
            }
            $item_detail = json_decode(wp_remote_retrieve_body($result), true);
            $result      = Helper::engine_post("item/download", [
                "item_id" => $item_id,
                "method"  => "update",
            ]);
            if (is_wp_error($result)) {
                return false;
            }
            $download_detail = json_decode(wp_remote_retrieve_body($result), true);
            if ("elementor-template-kits" === $item_detail["type"]) {
                return false;
            }
            $installer = new Installer($item_detail, $download_detail, "update");
            $installer->run();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    function cleanup() {
        global $wpdb;
        $group_id = $wpdb->get_var($wpdb->prepare("SELECT group_id FROM {$wpdb->prefix}actionscheduler_groups WHERE slug=%s", Constants::API_SLUG));
        if ($group_id) {
            $wpdb->query($wpdb->prepare("DELETE actions, logs FROM {$wpdb->prefix}actionscheduler_actions actions LEFT JOIN {$wpdb->prefix}actionscheduler_logs logs ON ( logs.action_id = actions.action_id) WHERE group_id=%d AND scheduled_date_gmt < (NOW() - INTERVAL 1 HOUR) AND status=%s", $group_id, "complete"));
        }
    }

    public static function get_instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    function schedule_action() {
        if (function_exists('as_has_scheduled_action')) {
            if (false === as_has_scheduled_action(Constants::ACTION_KEY)) {
                as_schedule_recurring_action(strtotime('1 hour'), 1 * HOUR_IN_SECONDS, Constants::ACTION_KEY, [], Constants::API_SLUG, true);
            }
            if (false === as_has_scheduled_action(Constants::ACTION_KEY . "/cleanup")) {
                as_schedule_recurring_action(strtotime('1 hour'), 1 * HOUR_IN_SECONDS, Constants::ACTION_KEY . "/cleanup", [], Constants::API_SLUG, true);
            }
        }
    }
}
