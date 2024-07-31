import { z } from "zod";
import { CollectionResponse } from "./api";
export const ItemTypeEnum = z.enum([
  "wordpress-themes",
  "wordpress-plugins",
  "elementor-template-kits",
]);

export const AccessEnum=z.enum([
	"gold",
	"bronze",
	"silver",
])

export type PostItemType<Ex = never> = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  type: Exclude<z.infer<typeof ItemTypeEnum>,Ex>;
  author: string;
  category: string;
  updated: number;
  created: number;
  version: string;
  owned: boolean;
  access?: z.infer<typeof AccessEnum>;
  installed_version?: string;
};
export type PostItemCollectionResponse = CollectionResponse<PostItemType>;
export type ItemStatsResponse = {
  total: number;
  themes: number;
  plugins: number;
  kits: number;
};
export type ThemePluginItemType=PostItemType<"elementor-template-kits">;
