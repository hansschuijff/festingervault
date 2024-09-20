import { __ } from "@/lib/i18n";
import { EnumItemSlug, EnumItemType } from "@/zod/item";
import { z } from "zod";

type TItemType ={
  slug: z.infer<typeof EnumItemSlug>;
	type:z.infer<typeof EnumItemType>;
  label: string;
  description: string;
}

export const item_types: TItemType[] = [{
		slug:"themes",
    type: "wordpress-themes",
    label: __("Themes"),
    description: __("Tailored Premium WordPress themes"),
  },
   {
    slug: "plugins",
    type: "wordpress-plugins",
    label: __("Plugins"),
    description: __("Tailored Premium plugins"),
  },
   {
    slug: "template-kits",
    type: "elementor-template-kits",
    label: __("Template Kits"),
    description: __("Template Kits"),
  },
];
