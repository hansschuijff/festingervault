import { z } from "zod";

export const EnumAccessLevel = z.enum(["gold", "bronze", "silver"]);

export const EnumItemType = z.enum([
	"wordpress-themes",
	"wordpress-plugins",
	"elementor-template-kits",
]);

export const EnumItemSlug = z.enum(["themes", "plugins", "template-kits"]);
