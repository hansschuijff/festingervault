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
		label:"WordPress Themes",
		description:"Tailored Premium WordPress themes"
	},
	"wordpress-plugins": {
		slug: "wordpress-plugins",
		label:"WordPress Plugins",
		description:"Tailored Premium WordPress plugins"
	},
	"elementor-template-kits": {
		slug: "elementor-template-kits",
		label:"Template Kits",
		description:"Elementor Template Kits"
	},
	"wishlist": {
		slug: "wishlist",
		label:"Requests",
		description:"Wishlisted Items"
	}
};
