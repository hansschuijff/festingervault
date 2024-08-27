import { __ } from "@/lib/i18n";

interface ItemType {
	slug: string;
	label: string;
	description: string;
  }

  type ItemTypes<T extends string> = {
	[key in T]: ItemType;
  };

export const item_types :ItemTypes<string>= {
	"wordpress-themes": {
		slug: "wordpress-themes",
		label:__("WordPress Themes"),
		description:__("Tailored Premium WordPress themes")
	},
	"wordpress-plugins": {
		slug: "wordpress-plugins",
		label:__("WordPress Plugins"),
		description:__("Tailored Premium WordPress plugins")
	},
	"elementor-template-kits": {
		slug: "elementor-template-kits",
		label:__("Template Kits"),
		description:__("Elementor Template Kits")
	},
	"wishlist": {
		slug: "wishlist",
		label:__("Requests"),
		description:__("Wishlisted Items")
	}
};
