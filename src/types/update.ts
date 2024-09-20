import { z } from "zod";
import { EnumItemType } from "@/zod/item";

export type AutoupdatePostSchema = {
  type: Exclude<z.infer<typeof EnumItemType>, "elementor-template-kits">;
  slug: string;
  enabled: boolean;
};
